import { Box, Typography } from "@mui/material";
// import SmartToyIcon from '@mui/icons-material/SmartToy';
import AdbIcon from '@mui/icons-material/Adb';
import type { Message } from "../types/chat";
import formatMessageToNodes from "../utils/formatMessage";

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
        {typeof msg.text === 'string' && msg.text.startsWith('#') ? (() => {
          const text = msg.text as string;
          if (text.startsWith('## ')) {
            const after = text.slice(3).trim();
            return <Typography variant="h6">{after}</Typography>;
          }
          if (text.startsWith('# ')) {
            const after = text.slice(2).trim();
            return <Typography variant="h5">{after}</Typography>;
          }
          return null;
        })() : (
          <Typography variant="body2">
            {typeof msg.text === 'string' && msg.text.startsWith('**') ? (() => {
              const rest = msg.text.slice(2);
              const closeIdx = rest.indexOf('**');
              if (closeIdx === -1) return <strong>{rest}</strong>;
              const boldText = rest.slice(0, closeIdx);
              const after = rest.slice(closeIdx + 2).trimStart();
              return (
                <>
                  <strong>{boldText}</strong>
                  {after ? formatMessageToNodes(after).map((n, i) => <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{n}</span>) : null}
                </>
              );
            })() : (typeof msg.text === 'string' && msg.text.startsWith('*') ? (() => {
              const rest = msg.text.slice(1).trimStart();
              const firstSpace = rest.indexOf(' ');
              if (firstSpace === -1) return <em>{rest}</em>;
              const first = rest.slice(0, firstSpace);
              const after = rest.slice(firstSpace + 1).trimStart();
              return (
                <>
                  <em>{first}</em>
                  {after ? formatMessageToNodes(after).map((n, i) => <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{n}</span>) : null}
                </>
              );
            })() : formatMessageToNodes(msg.text).map((n, i) => <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{n}</span>))}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default MessageBubble;
