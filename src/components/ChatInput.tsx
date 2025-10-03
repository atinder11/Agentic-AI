import { useState } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ChatInput = ({ onSend, disabled = false }: { onSend: (text: string) => void; disabled?: boolean }) => {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (value.trim()) {
      onSend(value);
      setValue("");
    }
  };

  return (
    <Box display="flex" p={1.5} borderTop="1px solid #ddd">
      <TextField
        fullWidth
        size="small"
        placeholder="Type a message"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSend()}
        disabled={disabled}
      />
      <IconButton color="primary" onClick={handleSend} disabled={disabled}>
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default ChatInput;
