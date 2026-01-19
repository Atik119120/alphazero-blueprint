import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Sparkles, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Parse links from assistant messages
  const parseMessageWithLinks = (content: string) => {
    // Match patterns like "/courses", "/contact", "/services" etc.
    const linkPattern = /(\/[a-z-]+)/g;
    const parts = content.split(linkPattern);
    
    return parts.map((part, index) => {
      if (part.match(/^\/[a-z-]+$/)) {
        return (
          <button
            key={index}
            onClick={() => {
              navigate(part);
              setIsOpen(false);
            }}
            className="text-primary underline hover:text-primary/80 font-medium"
          >
            {part}
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const streamChat = async (userMessage: string) => {
    const userMsg: Message = { role: "user", content: userMessage };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setInput("");

    let assistantContent = "";

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          messages: [...messages, userMsg] 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => 
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        { 
          role: "assistant", 
          content: language === "bn" 
            ? "দুঃখিত, একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।" 
            : "Sorry, something went wrong. Please try again." 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    streamChat(input.trim());
  };

  const quickQuestions = language === "bn" 
    ? [
        "আপনাদের কোর্সগুলো কি কি?",
        "গ্রাফিক ডিজাইন কোর্সের দাম কত?",
        "কিভাবে যোগাযোগ করবো?"
      ]
    : [
        "What courses do you offer?",
        "How much is Graphic Design course?",
        "How can I contact you?"
      ];

  return (
    <>
      {/* Floating Chat Button - Modern Gradient Design */}
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 group ${isOpen ? 'hidden' : ''}`}
      >
        <div className="relative">
          {/* Animated rings */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-spin-slow opacity-75 blur-md" />
          <div className="absolute inset-1 rounded-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-50" />
          
          {/* Main button */}
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary via-purple-600 to-pink-500 flex items-center justify-center shadow-2xl shadow-primary/30 group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-110">
            <Zap size={28} className="text-white" />
          </div>
          
          {/* Online indicator */}
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500 border-2 border-background" />
          </span>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-foreground text-background text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {language === "bn" ? "জিরোর সাথে চ্যাট করুন!" : "Chat with Zero!"}
        </div>
      </motion.button>

      {/* Chat Window - Modern Glass Design */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] rounded-3xl overflow-hidden shadow-2xl"
            style={{
              background: 'linear-gradient(145deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)',
              border: '1px solid hsl(var(--border))',
            }}
          >
            {/* Header - Gradient with Glass Effect */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-pink-500" />
              <div className="absolute inset-0 bg-black/10" />
              
              <div className="relative p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Sparkles size={24} className="text-white" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">জিরো</h3>
                    <p className="text-xs text-white/80">
                      {language === "bn" ? "AlphaZero AI সহকারী" : "AlphaZero AI Assistant"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 h-[340px] overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-6"
                >
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={36} className="text-primary" />
                  </div>
                  <h4 className="font-bold text-foreground text-lg mb-2">
                    {language === "bn" ? "আসসালামু আলাইকুম! 👋" : "Hello! 👋"}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-5 px-4">
                    {language === "bn" 
                      ? "আমি জিরো! AlphaZero সম্পর্কে কিছু জানতে চাইলে জিজ্ঞেস করুন।"
                      : "I'm Zero! Ask me anything about AlphaZero."}
                  </p>
                  <div className="space-y-2 px-2">
                    {quickQuestions.map((q, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => streamChat(q)}
                        className="w-full text-left text-sm px-4 py-3 rounded-2xl bg-secondary/80 hover:bg-secondary border border-border/50 transition-all hover:scale-[1.02] hover:shadow-md"
                      >
                        {q}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-primary to-purple-600 text-white rounded-2xl rounded-br-md shadow-lg shadow-primary/20"
                          : "bg-secondary text-foreground rounded-2xl rounded-bl-md border border-border/50"
                      }`}
                    >
                      {msg.role === "assistant" 
                        ? parseMessageWithLinks(msg.content)
                        : msg.content
                      }
                    </div>
                  </motion.div>
                ))
              )}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-secondary px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Modern Design */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-sm">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={language === "bn" ? "আপনার প্রশ্ন লিখুন..." : "Type your question..."}
                  className="flex-1 px-4 py-3 rounded-2xl bg-secondary border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-105"
                >
                  {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
