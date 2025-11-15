import React, { useState, useRef } from 'react';
import { Send, Paperclip, Mic, MicOff, X } from 'lucide-react';

interface ChatInputModernProps {
  onSend: (text: string) => void;
  onImageUpload?: (file: File) => void;
  onVoiceToggle?: (listening: boolean) => void;
  disabled?: boolean;
  isListening?: boolean;
}

export const ChatInputModern: React.FC<ChatInputModernProps> = ({
  onSend,
  onImageUpload,
  onVoiceToggle,
  disabled = false,
  isListening = false,
}) => {
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };
  
  const handleSend = () => {
    if (!text.trim() && !selectedFile) return;
    
    if (selectedFile && onImageUpload) {
      onImageUpload(selectedFile);
    }
    
    if (text.trim()) {
      onSend(text);
    }
    
    setText('');
    setSelectedFile(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    }
  };
  
  return (
    <div className="sticky bottom-0 backdrop-blur-xl bg-card/90 border-t border-border/50 shadow-2xl">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* File preview */}
        {selectedFile && (
          <div className="mb-3 flex items-center gap-3 px-4 py-2 bg-muted/50 rounded-lg border border-border">
            <Paperclip className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground flex-1 truncate">{selectedFile.name}</span>
            <button
              onClick={() => setSelectedFile(null)}
              className="p-1 hover:bg-destructive/20 rounded-full transition-colors"
              type="button"
            >
              <X className="w-4 h-4 text-destructive" />
            </button>
          </div>
        )}
        
        {/* Input area */}
        <div className="flex items-end gap-2">
          {/* File upload button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            type="button"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          {/* Text input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                adjustHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder={selectedFile ? "Add a caption..." : "Type your message..."}
              disabled={disabled}
              rows={1}
              className="w-full px-4 py-3 pr-12 bg-muted/50 border border-border rounded-2xl text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
            />
            
            {/* Voice button (inside textarea) */}
            {onVoiceToggle && (
              <button
                onClick={() => onVoiceToggle(!isListening)}
                disabled={disabled}
                className={`absolute right-2 bottom-2 p-2 rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-50 ${
                  isListening 
                    ? 'bg-destructive text-destructive-foreground animate-pulse' 
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
                type="button"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}
          </div>
          
          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={disabled || (!text.trim() && !selectedFile)}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            type="button"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
