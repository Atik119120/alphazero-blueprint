import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Loader2, CheckCircle2, XCircle, Image as ImageIcon, Sparkles, Zap, Database, Palette, Users, BookOpen, FileText, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import ImageUploader from "./ImageUploader";

interface Message {
  role: "user" | "assistant";
  content: string;
  actions?: Array<{
    success: boolean;
    table: string;
    type: string;
    error?: string;
  }>;
  timestamp: Date;
}

const capabilities = [
  { icon: Palette, labelBn: "Works/Portfolio ম্যানেজ", labelEn: "Manage Works/Portfolio", color: "from-pink-500 to-rose-500" },
  { icon: FileText, labelBn: "পেজ কনটেন্ট আপডেট", labelEn: "Update Page Content", color: "from-blue-500 to-cyan-500" },
  { icon: Users, labelBn: "Team Members ম্যানেজ", labelEn: "Manage Team Members", color: "from-emerald-500 to-green-500" },
  { icon: BookOpen, labelBn: "Courses ম্যানেজ", labelEn: "Manage Courses", color: "from-violet-500 to-purple-500" },
  { icon: Database, labelBn: "Services আপডেট", labelEn: "Update Services", color: "from-amber-500 to-orange-500" },
  { icon: MessageSquare, labelBn: "Contact তথ্য পরিবর্তন", labelEn: "Change Contact Info", color: "from-sky-500 to-blue-500" },
];

