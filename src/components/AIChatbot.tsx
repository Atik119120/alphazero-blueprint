import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Sparkles, MessageCircle } from "lucide-react";
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
      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 group ${isOpen ? 'hidden' : ''}`}
      >
        <div className="relative">
          {/* Outer glow ring */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.2, 0.5]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-primary to-pink-500 blur-xl"
          />
          
          {/* Rotating gradient border */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full p-[3px]"
            style={{
              background: 'conic-gradient(from 0deg, #06b6d4, #8b5cf6, #ec4899, #06b6d4)',
            }}
          >
            <div className="w-full h-full rounded-full bg-background" />
          </motion.div>
          
          {/* Main button */}
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
            <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-cyan-500/20 via-transparent to-pink-500/20" />
            <img src={logo} alt="Alpha One" className="w-9 h-9 object-contain brightness-0 invert relative z-10" />
          </div>
          
          {/* Online status badge */}
          <motion.span 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 flex h-5 w-5"
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-slate-900 shadow-lg shadow-emerald-500/50" />
          </motion.span>
          
          {/* AI sparkle indicator */}
          <motion.div
            animate={{ 
              y: [-2, 2, -2],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 -left-2"
          >
            <Sparkles size={16} className="text-cyan-400" />
          </motion.div>
        </div>
        
        {/* Tooltip */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-slate-900/95 backdrop-blur-sm text-white text-sm rounded-xl border border-slate-700/50 opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-xl"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-cyan-400" />
            {language === "bn" ? "Alpha One এর সাথে চ্যাট করুন!" : "Chat with Alpha One!"}
          </div>
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-slate-900 border-r border-b border-slate-700/50 rotate-45" />
        </motion.div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] rounded-[28px] overflow-hidden shadow-2xl flex flex-col"
            style={{
              background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(148, 163, 184, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
            }}
          >
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-primary/20 to-pink-500/20" />
              <div className="absolute inset-0 backdrop-blur-xl bg-slate-900/50" />
              
              <div className="relative p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar with glow */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-2xl blur-md opacity-60" />
                    <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-2 border border-slate-700/50">
                      <img src={logo} alt="Alpha One" className="w-full h-full object-contain brightness-0 invert" />
                    </div>
                    <motion.span 
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-lg shadow-emerald-500/50" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-lg">Alpha One</h3>
                      <span className="px-2 py-0.5 text-[10px] font-medium bg-gradient-to-r from-cyan-500/20 to-pink-500/20 text-cyan-300 rounded-full border border-cyan-500/30">
                        AI
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      {language === "bn" ? "অনলাইন • তাৎক্ষণিক উত্তর" : "Online • Instant replies"}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-xl bg-slate-800/80 backdrop-blur-sm flex items-center justify-center hover:bg-slate-700/80 transition-colors border border-slate-700/50 group"
                >
                  <X size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
              {messages.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-4"
                >
                  {/* Welcome Logo */}
                  <div className="relative inline-block mb-5">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-[24px] p-[2px]"
                      style={{
                        background: 'conic-gradient(from 0deg, #06b6d4, #8b5cf6, #ec4899, #06b6d4)',
                      }}
                    >
                      <div className="w-full h-full rounded-[22px] bg-slate-900" />
                    </motion.div>
                    <div className="relative w-20 h-20 rounded-[24px] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-4">
                      <img src={logo} alt="Alpha One" className="w-full h-full object-contain brightness-0 invert" />
                    </div>
                    <motion.div
                      animate={{ 
                        y: [-3, 3, -3],
                        x: [3, -3, 3]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute -top-2 -right-2"
                    >
                      <Sparkles size={18} className="text-cyan-400" />
                    </motion.div>
                  </div>
                  
                  <h4 className="font-bold text-white text-xl mb-2">
                    {language === "bn" ? "আসসালামু আলাইকুম! 👋" : "Hello there! 👋"}
                  </h4>
                  <p className="text-sm text-slate-400 mb-6 px-4 leading-relaxed">
                    {language === "bn" 
                      ? "আমি Alpha One! AlphaZero সম্পর্কে যেকোনো প্রশ্ন করতে পারেন।"
                      : "I'm Alpha One! Ask me anything about AlphaZero."}
                  </p>
                  
                  {/* Quick Questions */}
                  <div className="space-y-2.5 px-2">
                    {quickQuestions.map((q, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 + 0.2 }}
                        onClick={() => streamChat(q)}
                        className="w-full text-left text-sm px-4 py-3.5 rounded-2xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 hover:border-slate-600/50 transition-all hover:scale-[1.02] hover:shadow-lg group flex items-center gap-3"
                      >
                        <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-pink-500/20 flex items-center justify-center shrink-0 group-hover:from-cyan-500/30 group-hover:to-pink-500/30 transition-colors">
                          <MessageCircle size={14} className="text-cyan-400" />
                        </span>
                        <span className="text-slate-300 group-hover:text-white transition-colors">{q}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "assistant" && (
                        <div className="relative mr-2 shrink-0 mt-1">
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-xl blur-sm opacity-40" />
                          <div className="relative w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700/50">
                            <img src={logo} alt="" className="w-5 h-5 object-contain brightness-0 invert" />
                          </div>
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-gradient-to-br from-primary via-purple-600 to-pink-600 text-white rounded-2xl rounded-br-md shadow-lg shadow-primary/20"
                            : "bg-slate-800/80 text-slate-200 rounded-2xl rounded-bl-md border border-slate-700/50 backdrop-blur-sm"
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
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-wrap gap-2 mt-3 pl-10"
                    >
                      {followUpQuestions.map((q, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          onClick={() => streamChat(q)}
                          className="text-xs px-3.5 py-2 rounded-xl bg-slate-800/60 text-cyan-300 hover:bg-slate-700/60 border border-cyan-500/20 hover:border-cyan-500/40 transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10"
                        >
                          {q}
                        </motion.button>
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
                  <div className="relative mr-2 shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-xl blur-sm opacity-40 animate-pulse" />
                    <div className="relative w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700/50">
                      <img src={logo} alt="" className="w-5 h-5 object-contain brightness-0 invert" />
                    </div>
                  </div>
                  <div className="bg-slate-800/80 px-5 py-4 rounded-2xl rounded-bl-md flex items-center gap-2 border border-slate-700/50 backdrop-blur-sm">
                    <div className="flex gap-1.5">
                      <motion.span 
                        animate={{ y: [-3, 3, -3] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-cyan-400 rounded-full"
                      />
                      <motion.span 
                        animate={{ y: [-3, 3, -3] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                        className="w-2 h-2 bg-primary rounded-full"
                      />
                      <motion.span 
                        animate={{ y: [-3, 3, -3] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                        className="w-2 h-2 bg-pink-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="relative p-4 shrink-0">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
              <div className="absolute inset-x-4 top-0 h-12 bg-gradient-to-b from-slate-900/50 to-transparent -translate-y-full pointer-events-none" />
              
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={language === "bn" ? "আপনার প্রশ্ন লিখুন..." : "Type your message..."}
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/50 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all backdrop-blur-sm"
                    disabled={isLoading}
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative w-12 h-12 rounded-2xl flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-primary to-pink-500" />
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-primary to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {isLoading ? (
                    <Loader2 size={20} className="text-white relative z-10 animate-spin" />
                  ) : (
                    <Send size={18} className="text-white relative z-10" />
                  )}
                </motion.button>
              </div>
              
              {/* Powered by text */}
              <div className="text-center mt-3">
                <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
                  <Sparkles size={10} className="text-cyan-500/60" />
                  {language === "bn" ? "AlphaZero AI দ্বারা চালিত" : "Powered by AlphaZero AI"}
                  <Sparkles size={10} className="text-pink-500/60" />
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
