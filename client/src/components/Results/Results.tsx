import React from "react";
import ResultsPage from "./ResultsPage.tsx";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import "./Results.css";

export default function Results(props) {
  const navigate = useNavigate();

  let results = props.documents.map(({ document }, index) => {
    return (
      <ResultsPage
        key={index}
        document={document}
        handleBookClick={(bookId) => navigate(`/details/${bookId}`)}
      />
    );
  });

  let beginDocNumber = Math.min(props.skip + 1, props.count);
  let endDocNumber = Math.min(props.skip + props.top, props.count);

  return (
    <div>
      <p className="results-info">
        Showing {beginDocNumber}-{endDocNumber} of{" "}
        {props.count.toLocaleString()} results for <b>{props.query}</b>
      </p>
      <Grid container spacing={4}>
        {results}
      </Grid>
    </div>
  );
}
