import { useState } from "react";
import type { Message } from "../types/chat";
import { sendWebhookMessage } from "../api/webhook";

export const useChat = (opts?: { onError?: (msg: string) => void }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async (text: string) => {
    if (isSending) return; // prevent duplicate sends

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // add typing placeholder
    const placeholder: Message = {
      id: `placeholder-${Date.now()}`,
      sender: "agent",
      text: "Typing...",
      timestamp: new Date(),
      isPlaceholder: true,
    };
    setMessages((prev) => [...prev, placeholder]);

    setIsSending(true);
    try {
      const reply = await sendWebhookMessage(text);
      // remove placeholder and append reply
      setMessages((prev) => [...prev.filter((m) => !m.isPlaceholder), reply]);
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : String(err);
      setMessages((prev) => prev.filter((m) => !m.isPlaceholder));
      opts?.onError?.(errorText);
    } finally {
      setIsSending(false);
    }
  };

  return { messages, sendMessage, isSending };
};
