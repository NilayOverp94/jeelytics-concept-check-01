import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Harshit, your personal JEE doubt solver. Ask me anything about Physics, Chemistry, or Mathematics concepts!",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Hide welcome message after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { message: currentInput }
      });

      if (error) {
        throw error;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "I'm sorry, I couldn't process your question. Please try again!",
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling AI function:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please try again in a moment!",
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]">
      {/* Welcome Message */}
      {showWelcome && !isExpanded && (
        <div className="mb-3 mr-16 hidden sm:block">
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap relative">
            Hi, I am Harshit Your Personal JEE Doubt Solver
            <div className="absolute right-[-8px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-primary border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
          </div>
        </div>
      )}

      {/* Collapsed State - Floating Icon */}
      {!isExpanded && (
        <Button
          onClick={() => setIsExpanded(true)}
          className="w-14 h-14 rounded-full shadow-elegant bg-primary hover:bg-primary/90 text-primary-foreground"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Expanded State - Full Chat */}
      {isExpanded && (
        <Card className="w-full sm:w-80 h-[400px] sm:h-[500px] max-h-[calc(100vh-6rem)] flex flex-col shadow-elegant animate-scale-in">
          <CardHeader className="pb-3 flex-row items-center justify-between space-y-0 flex-shrink-0">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-5 w-5 text-primary" />
              <span className="hidden sm:inline">Harshit - AI Tutor</span>
              <span className="sm:hidden">Harshit</span>
            </CardTitle>
            <Button
              onClick={() => setIsExpanded(false)}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col gap-4 p-4 min-h-0">
            {/* Messages Area */}
            <ScrollArea className="flex-1 pr-2" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2 animate-fade-in",
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.sender === 'ai' && (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                      </div>
                    )}
                    
                    <div
                      className={cn(
                        "max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 text-sm",
                        message.sender === 'user'
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted/50"
                      )}
                    >
                      <div className="break-words">{message.text}</div>
                    </div>
                    
                    {message.sender === 'user' && (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <User className="h-3 w-3 sm:h-4 sm:w-4 text-secondary" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-2 animate-fade-in">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2 sm:p-3 text-sm flex items-center gap-2">
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      <span className="hidden sm:inline">Harshit is thinking...</span>
                      <span className="sm:hidden">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="flex gap-2 flex-shrink-0">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Harshit about JEE concepts..."
                disabled={isLoading}
                className="flex-1 text-sm"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                className="shrink-0 h-9 w-9 sm:h-10 sm:w-10"
              >
                {isLoading ? (
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                ) : (
                  <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}