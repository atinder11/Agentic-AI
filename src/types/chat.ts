export interface Message {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: Date;
  isPlaceholder?: boolean;
}
