import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Loader2, MessageCircle, X, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAICommand, AICommand } from '@/contexts/AICommandContext';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  fromVoice?: boolean; // Track if message was from voice input
}

// Declare SpeechRecognition types for TypeScript
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event & { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// Text-to-Speech utility
const speakText = (text: string, onEnd?: () => void): SpeechSynthesisUtterance | null => {
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-speech not supported');
    return null;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Clean the text - remove markdown formatting for better speech
  const cleanText = text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove code
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
    .replace(/[-*]\s/g, '') // Remove list markers
    .replace(/\n+/g, '. ') // Replace newlines with pauses
    .trim();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  // Try to get a good English voice
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(v => 
    v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural'))
  ) || voices.find(v => v.lang.startsWith('en'));
  
  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
};

const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export function AIAssistant() {
  const { user, isAuthenticated } = useAuth();
  const { executeCommand } = useAICommand();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm ASK AI, your personal JEE assistant! 🎯\n\nI can help you with:\n- **Doubt solving** - Ask me anything about Physics, Chemistry, or Maths\n- **Open lectures** - Say \"open Sets lecture\" or \"show me Calculus video\"\n- **Start tests** - Say \"generate a test on Semiconductors JEE Mains\" or \"5 questions on Algebra\"\n- **🎤 Voice commands** - Tap the mic button to speak!",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [pendingVoiceResponse, setPendingVoiceResponse] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognitionAPI) {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        console.log('🎤 Speech recognition started');
        setIsListening(true);
      };
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Update input with interim results for visual feedback
        if (interimTranscript) {
          setInputValue(interimTranscript);
        }
        
        // When we get a final result, send the message
        if (finalTranscript) {
          setInputValue(finalTranscript);
          // Auto-send after getting final transcript
          setTimeout(() => {
            handleVoiceMessage(finalTranscript);
          }, 300);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('🎤 Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          toast.error('Microphone access denied. Please enable it in your browser settings.');
        } else if (event.error === 'no-speech') {
          toast.info('No speech detected. Try again!');
        } else {
          toast.error(`Voice recognition error: ${event.error}`);
        }
      };
      
      recognition.onend = () => {
        console.log('🎤 Speech recognition ended');
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Auto scroll to bottom when new messages or loading state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isLoading]);

  // Hide welcome message after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Don't show AI assistant if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Core function to send a message to the AI
  const sendMessageToAI = async (messageText: string, fromVoice: boolean = false) => {
    if (!messageText.trim() || isLoading) return;

    // If from voice, set pending flag for auto-speak
    if (fromVoice) {
      setPendingVoiceResponse(true);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText.trim(),
      sender: 'user',
      timestamp: new Date(),
      fromVoice
    };

    setInputValue('');
    setIsLoading(true);

    // Add user message immediately for better UX
    setMessages(prev => [...prev, userMessage]);

    try {
      // Build conversation history (exclude the welcome message)
      const conversationHistory = messages
        .filter(msg => msg.id !== '1') // Skip welcome message
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));

      // Add current user message
      conversationHistory.push({
        role: 'user',
        content: messageText.trim()
      });

      // Get current session for auth token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: { 
          message: messageText.trim(),
          conversationHistory: conversationHistory
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data || !data.response) {
        throw new Error('Invalid response from AI');
      }

      const aiMessageId = (Date.now() + 1).toString();
      const aiMessage: Message = {
        id: aiMessageId,
        text: data.response,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Auto-speak if this was a voice command response
      if (fromVoice) {
        setTimeout(() => {
          handleSpeak(aiMessageId, data.response);
        }, 200);
      }

      // Execute command if present
      if (data.command) {
        console.log('🤖 Received command from AI:', data.command);
        // Collapse the chat and execute command after a short delay
        setTimeout(() => {
          setIsExpanded(false);
          executeCommand(data.command as AICommand);
        }, 500);
      }
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
      setPendingVoiceResponse(false);
      // Focus input after message is sent
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Handle speaking a message
  const handleSpeak = (messageId: string, text: string) => {
    if (isSpeaking && speakingMessageId === messageId) {
      // Stop speaking if same message
      stopSpeaking();
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    } else {
      // Start speaking
      stopSpeaking(); // Stop any current speech first
      setIsSpeaking(true);
      setSpeakingMessageId(messageId);
      
      speakText(text, () => {
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      });
    }
  };

  // Handler for voice messages
  const handleVoiceMessage = (transcript: string) => {
    sendMessageToAI(transcript, true); // true = from voice
  };

  // Handler for typed messages
  const handleSendMessage = () => {
    sendMessageToAI(inputValue, false); // false = from keyboard
  };

  // Toggle voice listening
  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('Voice recognition is not supported in your browser. Try Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        setInputValue(''); // Clear input before starting
        recognitionRef.current.start();
        toast.info('🎤 Listening... Speak now!');
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast.error('Failed to start voice recognition. Please try again.');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-16 right-4 z-50 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]">
      {/* Welcome Message */}
      {showWelcome && !isExpanded && (
        <div className="mb-3 mr-16 hidden sm:block">
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap relative">
            ASK AI - Your Personal JEE Assistant
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
        <Card className="w-[92vw] sm:w-96 h-[70vh] sm:h-[600px] max-h-[calc(100vh-6rem)] flex flex-col shadow-elegant animate-scale-in">
          <CardHeader className="pb-3 flex-row items-center justify-between space-y-0 flex-shrink-0">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-5 w-5 text-primary" />
              <span className="hidden sm:inline">ASK AI - JEE Assistant</span>
              <span className="sm:hidden">ASK AI</span>
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
                      <div className="break-words prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="mb-2 list-disc pl-4">{children}</ul>,
                            ol: ({ children }) => <ol className="mb-2 list-decimal pl-4">{children}</ol>,
                            li: ({ children }) => <li className="mb-1">{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                            em: ({ children }) => <em className="italic">{children}</em>,
                            code: ({ children }) => <code className="bg-muted px-1 py-0.5 rounded text-xs">{children}</code>,
                          }}
                        >
                          {message.text}
                        </ReactMarkdown>
                      </div>
                      
                      {/* Speaker button for AI messages */}
                      {message.sender === 'ai' && message.id !== '1' && (
                        <button
                          onClick={() => handleSpeak(message.id, message.text)}
                          className={cn(
                            "mt-2 p-1 rounded-full hover:bg-primary/10 transition-colors inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary",
                            speakingMessageId === message.id && "text-primary bg-primary/10"
                          )}
                          title={speakingMessageId === message.id ? "Stop speaking" : "Read aloud"}
                        >
                          {speakingMessageId === message.id ? (
                            <>
                              <VolumeX className="h-3 w-3" />
                              <span className="hidden sm:inline">Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="h-3 w-3" />
                              <span className="hidden sm:inline">Listen</span>
                            </>
                          )}
                        </button>
                      )}
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
                      <span className="hidden sm:inline">AI is thinking...</span>
                      <span className="sm:hidden">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="flex gap-2 flex-shrink-0">
              {/* Mic Button */}
              <Button
                onClick={toggleListening}
                disabled={isLoading}
                size="icon"
                variant={isListening ? "default" : "outline"}
                className={cn(
                  "shrink-0 h-9 w-9 sm:h-10 sm:w-10 transition-all",
                  isListening && "bg-destructive hover:bg-destructive/90 text-destructive-foreground animate-pulse"
                )}
                title={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? (
                  <MicOff className="h-3 w-3 sm:h-4 sm:w-4" />
                ) : (
                  <Mic className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
              </Button>
              
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isListening ? "Listening..." : "Ask or speak..."}
                disabled={isLoading || isListening}
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
