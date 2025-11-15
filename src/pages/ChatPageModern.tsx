import React, { useEffect, useCallback } from 'react';
import { ChatLayout } from '../components/Chat/ChatLayout';
import { ChatHeader } from '../components/Chat/ChatHeader';
import { ChatMessages } from '../components/Chat/ChatMessages';
import { ChatInputModern } from '../components/Chat/ChatInputModern';
import { useChatStore } from '../stores/useChatStore';
import { graceApiFetch, GRACE_API_ENDPOINTS } from '../utils/constants';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import notificationManager from '../utils/NotificationManager';
import './ChatPageModern.css';

// Session ID management
const getSessionId = (): string => {
  try {
    const key = 'grace_session_id';
    let sid = window.localStorage.getItem(key);
    if (!sid) {
      sid = window.crypto?.randomUUID?.() || 
            `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      window.localStorage.setItem(key, sid);
    }
    return sid;
  } catch {
    return `guest-${Date.now()}`;
  }
};

// Visitor management
const getStoredVisitor = () => {
  try {
    const data = window.localStorage.getItem('grace_user');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const setStoredVisitor = (visitor: any) => {
  try {
    window.localStorage.setItem('grace_user', JSON.stringify(visitor));
  } catch (e) {
    console.warn('Could not store visitor', e);
  }
};

export const ChatPageModern: React.FC = () => {
  const {
    messages,
    visitor,
    isLoading,
    isTyping,
    addMessage,
    setMessages,
    setVisitor,
    setIsLoading,
    setIsTyping,
  } = useChatStore();
  
  const { listening, transcript, startListening, stopListening } = useSpeechRecognition();
  
  // Load visitor and chat history
  useEffect(() => {
    const storedVisitor = getStoredVisitor();
    if (storedVisitor) {
      setVisitor(storedVisitor);
    }
    
    loadChatHistory();
  }, []);
  
  const loadChatHistory = async () => {
    try {
      setIsLoading(true);
      const sessionId = getSessionId();
      const response = await graceApiFetch(GRACE_API_ENDPOINTS.CHAT_HISTORY, {
        method: 'POST',
        body: JSON.stringify({ session_id: sessionId }),
      });
      
      const data = await response.json();
      const history = (data.history || []).map((msg: any) => ({
        id: msg.id || `${msg.timestamp}-${Math.random()}`,
        content: msg.content || msg.message || '',
        role: msg.role === 'user' ? 'user' : 'grace',
        timestamp: new Date(msg.timestamp || Date.now()),
        imageUrl: msg.image_url,
      }));
      
      setMessages(history);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    const userMessage = {
      id: `user-${Date.now()}`,
      content: text,
      role: 'user' as const,
      timestamp: new Date(),
    };
    
    addMessage(userMessage);
    setIsTyping(true);
    
    try {
      const sessionId = getSessionId();
      const response = await graceApiFetch('/chat', {
        method: 'POST',
        body: JSON.stringify({
          session_id: sessionId,
          message: text,
          visitor: visitor || undefined,
        }),
      });
      
      const data = await response.json();
      const graceMessage = {
        id: `grace-${Date.now()}`,
        content: data.response || data.message || 'Sorry, I didn\'t understand that.',
        role: 'grace' as const,
        timestamp: new Date(),
      };
      
      addMessage(graceMessage);
    } catch (error) {
      console.error('Failed to send message:', error);
      addMessage({
        id: `error-${Date.now()}`,
        content: 'Sorry, I\'m having trouble connecting. Please try again.',
        role: 'grace',
        timestamp: new Date(),
      });
    } finally {
      setIsTyping(false);
    }
  }, [visitor, addMessage, setIsTyping]);
  
  const handleImageUpload = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('session_id', getSessionId());
    
    const imageUrl = URL.createObjectURL(file);
    const userMessage = {
      id: `user-img-${Date.now()}`,
      content: '📷 Image uploaded',
      role: 'user' as const,
      timestamp: new Date(),
      imageUrl,
    };
    
    addMessage(userMessage);
    setIsTyping(true);
    
    try {
      const response = await graceApiFetch(GRACE_API_ENDPOINTS.UPLOAD_IMAGE, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      const graceMessage = {
        id: `grace-${Date.now()}`,
        content: data.response || 'Image received!',
        role: 'grace' as const,
        timestamp: new Date(),
      };
      
      addMessage(graceMessage);
    } catch (error) {
      console.error('Failed to upload image:', error);
      addMessage({
        id: `error-${Date.now()}`,
        content: 'Sorry, I couldn\'t process that image.',
        role: 'grace',
        timestamp: new Date(),
      });
    } finally {
      setIsTyping(false);
    }
  }, [addMessage, setIsTyping]);
  
  const handleVoiceToggle = (shouldListen: boolean) => {
    if (shouldListen) {
      startListening();
    } else {
      stopListening();
      if (transcript) {
        sendMessage(transcript);
      }
    }
  };
  
  return (
    <ChatLayout>
      <ChatHeader visitorName={visitor?.name} />
      <ChatMessages messages={messages} isTyping={isTyping} />
      <ChatInputModern
        onSend={sendMessage}
        onImageUpload={handleImageUpload}
        onVoiceToggle={handleVoiceToggle}
        disabled={isLoading}
        isListening={listening}
      />
    </ChatLayout>
  );
};

export default ChatPageModern;
