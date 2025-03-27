using Azure;
using Azure.Core.Serialization;
using Azure.Search.Documents;
using Azure.Search.Documents.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;
using WebSearch.Models;

namespace WebSearch.Function;

public class AutoComplete
{
    private static readonly string searchApiKey = Environment.GetEnvironmentVariable("SearchApiKey", EnvironmentVariableTarget.Process);
    private static readonly string searchServiceName = Environment.GetEnvironmentVariable("SearchServiceName", EnvironmentVariableTarget.Process);
    private static readonly string searchIndexName = Environment.GetEnvironmentVariable("SearchIndexName", EnvironmentVariableTarget.Process) ?? "good-books";

    private readonly ILogger<Lookup> _logger;

    public AutoComplete(ILogger<Lookup> logger)
    {
        this._logger = logger;
    }

    [Function("autocomplete")]
    public async Task<HttpResponseData> RunAsync(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData req,
        FunctionContext executionContext)
    {
        // Get Document Id
        string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
        var data = JsonSerializer.Deserialize<RequestBodySuggest>(requestBody);

        // Azure AI Search 
        Uri serviceEndpoint = new($"https://{searchServiceName}.search.windows.net/");

        SearchClient searchClient = new(

            serviceEndpoint,
            searchIndexName,
            new AzureKeyCredential(searchApiKey)
        );

        AutocompleteOptions options = new()
        {
            Size = data.Size
        };

        var autoCompleteResponse = await searchClient.AutocompleteAsync(data.SearchText, data.SuggesterName, options);

        // Data to return
        var searchSuggestions = new Dictionary<string, List<AutocompleteItem>>
        {
            ["suggestions"] = [.. autoCompleteResponse.Value.Results]
        };

        var response = req.CreateResponse(HttpStatusCode.Found);

        // Serialize data
        var serializer = new JsonObjectSerializer(
            new JsonSerializerOptions(JsonSerializerDefaults.Web));
        await response.WriteAsJsonAsync(searchSuggestions, serializer);

        return response;
    }
}
