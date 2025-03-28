import React, { useEffect, useState } from "react";
import axios from "../../axios.js";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation, useNavigate } from "react-router-dom";

import Results from "../../components/Results/Results.tsx";
import Pager from "../../components/Pager/Pager.js";
import Facets from "../../components/Facets/Facets.js";
import SearchBar from "../../components/SearchBar/SearchBar.js";
import { Container } from "@mui/material";

import "./Search.css";

export default function Search() {
  let location = useLocation();
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [q, setQ] = useState(
    new URLSearchParams(location.search).get("q") ?? "*"
  );
  const [top] = useState<any>(
    new URLSearchParams(location.search).get("top") ?? 8
  );
  const [skip, setSkip] = useState(
    new URLSearchParams(location.search).get("skip") ?? 0
  );
  const [filters, setFilters] = useState([]);
  const [facets, setFacets] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  let resultsPerPage = top;

  useEffect(() => {
    setIsLoading(true);
    setSkip((currentPage - 1) * top);
    const body = {
      q: q,
      top: top,
      skip: skip,
      filters: filters,
    };

    axios
      .post("/api/search", body)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setResults(response.data.results);
        setFacets(response.data.facets);
        setResultCount(response.data.count);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [q, top, skip, filters, currentPage]);

  // pushing the new search term to history when q is updated
  // allows the back button to work as expected when coming back from the details page
  useEffect(() => {
    navigate("/search?q=" + q);
    setCurrentPage(1);
    setFilters([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  let postSearchHandler = (searchTerm) => {
    //console.log(searchTerm);
    setQ(searchTerm);
  };

  var body;
  if (isLoading) {
    body = (
      <div className="col-md-9">
        <CircularProgress />
      </div>
    );
  } else {
    body = (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Results
          documents={results}
          top={top}
          skip={skip}
          count={resultCount}
          query={q}
        ></Results>
        <Pager
          className="pager-style"
          currentPage={currentPage}
          resultCount={resultCount}
          resultsPerPage={resultsPerPage}
          setCurrentPage={setCurrentPage}
        ></Pager>
      </Container>
    );
  }

  // filters should be applied across entire result set,
  // not just within the current page
  const updateFilterHandler = (newFilters) => {
    // Reset paging
    setSkip(0);
    setCurrentPage(1);

    // Set filters
    setFilters(newFilters);
  };

  return (
    <main className="main main--search container-fluid">
      <div className="row">
        <div className="search-bar-column col-md-3">
          <div className="search-bar">
            <SearchBar
              postSearchHandler={postSearchHandler}
              query={q}
            ></SearchBar>
          </div>
          <Facets
            facets={facets}
            filters={filters}
            setFilters={updateFilterHandler}
          ></Facets>
        </div>
        <div className="col-md-9">{body}</div>
      </div>
    </main>
  );
}
