import { create } from 'zustand';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'grace';
  timestamp: Date;
  imageUrl?: string;
}

export interface Visitor {
  name: string;
  phone: string;
  instagram?: string;
  countryCode: string;
}

interface ChatState {
  // State
  messages: Message[];
  visitor: Visitor | null;
  isLoading: boolean;
  isTyping: boolean;
  showRegister: boolean;
  showCatalog: boolean;
  catalogProducts: any[];
  
  // Actions
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setVisitor: (visitor: Visitor | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsTyping: (typing: boolean) => void;
  setShowRegister: (show: boolean) => void;
  setShowCatalog: (show: boolean) => void;
  setCatalogProducts: (products: any[]) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  // Initial state
  messages: [],
  visitor: null,
  isLoading: false,
  isTyping: false,
  showRegister: false,
  showCatalog: false,
  catalogProducts: [],
  
  // Actions
  addMessage: (message) => 
    set((state) => ({ messages: [...state.messages, message] })),
  
  setMessages: (messages) => set({ messages }),
  
  setVisitor: (visitor) => set({ visitor }),
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  setIsTyping: (typing) => set({ isTyping: typing }),
  
  setShowRegister: (show) => set({ showRegister: show }),
  
  setShowCatalog: (show) => set({ showCatalog: show }),
  
  setCatalogProducts: (products) => set({ catalogProducts: products }),
  
  clearMessages: () => set({ messages: [] }),
}));
