import React from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Box,
  Rating,
} from "@mui/material";

export default function ResultsPage({ document, handleBookClick }) {
  return (
    <>
      <Grid item xs={12} sm={6} md={4} key={document.id}>
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            transition:
              "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            },
          }}
        >
          <CardActionArea
            onClick={() => handleBookClick(document.id)}
            sx={{ flexGrow: 1 }}
          >
            <CardMedia
              component="img"
              height="200"
              image={document.image_url}
              alt={document.title}
              sx={{ objectFit: "cover" }}
            />
            <CardContent>
              <Typography variant="h6" component="div" noWrap>
                {document.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {document.authors.join(", ")}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <Rating
                  value={document.average_rating}
                  precision={0.1}
                  readOnly
                  size="small"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  {document.average_rating.toFixed(1)}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {document.original_publication_year}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </>
  );
}
