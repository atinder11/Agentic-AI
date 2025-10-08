import type { ReactNode } from 'react';

interface ChatLayoutProps {
  children: ReactNode;
}

const ChatLayout = ({ children }: ChatLayoutProps) => {
  return <>{children}</>;
};

export default ChatLayout;