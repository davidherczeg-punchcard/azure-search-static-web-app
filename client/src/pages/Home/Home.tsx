import { useRef, useEffect, useState } from "react";
import React from "react";
import axios from "../../axios.js";

import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0f172a",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#64748b",
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    h4: {
      fontWeight: 700,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)", // Similar to shadcn shadow
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      axios
        .post("/api/chat", {
          messages: [...messages, userMessage].map(({ content }) => ({
            content,
          })),
        })
        .then((response) => {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: response.data,
            },
          ]);
        })
        .catch((error) => {
          console.log(error);
          // throw new Error(`HTTP error! status: ${error.status}`);
        });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ height: "89vh", py: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Chat Interface
          </Typography>

          {/* Chat messages */}
          <Paper
            elevation={0}
            variant="outlined"
            sx={{
              flex: 1,
              mb: 2,
              p: 2,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              border: "1px solid",
              borderColor: "rgba(0, 0, 0, 0.12)",
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                overflowY: "auto",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                px: 1,
              }}
            >
              {messages.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Typography color="text.secondary">
                    Start a conversation by typing a message below.
                  </Typography>
                </Box>
              ) : (
                messages.map((message) => (
                  <Box
                    key={message.id}
                    sx={{
                      display: "flex",
                      justifyContent:
                        message.role === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: "80%",
                        p: 2,
                        backgroundColor:
                          message.role === "user" ? "primary.main" : "#f1f5f9", // Similar to shadcn bg-muted
                        color:
                          message.role === "user" ? "#ffffff" : "text.primary",
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body1">{message.content}</Typography>
                    </Box>
                  </Box>
                ))
              )}
              <div ref={messagesEndRef} />
            </Box>
          </Paper>

          {/* Input area */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", gap: 1 }}
          >
            <TextField
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              variant="outlined"
              size="medium"
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#ffffff",
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || !input.trim()}
              sx={{
                minWidth: "48px",
                height: "56px",
                p: 0,
                borderRadius: 2,
              }}
            >
              <SendIcon sx={{ fontSize: 20 }} />
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
