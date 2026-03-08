import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Sparkles, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Suggested follow-up questions based on context
const getFollowUpQuestions = (lastMessage: string, language: string): string[] => {
  const lowerMsg = lastMessage.toLowerCase();
  
  if (language === "bn") {
    if (lowerMsg.includes("কোর্স") || lowerMsg.includes("course")) {
      return ["ভর্তি কিভাবে করবো?", "কোন কোর্স সবচেয়ে জনপ্রিয়?"];
    }
    if (lowerMsg.includes("সার্ভিস") || lowerMsg.includes("service")) {
      return ["প্রাইসিং কেমন?", "কাজ দেখতে চাই"];
    }
    if (lowerMsg.includes("যোগাযোগ") || lowerMsg.includes("contact")) {
      return ["কাজের সময় কখন?", "অফিসের ঠিকানা কোথায়?"];
    }
    return ["আপনাদের কোর্সগুলো কি কি?", "যোগাযোগ করতে চাই"];
  } else {
    if (lowerMsg.includes("course")) {
      return ["How to enroll?", "Which course is most popular?"];
    }
    if (lowerMsg.includes("service")) {
      return ["What's the pricing?", "Show me your work"];
    }
    if (lowerMsg.includes("contact")) {
      return ["What are your working hours?", "Where is your office?"];
    }
    return ["What courses do you offer?", "How to contact you?"];
  }
};

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, followUpQuestions]);

  // Update follow-up questions when assistant responds
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === "assistant") {
      const lastAssistantMsg = messages[messages.length - 1].content;
      setFollowUpQuestions(getFollowUpQuestions(lastAssistantMsg, language));
    }
  }, [messages, language]);

  // Hide chatbot on admin, student, and teacher dashboard routes
  const hiddenRoutes = ['/admin', '/student', '/teacher'];
  const shouldHide = hiddenRoutes.some(route => location.pathname.startsWith(route));

  if (shouldHide) return null;

  // Parse links from assistant messages
  const parseMessageWithLinks = (content: string) => {
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
    setFollowUpQuestions([]);

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
      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-[88px] right-3 lg:bottom-6 lg:right-6 z-50 group ${isOpen ? 'hidden' : ''}`}
      >
      <div className="relative">
          {/* Glass button */}
          <div className="relative w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-background/80 backdrop-blur-xl border border-primary/30 flex items-center justify-center shadow-lg group-hover:border-primary/60 group-hover:scale-105 transition-all duration-300">
            <img src={logo} alt="Alpha One" className="w-6 h-6 lg:w-9 lg:h-9 object-contain dark:brightness-0 dark:invert" />
          </div>
          
          {/* Online indicator */}
          <span className="absolute -top-0.5 -right-0.5 lg:-top-1 lg:-right-1 flex h-3 w-3 lg:h-4 lg:w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 lg:h-4 lg:w-4 bg-green-500 border-2 border-background" />
          </span>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-background/90 backdrop-blur-xl text-foreground text-sm rounded-xl border border-border opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-lg">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-primary" />
            {language === "bn" ? "Alpha One এর সাথে চ্যাট করুন" : "Chat with Alpha One"}
          </div>
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bottom-[72px] z-50 flex flex-col bg-background backdrop-blur-2xl lg:inset-auto lg:bottom-6 lg:right-6 lg:w-[380px] lg:h-[560px] lg:rounded-3xl lg:border lg:border-border/50 lg:shadow-2xl lg:bg-background/80"
          >
            {/* Header */}
            <div className="relative shrink-0 border-b border-border/50">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />
              
              <div className="relative p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center p-2">
                      <img src={logo} alt="Alpha One" className="w-full h-full object-contain dark:brightness-0 dark:invert" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">Alpha One</h3>
                      <span className="px-1.5 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded-md">
                        AI
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      {language === "bn" ? "অনলাইন" : "Online"}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-destructive/10 hover:text-destructive transition-colors"
                  aria-label="Close chat"
                >
                  <X size={20} className="text-foreground" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-4"
                >
                  {/* Welcome Logo */}
                  <div className="relative inline-block mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center p-3 mx-auto">
                      <img src={logo} alt="Alpha One" className="w-full h-full object-contain dark:brightness-0 dark:invert" />
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-foreground text-lg mb-1.5">
                    {language === "bn" ? "আসসালামু আলাইকুম! 👋" : "Hello! 👋"}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-5 px-2">
                    {language === "bn" 
                      ? "আমি Alpha One! AlphaZero সম্পর্কে জিজ্ঞেস করুন।"
                      : "I'm Alpha One! Ask me about AlphaZero."}
                  </p>
                  
                  {/* Quick Questions */}
                  <div className="space-y-2">
                    {quickQuestions.map((q, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        onClick={() => streamChat(q)}
                        className="w-full text-left text-sm px-4 py-3 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-primary/30 transition-all flex items-center gap-3 group"
                      >
                        <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                          <MessageCircle size={14} className="text-primary" />
                        </span>
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">{q}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mr-2 shrink-0 mt-1">
                          <img src={logo} alt="" className="w-4 h-4 object-contain dark:brightness-0 dark:invert" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md"
                            : "bg-secondary/80 text-foreground rounded-2xl rounded-bl-md border border-border/50"
                        }`}
                      >
                        {msg.role === "assistant" 
                          ? <div className="whitespace-pre-line">{parseMessageWithLinks(msg.content)}</div>
                          : msg.content
                        }
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Follow-up Questions */}
                  {!isLoading && followUpQuestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-wrap gap-2 pl-9"
                    >
                      {followUpQuestions.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => streamChat(q)}
                          className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-all"
                        >
                          {q}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </>
              )}
              
              {/* Loading State */}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mr-2 shrink-0">
                    <img src={logo} alt="" className="w-4 h-4 object-contain dark:brightness-0 dark:invert" />
                  </div>
                  <div className="bg-secondary/80 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1.5 border border-border/50">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] border-t border-border/50 shrink-0 bg-background lg:bg-transparent">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={language === "bn" ? "আপনার প্রশ্ন লিখুন..." : "Type your message..."}
                  className="flex-1 px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shrink-0"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
              
              {/* Powered by */}
              <div className="text-center mt-1.5">
                <span className="text-[10px] text-muted-foreground">
                  {language === "bn" ? "AlphaZero AI দ্বারা চালিত" : "Powered by AlphaZero AI"}
                </span>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
