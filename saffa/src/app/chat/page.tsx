'use client';

import { useState, useRef, useEffect } from 'react';
import { getRecommendedPackages, getAiPreferences } from '@/app/actions';
import type { Package } from '@/lib/types';

import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { ChatPackageCard } from '@/components/chat-package-card';
import { useToast } from '@/hooks/use-toast';

type Message = {
  role: 'user' | 'assistant' | 'assistant-packages';
  content: string | Package[];
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Assalamu Alaikum! Tell me your Umrah preferences and I’ll find the perfect package for you.',
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

      const preferences = await getAiPreferences(currentInput);

      const result = await getRecommendedPackages(currentInput, preferences || {});

      if (result.success && result.data && result.data.length > 0) {
        const newPackagesMessage: Message = { role: 'assistant-packages', content: result.data };
        setMessages(prev => [...prev, newPackagesMessage]);
      } else {
        const errorMessage: Message = { role: 'assistant', content: result.error || "I couldn't find any packages matching your request. Could you try being more specific?" };
        setMessages(prev => [...prev, errorMessage]);
        toast({
          variant: 'destructive',
          title: 'Search Failed',
          description: result.error || 'Please try again.',
        });
      }
      
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-muted/20">
      <Header />
      <div className="bg-yellow-100 border-b border-yellow-400 text-yellow-800 p-2 text-center text-sm flex items-center justify-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        <span>This AI chat is under construction. Recommendations may not be perfect.</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {messages.map((message, index) => (
            <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role !== 'user' && (
                <Avatar className="h-8 w-8 border">
                   <AvatarImage src="https://picsum.photos/seed/bot/100/100" alt="AI Agent" data-ai-hint="mosque logo" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div className={`max-w-[85%] rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground p-3' : ''} ${message.role === 'assistant' ? 'bg-background shadow-sm p-3' : ''}`}>
                {typeof message.content === 'string' ? (
                  <p className="text-sm">{message.content}</p>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-foreground font-medium px-3 pt-3">Here are the top 3 packages I found for you:</p>
                    {message.content.map(pkg => (
                      <ChatPackageCard key={pkg.id} package={pkg} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
           {isLoading && (
            <div className="flex items-start gap-4">
              <Avatar className="h-8 w-8 border">
                <AvatarImage src="https://picsum.photos/seed/bot/100/100" alt="AI Agent" data-ai-hint="mosque logo" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="max-w-[85%] rounded-lg bg-background p-3 shadow-sm flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Finding the best packages for you...</p>
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
              placeholder="e.g., 'I am looking for a 10 day package under INR 1,50,000...'"
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
              Powered by AI <Sparkles className="inline-block h-3 w-3" />
            </p>
        </div>
      </div>
    </div>
  );
}
