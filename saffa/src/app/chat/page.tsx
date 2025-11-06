'use client';

import { useState, useRef, useEffect } from 'react';
import type { Package } from '@/lib/types';

import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const LYRA_API_KEY = 'sk-default-SHus2UdNE4271pzD15Rtfnk23l5u8KZm';
const AGENT_ID = '68dd6ed32660a8875bd6f11e';
const USER_ID = 'tashifanooreen@gmail.com';
const SESSION_ID = '68dd6ed32660a8875bd6f11e-7uuot8xwwaa';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Assalamu Alaikum! I am the SafaMarwah AI Assistant. How can I help you plan your Umrah journey today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() && !isLoading) {
      const newUserMessage: Message = { role: 'user', content: input };
      setMessages(prev => [...prev, newUserMessage]);
      const currentInput = input;
      setInput('');
      setIsLoading(true);

      try {
        const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': LYRA_API_KEY,
          },
          body: JSON.stringify({
            user_id: USER_ID,
            agent_id: AGENT_ID,
            session_id: SESSION_ID,
            message: currentInput,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const aiResponse = data.response;

        const newAiMessage: Message = { role: 'assistant', content: aiResponse };
        setMessages(prev => [...prev, newAiMessage]);

      } catch (error) {
        console.error('Error fetching from Lyzr API:', error);
        const errorMessage: Message = { role: 'assistant', content: "Sorry, I'm having trouble connecting to my knowledge base. Please try again later." };
        setMessages(prev => [...prev, errorMessage]);
        toast({
          variant: 'destructive',
          title: 'API Error',
          description: 'Could not fetch a response. Please check the console for details.',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex h-screen flex-col bg-muted/20">
      <Header />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {messages.map((message, index) => (
            <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role !== 'user' && (
                <Avatar className="h-8 w-8 border">
                   <AvatarImage src="https://lyzr.ai/images/lyzr-logo.svg" alt="AI Agent" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div className={`max-w-[85%] rounded-lg p-3 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background shadow-sm'}`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
           {isLoading && (
            <div className="flex items-start gap-4">
              <Avatar className="h-8 w-8 border">
                <AvatarImage src="https://lyzr.ai/images/lyzr-logo.svg" alt="AI Agent" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="max-w-[85%] rounded-lg bg-background p-3 shadow-sm flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Umar is thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="border-t bg-background p-4">
        <div className="mx-auto max-w-2xl">
          <div className="relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about your Umrah journey..."
              className="pr-12"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 bg-accent text-accent-foreground hover:bg-accent/80"
              onClick={handleSendMessage}
              disabled={isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
           <p className="mt-2 text-center text-xs text-muted-foreground">
              Powered by <a href="https://lyzr.ai" target="_blank" rel="noopener noreferrer" className="font-medium underline">Lyzr.ai</a> <Sparkles className="inline-block h-3 w-3" />
            </p>
        </div>
      </div>
    </div>
  );
}
