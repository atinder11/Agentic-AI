import React from "react";
import { Box, Typography } from "@mui/material";
import type { Message } from "../types/chat";
import formatMessageToNodes from "../utils/formatMessage";

const MessageBubble = ({ msg }: { msg: Message }) => {
  const isUser = msg.sender === "user";
  // Helper to render nodes returned by formatMessageToNodes.
  // We must avoid wrapping block-level elements (ul, ol, pre, etc.) inside inline elements like <span>
  const renderNodes = (nodes: React.ReactNode[]) =>
    nodes.map((n, i) => {
      if (typeof n === 'string' || typeof n === 'number') {
        return (
          <span key={i} style={{ whiteSpace: 'pre-wrap' }}>
            {n}
          </span>
        );
      }
      if (React.isValidElement(n)) {
        // ensure a stable key on element nodes
        return React.cloneElement(n as React.ReactElement, { key: i });
      }
      return (
        <span key={i} style={{ whiteSpace: 'pre-wrap' }}>
          {String(n)}
        </span>
      );
    });
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
        {
          // Leading header support: '# ' => h5, '## ' => h6
          typeof msg.text === 'string' && msg.text.startsWith('#') ? (() => {
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
            <Typography variant="body2" component="div">
              {
                // Leading bold (**...**)
                typeof msg.text === 'string' && msg.text.startsWith('**')
                  ? (() => {
                      const rest = msg.text.slice(2);
                      const closeIdx = rest.indexOf('**');
                      if (closeIdx === -1) {
                        return <strong>{rest}</strong>;
                      }
                      const boldText = rest.slice(0, closeIdx);
                      const after = rest.slice(closeIdx + 2).trimStart();
                      return (
                        <>
                          <strong>{boldText}</strong>
                          {after ? renderNodes(formatMessageToNodes(after)) : null}
                        </>
                      );
                    })()
                  : // Leading single-star italic for first token
                    (typeof msg.text === 'string' && msg.text.startsWith('*') ? (() => {
                      const rest = msg.text.slice(1).trimStart();
                      // split first token
                      const firstSpace = rest.indexOf(' ');
                      if (firstSpace === -1) return <em>{rest}</em>;
                      const first = rest.slice(0, firstSpace);
                      const after = rest.slice(firstSpace + 1).trimStart();
                      return (
                        <>
                          <em>{first}</em>
                          {after ? renderNodes(formatMessageToNodes(after)) : null}
                        </>
                      );
                    })() : (
                      // fallback: parse the whole message normally
                      renderNodes(formatMessageToNodes(msg.text))
                    ))
              }
            </Typography>
          )
        }
      </Box>
    </Box>
  );
};

export default MessageBubble;
