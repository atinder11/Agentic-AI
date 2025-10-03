import { Paper, Box, Typography } from "@mui/material";
import { useChat } from "../hooks/useChat"
import ChatInput from "./ChatInput";
import MessageBubble from "./Message";

const ChatBox = () => {
  const { messages, sendMessage } = useChat();

  return (
    <Paper
      elevation={3}
      sx={{
        width: { xs: "100%", sm: 400 },
        height: { xs: "100vh", sm: 600 },
        display: "flex",
        flexDirection: "column",
        borderRadius: 3
      }}
    >
      <Box p={2} bgcolor="primary.main" color="white">
        <Typography variant="h6" align="center">AI Chat</Typography>
      </Box>
      <Box flex={1} p={2} overflow="auto" bgcolor="#f5f7fa">
        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
      </Box>
      <ChatInput onSend={sendMessage} />
    </Paper>
  );
};

export default ChatBox;
