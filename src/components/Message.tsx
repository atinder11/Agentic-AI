import { Box, Typography } from "@mui/material";
import type { Message } from "../types/chat";

const MessageBubble = ({ msg }: { msg: Message }) => {
  const isUser = msg.sender === "user";
  return (
    <Box display="flex" justifyContent={isUser ? "flex-end" : "flex-start"} mb={1}>
      <Box
        sx={{
          p: 1.5,
          borderRadius: 3,
          bgcolor: isUser ? "primary.main" : "grey.200",
          color: isUser ? "white" : "black",
          maxWidth: "70%"
        }}
      >
        <Typography variant="body2">{msg.text}</Typography>
      </Box>
    </Box>
  );
};

export default MessageBubble;
