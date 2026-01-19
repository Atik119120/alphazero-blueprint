import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
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
      {/* Floating Chat Button with Logo */}
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
          
          {/* Main button with logo */}
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary via-purple-600 to-pink-500 flex items-center justify-center shadow-2xl shadow-primary/30 group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-110">
            <img src={logo} alt="Alpha One" className="w-10 h-10 object-contain brightness-0 invert" />
          </div>
          
          {/* Online indicator */}
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500 border-2 border-background" />
          </span>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-foreground text-background text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {language === "bn" ? "Alpha One এর সাথে চ্যাট করুন!" : "Chat with Alpha One!"}
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[550px] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            style={{
              background: 'linear-gradient(145deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)',
              border: '1px solid hsl(var(--border))',
            }}
          >
            {/* Header with Logo */}
            <div className="relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-pink-500" />
              <div className="absolute inset-0 bg-black/10" />
              
              <div className="relative p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center p-1.5">
                      <img src={logo} alt="Alpha One" className="w-full h-full object-contain brightness-0 invert" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Alpha One</h3>
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
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-6"
                >
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center mx-auto mb-4 p-4">
                    <img src={logo} alt="Alpha One" className="w-full h-full object-contain brightness-0 invert" />
                  </div>
                  <h4 className="font-bold text-foreground text-lg mb-2">
                    {language === "bn" ? "আসসালামু আলাইকুম! 👋" : "Hello! 👋"}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-5 px-4">
                    {language === "bn" 
                      ? "আমি Alpha One! AlphaZero সম্পর্কে কিছু জানতে চাইলে জিজ্ঞেস করুন।"
                      : "I'm Alpha One! Ask me anything about AlphaZero."}
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
                <>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center mr-2 shrink-0 mt-1">
                          <img src={logo} alt="" className="w-4 h-4 object-contain brightness-0 invert" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] px-4 py-3 text-sm ${
                          msg.role === "user"
                            ? "bg-gradient-to-br from-primary to-purple-600 text-white rounded-2xl rounded-br-md shadow-lg shadow-primary/20"
                            : "bg-secondary text-foreground rounded-2xl rounded-bl-md border border-border/50"
                        }`}
                      >
                        {msg.role === "assistant" 
                          ? <div className="whitespace-pre-line leading-relaxed">{parseMessageWithLinks(msg.content)}</div>
                          : msg.content
                        }
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Follow-up Questions */}
                  {!isLoading && followUpQuestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-wrap gap-2 mt-3 pl-9"
                    >
                      {followUpQuestions.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => streamChat(q)}
                          className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-all hover:scale-105"
                        >
                          {q}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </>
              )}
              
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center mr-2 shrink-0">
                    <img src={logo} alt="" className="w-4 h-4 object-contain brightness-0 invert" />
                  </div>
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

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-sm shrink-0">
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
