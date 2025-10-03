import { Paper, Box, Typography, Snackbar, Alert } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import ChatInput from "./ChatInput";
import MessageBubble from "./Message";

const ChatBox = () => {
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");

  const { messages, sendMessage, isSending } = useChat({
    onError: (msg) => {
      setSnackMsg(msg);
      setSnackOpen(true);
    },
  });

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  return (
    <Paper
      elevation={5}
      sx={{
         width: { xs: "100%", md:"100%" },
        height: { xs: "80vh", md:"90vh" },
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Box p={2} bgcolor="primary.main" color="white">
        <Typography variant="h6" align="center">
          AI Chat
        </Typography>
      </Box>
      <Box flex={1} p={2} bgcolor="#f5f7fa" ref={containerRef} sx={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
      </Box>
      <Box>
        <ChatInput onSend={sendMessage} disabled={isSending} />
      </Box>

      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={() => setSnackOpen(false)}>
        <Alert onClose={() => setSnackOpen(false)} severity="error" sx={{ width: '100%' }}>
          {snackMsg}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ChatBox;