export default function AdminAssistant() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasStarted = messages.length > 0;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const trimmed = (text || input).trim();
    if (!trimmed && !imageUrl) return;

    let fullMessage = trimmed;
    if (imageUrl) {
      fullMessage += `\n\n[Image URL: ${imageUrl}]`;
    }

    const userMessage: Message = {
      role: "user",
      content: fullMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setImageUrl("");
    setShowImageUploader(false);
    setIsLoading(true);

    try {
      const history = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const { data, error } = await supabase.functions.invoke("admin-ai-assistant", {
        body: {
          message: fullMessage,
          conversation_history: history,
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message || "কিছু সমস্যা হয়েছে।",
        actions: data.actions_executed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.has_actions && data.actions_executed?.some((a: any) => a.success)) {
        toast.success(language === "bn" ? "✅ অ্যাকশন সফল হয়েছে!" : "✅ Action completed!");
      }
    } catch (error: any) {
      console.error("Assistant error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: language === "bn"
            ? "দুঃখিত, কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।"
            : "Sorry, something went wrong. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = language === "bn"
    ? [
        "আমাদের সব Works দেখাও",
        "নতুন একটা Work যোগ করো",
        "Services গুলো দেখাও",
        "Team Members দেখাও",
      ]
    : [
        "Show all Works",
        "Add a new Work",
        "Show Services",
        "Show Team Members",
      ];

  // Landing / Welcome view
  if (!hasStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-3xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/25 animate-pulse">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-3">
            Alpha Assistant
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            {language === "bn"
              ? "আমাকে বলুন কি করতে হবে — আমি আপনার পুরো ওয়েবসাইট ম্যানেজ করে দিবো ⚡"
              : "Tell me what to do — I'll manage your entire website for you ⚡"}
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full mb-8">
          {capabilities.map((cap, i) => (
            <div
              key={i}
              className="group flex items-center gap-3 p-3 rounded-2xl border border-border/50 bg-card hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5 transition-all cursor-default"
            >
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${cap.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <cap.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-foreground/80">
                {language === "bn" ? cap.labelBn : cap.labelEn}
              </span>
            </div>
          ))}
        </div>

        {/* Quick Suggestions */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {quickActions.map((action) => (
            <Button
              key={action}
              variant="outline"
              size="sm"
              className="rounded-full text-xs border-purple-500/20 hover:bg-purple-500/10 hover:border-purple-500/40 transition-all"
              onClick={() => sendMessage(action)}
            >
              <Zap className="w-3 h-3 mr-1 text-purple-500" />
              {action}
            </Button>
          ))}
        </div>

        {/* Input */}
        <div className="w-full max-w-xl">
          {showImageUploader && (
            <div className="mb-3 p-3 border border-border rounded-xl bg-secondary/30">
              <ImageUploader
                value={imageUrl}
                onChange={(url) => setImageUrl(url)}
                folder="works"
                label={language === "bn" ? "ছবি আপলোড / URL দিন" : "Upload image / paste URL"}
                placeholder="https://..."
                aspectRatio="video"
                maxSizeMB={10}
              />
              {imageUrl && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={imageUrl} alt="preview" className="w-16 h-16 rounded-lg object-cover" />
                  <Badge variant="secondary" className="text-xs">✅ {language === "bn" ? "ছবি রেডি" : "Image ready"}</Badge>
                </div>
              )}
            </div>
          )}
          <div className="flex items-end gap-2 border border-border/60 rounded-2xl bg-card p-2 shadow-lg shadow-black/5">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl flex-shrink-0 h-9 w-9"
              onClick={() => setShowImageUploader(!showImageUploader)}
              title={language === "bn" ? "ছবি যোগ করুন" : "Add image"}
            >
              <ImageIcon className={`w-4 h-4 ${imageUrl ? "text-emerald-500" : ""}`} />
            </Button>
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                language === "bn"
                  ? "আমাকে বলুন কি করতে হবে..."
                  : "Tell me what to do..."
              }
              className="min-h-[44px] max-h-[120px] border-0 resize-none focus-visible:ring-0 text-sm bg-transparent"
              rows={1}
            />
            <Button
              size="icon"
              className="rounded-xl flex-shrink-0 h-9 w-9 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 shadow-lg shadow-purple-500/20"
              onClick={() => sendMessage()}
              disabled={isLoading || (!input.trim() && !imageUrl)}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Chat view (after first message)
  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-h-[800px]">
      {/* Compact Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border/50">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            Alpha Assistant
          </h2>
          <p className="text-[11px] text-muted-foreground">
            {language === "bn" ? "AI দিয়ে পুরো ওয়েবসাইট ম্যানেজ করুন" : "Manage your website with AI"}
          </p>
        </div>
        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse" />
          Online
        </Badge>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${
                msg.role === "user"
                  ? "bg-primary/10 text-primary"
                  : "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white"
              }`}
            >
              {msg.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted/50 border border-border/50 rounded-bl-md"
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed">
                {msg.content.split(/(\*\*.*?\*\*)/).map((part, j) =>
                  part.startsWith("**") && part.endsWith("**") ? (
                    <strong key={j}>{part.slice(2, -2)}</strong>
                  ) : (
                    <span key={j}>{part}</span>
                  )
                )}
              </div>

              {msg.actions && msg.actions.length > 0 && (
                <div className="mt-3 space-y-1.5 border-t border-border/30 pt-2">
                  {msg.actions.map((action, j) => (
                    <div
                      key={j}
                      className={`flex items-center gap-2 text-xs px-2 py-1 rounded-lg ${
                        action.success
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {action.success ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {action.type === "insert" && "➕ "}
                        {action.type === "update" && "✏️ "}
                        {action.type === "delete" && "🗑️ "}
                        {action.table}
                        {action.error && ` — ${action.error}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-[10px] mt-2 opacity-40">
                {msg.timestamp.toLocaleTimeString(language === "bn" ? "bn-BD" : "en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-muted/50 border border-border/50 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                {language === "bn" ? "চিন্তা করছি..." : "Thinking..."}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image uploader */}
      {showImageUploader && (
        <div className="mb-3 p-3 border border-border rounded-xl bg-secondary/30">
          <ImageUploader
            value={imageUrl}
            onChange={(url) => setImageUrl(url)}
            folder="works"
            label={language === "bn" ? "ছবি আপলোড / URL দিন" : "Upload image / paste URL"}
            placeholder="https://..."
            aspectRatio="video"
            maxSizeMB={10}
          />
          {imageUrl && (
            <div className="mt-2 flex items-center gap-2">
              <img src={imageUrl} alt="preview" className="w-16 h-16 rounded-lg object-cover" />
              <Badge variant="secondary" className="text-xs">✅ {language === "bn" ? "ছবি রেডি" : "Image ready"}</Badge>
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <div className="flex items-end gap-2 border border-border/60 rounded-2xl bg-card p-2 shadow-lg shadow-black/5">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl flex-shrink-0 h-9 w-9"
          onClick={() => setShowImageUploader(!showImageUploader)}
          title={language === "bn" ? "ছবি যোগ করুন" : "Add image"}
        >
          <ImageIcon className={`w-4 h-4 ${imageUrl ? "text-emerald-500" : ""}`} />
        </Button>
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            language === "bn"
              ? "আমাকে বলুন কি করতে হবে... (Enter চাপুন)"
              : "Tell me what to do... (Press Enter)"
          }
          className="min-h-[40px] max-h-[120px] border-0 resize-none focus-visible:ring-0 text-sm bg-transparent"
          rows={1}
        />
        <Button
          size="icon"
          className="rounded-xl flex-shrink-0 h-9 w-9 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 shadow-lg shadow-purple-500/20"
          onClick={() => sendMessage()}
          disabled={isLoading || (!input.trim() && !imageUrl)}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
