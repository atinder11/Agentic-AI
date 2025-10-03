import type { Message } from "../types/chat";
import formatStructuredToMarkdown, { formatPlainToMarkdown } from "../utils/formatStructured";

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL ?? "";

if (!WEBHOOK_URL) {
  console.warn("VITE_WEBHOOK_URL is not set. Webhook calls will fail in the browser.");
}

export const sendWebhookMessage = async (text: string): Promise<Message> => {
  const payload = {
    value: [
      {
        subscriptionId: "sub-001",
        changeType: "created",
        resource: "users/xyz/messages/abc",
        resourceData: {
          id: "msg-123",
          conversationId: "thread-789",
          subject: text,
          from: { emailAddress: { address: "customer@example.com", name: "John Doe" } },
          toRecipients: [{ emailAddress: { address: "support@example.com", name: "Support Team" } }],
          receivedDateTime: new Date().toISOString(),
          body: { contentType: "HTML", content: `<p>${text}</p>` }
        }
      }
    ]
  };

  if (!WEBHOOK_URL) {
    throw new Error('Webhook URL not configured (VITE_WEBHOOK_URL)');
  }

  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error(`Server error ${res.status}`);
  const data = await res.json();
  // The webhook may return structured JSON (e.g., results[0].agentReply may be an object)
  const rawReply = data.results?.[0]?.agentReply;
  let formattedText = "";
  if (rawReply === null || rawReply === undefined) {
    formattedText = "No reply from agent.";
  } else if (typeof rawReply === 'string') {
    formattedText = formatPlainToMarkdown(rawReply);
  } else if (typeof rawReply === 'object') {
    formattedText = formatStructuredToMarkdown(rawReply);
  } else {
    formattedText = String(rawReply);
  }

  return {
    id: Date.now().toString(),
    sender: "agent",
    text: formattedText,
    timestamp: new Date(),
  };
};
