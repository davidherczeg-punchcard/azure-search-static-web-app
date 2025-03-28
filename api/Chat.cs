using Azure;
using Azure.AI.OpenAI;
using Azure.AI.OpenAI.Chat;
using Azure.Core.Serialization;
using dotnet_fn;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using OpenAI.Chat;
using System.Linq;
using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

#pragma warning disable AOAI001

namespace WebSearch.Function;

public class Chat
{
    private static readonly string endpoint = Environment.GetEnvironmentVariable("AZURE_OPENAI_ENDPOINT", EnvironmentVariableTarget.Process);
    private static readonly string openAiKey = Environment.GetEnvironmentVariable("AZURE_OPENAI_KEY", EnvironmentVariableTarget.Process);
    private static readonly string deploymentName = Environment.GetEnvironmentVariable("AZURE_OPENAI_DEPLOYMENT_ID", EnvironmentVariableTarget.Process);
    private static readonly string searchEndpoint = Environment.GetEnvironmentVariable("AZURE_AI_SEARCH_ENDPOINT", EnvironmentVariableTarget.Process);
    private static readonly string searchIndex = Environment.GetEnvironmentVariable("AZURE_AI_SEARCH_INDEX", EnvironmentVariableTarget.Process);
    private static readonly string searchKey = Environment.GetEnvironmentVariable("AZURE_AI_SEARCH_KEY", EnvironmentVariableTarget.Process);

    private readonly ILogger<Lookup> _logger;

    public Chat(ILogger<Lookup> logger)
    {
        this._logger = logger;
    }

    [Function("chat")]
    public async Task<HttpResponseData> RunAsync(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req,
        FunctionContext executionContext)
    {
        var content = await req.ReadFromJsonAsync<UserMessage>();

        AzureOpenAIClient azureClient = new(
          new Uri(endpoint),
          new AzureKeyCredential(openAiKey)
        //new DefaultAzureCredential()
        );

        ChatClient chatClient = azureClient.GetChatClient(deploymentName);

        ChatCompletionOptions options = new();
        options.AddDataSource(new AzureSearchChatDataSource()
        {
            Endpoint = new Uri(searchEndpoint),
            IndexName = searchIndex,
            Authentication = DataSourceAuthentication.FromApiKey(searchKey),
        });

        ChatCompletion completion = chatClient.CompleteChat(
            [
                new UserChatMessage(content.Content),
            ],
            options);

        ChatMessageContext onYourDataContext = completion.GetMessageContext();

        if (onYourDataContext?.Intent is not null)
        {
            Console.WriteLine($"Intent: {onYourDataContext.Intent}");
        }
        foreach (ChatCitation citation in onYourDataContext?.Citations ?? [])
        {
            Console.WriteLine($"Citation: {citation.Content}");
        }

        var response = req.CreateResponse(HttpStatusCode.Found);

        // Serialize data
        var serializer = new JsonObjectSerializer(
            new JsonSerializerOptions(JsonSerializerDefaults.Web));
        await response.WriteAsJsonAsync(completion.Content, serializer);

        return response;
    }
}
