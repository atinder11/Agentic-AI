import { Box, Typography } from "@mui/material";
// import SmartToyIcon from '@mui/icons-material/SmartToy';
 import AdbIcon from '@mui/icons-material/Adb';
import type { Message } from "../types/chat";
import ReactMarkdown from "react-markdown";

const MessageBubble = ({ msg }: { msg: Message }) => {
  const isUser = msg.sender === "user";

  return (
    <Box display="flex" justifyContent={isUser ? "flex-end" : "flex-start"} mb={1} alignItems="flex-start">
      {/* Bot icon for agent messages */}
      {!isUser && (
        <Box mr={1} mt={0.5}>
          <AdbIcon color="action" fontSize="medium" />
        </Box>
      )}

      <Box
        sx={{
          p: 1.5,
          borderRadius: 3,
          bgcolor: isUser ? "primary.main" : "grey.200",
          color: isUser ? "white" : "black",
          maxWidth: "70%",
        }}
      >
        {/* Render Markdown content without default bullets */}
        <ReactMarkdown
          components={{
            h3: ({node, ...props}) => <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }} {...props} />,
            h4: ({node, ...props}) => <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }} {...props} />,
            p: ({node, ...props}) => <Typography variant="body2" sx={{ mb: 1 }} {...props} />,
            ul: ({node, ...props}) => <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: 4 }} {...props} />,
            ol: ({node, ...props}) => <ol style={{ listStyle: 'none', paddingLeft: 0, marginBottom: 4 }} {...props} />,
            li: ({node, ...props}) => <li style={{ marginBottom: 4 }} {...props} />
          }}
        >
          {msg.text}
        </ReactMarkdown>
      </Box>
    </Box>
  );
};

export default MessageBubble;
