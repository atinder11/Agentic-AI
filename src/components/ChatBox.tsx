import { Paper, Box, Typography } from "@mui/material";
import { useChat } from "../hooks/useChat";
import ChatInput from "./ChatInput";
import MessageBubble from "./Message";
const ChatBox = () => {
  const { messages, sendMessage } = useChat();
  return (
    <Paper
      elevation={5}
      sx={{
        width: "90%",
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        borderRadius: "2px",
        maxWidth: "100%",
        ml: "5rem",
      }}
    >
      {" "}
      <Box p={2} bgcolor="primary.main" color="white">
        {" "}
        <Typography variant="h6" align="center">
          AI Chat
        </Typography>{" "}
      </Box>{" "}
      <Box
        flex={1}
        p={2}
        overflow="auto"
        bgcolor="#f5f7fa"
        sx={{ display: "flex", flexDirection: "column", gap: 1 }}
      >
        {" "}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}{" "}
      </Box>{" "}
      <Box p={2} bgcolor="#fff">
        {" "}
        <ChatInput onSend={sendMessage} />{" "}
      </Box>{" "}
    </Paper>
  );
};
export default ChatBox;
