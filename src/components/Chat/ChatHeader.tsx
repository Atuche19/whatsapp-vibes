import React from 'react';

interface ChatHeaderProps {
  visitorName?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ visitorName }) => {
  return (
    <header className="sticky top-0 z-10 backdrop-blur-xl bg-card/90 border-b border-border/50 shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary via-primary/80 to-accent flex items-center justify-center shadow-lg ring-2 ring-primary/20">
            <span className="text-xl font-bold text-primary-foreground">G</span>
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card animate-pulse"></div>
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-foreground">Grace AI Assistant</h1>
          <p className="text-sm text-muted-foreground">
            {visitorName ? `Hello, ${visitorName}!` : 'Online • Always ready to help'}
          </p>
        </div>
      </div>
    </header>
  );
};
