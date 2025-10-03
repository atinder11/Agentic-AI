import type { Message } from "../types/chat";

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

  const res = await fetch("https://mcp-host-app.orangesea-99b0b2c0.eastus2.azurecontainerapps.io/webhook/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error(`Server error ${res.status}`);
  const data = await res.json();
  return {
    id: Date.now().toString(),
    sender: "agent",
    text: data.results?.[0]?.agentReply || "No reply from agent.",
    timestamp: new Date(),
  };
};
