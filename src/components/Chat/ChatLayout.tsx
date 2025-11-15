import React from 'react';

interface ChatLayoutProps {
  children: React.ReactNode;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-br from-background via-background to-card overflow-hidden">
      {children}
    </div>
  );
};
