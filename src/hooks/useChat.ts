import { useState } from "react";
import type { Message } from "../types/chat";
import { sendWebhookMessage } from "../api/webhook";

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const reply = await sendWebhookMessage(text);
      setMessages(prev => [...prev, reply]);
    } catch (err: unknown) {
      // Make the error handling type-safe: determine message text from unknown
      const errorText = err instanceof Error ? err.message : String(err);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: "agent",
        text: "Error: " + errorText,
        timestamp: new Date()
      }]);
    }
  };

  return { messages, sendMessage };
};
