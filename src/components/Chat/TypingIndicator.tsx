import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start animate-slide-up">
      <div className="flex items-center gap-3 px-5 py-4 bg-card border border-border rounded-2xl rounded-bl-sm shadow-lg">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse">
          <span className="text-xs font-bold text-primary-foreground">G</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};
