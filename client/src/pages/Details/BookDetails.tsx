import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Rating,
  Divider,
  Button,
  CircularProgress,
  LinearProgress,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BookIcon from "@mui/icons-material/Book";
import LanguageIcon from "@mui/icons-material/Language";
import StarIcon from "@mui/icons-material/Star";
import PeopleIcon from "@mui/icons-material/People";
import axios from "../../axios.js";
import Book from "../../models/Book";

const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const result = await axios.get("/api/lookup?id=" + id);
        setBook(result?.data?.document);
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("Failed to load book details");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  // Calculate rating percentages
  const calculateRatingPercentage = (
    ratingCount: number,
    totalCount: number
  ) => {
    return (ratingCount / totalCount) * 100;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="70vh"
          flexDirection="column"
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading book details...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error || !book) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="70vh"
          flexDirection="column"
        >
          <Typography variant="h5" color="error" gutterBottom>
            {error || "Book not found"}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={{ mt: 2 }}
          >
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back button */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={handleGoBack}
        sx={{ mb: 4 }}
      >
        Back to Search
      </Button>

      <Grid container spacing={4}>
        {/* Book Cover and Basic Info */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "rgba(0, 0, 0, 0.12)",
              borderRadius: 2,
              height: "100%",
            }}
          >
            <Box
              component="img"
              src={book.image_url}
              alt={book.title}
              sx={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
                borderRadius: 1,
                mb: 3,
              }}
            />

            <Typography variant="h5" component="h1" gutterBottom>
              {book.title}
            </Typography>

            {book.original_title !== book.title && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Original Title: {book.original_title}
              </Typography>
            )}

            <Typography variant="h6" component="div" sx={{ mb: 1 }}>
              by {book.authors.join(", ")}
            </Typography>

            <Box display="flex" alignItems="center" mb={2}>
              <Rating value={book.average_rating} precision={0.1} readOnly />
              <Typography variant="body1" sx={{ ml: 1 }}>
                {book.average_rating.toFixed(1)}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1.5}>
              <Box display="flex" alignItems="center">
                <BookIcon sx={{ mr: 1, color: "text.secondary" }} />
                <Typography variant="body2">
                  Published: {book.original_publication_year}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center">
                <LanguageIcon sx={{ mr: 1, color: "text.secondary" }} />
                <Typography variant="body2">
                  Language: {book.language_code?.toUpperCase() || "Unknown"}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center">
                <PeopleIcon sx={{ mr: 1, color: "text.secondary" }} />
                <Typography variant="body2">
                  {book.ratings_count.toLocaleString()} ratings
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="body2" gutterBottom>
                ISBN: {book.isbn}
              </Typography>
              <Typography variant="body2">ISBN13: {book.isbn13}</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Book Details and Ratings */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "rgba(0, 0, 0, 0.12)",
              borderRadius: 2,
              mb: 3,
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom>
              Ratings Distribution
            </Typography>

            <Box sx={{ mb: 4 }}>
              {[5, 4, 3, 2, 1].map((rating) => {
                const ratingCount = book[
                  `ratings_${rating}` as keyof Book
                ] as number;
                const percentage = calculateRatingPercentage(
                  ratingCount,
                  book.ratings_count
                );

                return (
                  <Box
                    key={rating}
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "60px",
                      }}
                    >
                      <Typography variant="body2" sx={{ mr: 0.5 }}>
                        {rating}
                      </Typography>
                      <StarIcon sx={{ fontSize: 16, color: "#faaf00" }} />
                    </Box>
                    <Box sx={{ flexGrow: 1, mx: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: "rgba(0, 0, 0, 0.08)",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor:
                              rating >= 4
                                ? "#4caf50"
                                : rating === 3
                                ? "#ff9800"
                                : "#f44336",
                          },
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ minWidth: "100px" }}>
                      {ratingCount.toLocaleString()} ({percentage.toFixed(1)}%)
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" component="h2" gutterBottom>
              Book Information
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Goodreads Book ID
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {book.goodreads_book_id}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Work ID
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {book.work_id}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Books Count
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {book.books_count}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Text Reviews
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {book.work_text_reviews_count.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "rgba(0, 0, 0, 0.12)",
              borderRadius: 2,
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom>
              Similar Books
            </Typography>

            <Typography variant="body1" color="text.secondary">
              This is a placeholder for similar books recommendations. In a real
              application, this would show books similar to "{book.title}" based
              on genre, author, or user preferences.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BookDetailsPage;
