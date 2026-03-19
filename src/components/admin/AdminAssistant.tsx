import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2, CheckCircle2, XCircle, Image as ImageIcon, Sparkles } from "lucide-react";
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

export default function AdminAssistant() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: language === "bn"
        ? "আসসালামু আলাইকুম! 👋 আমি **Alpha Assistant**। আমি আপনার ওয়েবসাইটের সবকিছু ম্যানেজ করতে পারি।\n\n🎨 **Works/Portfolio** যোগ, এডিট বা ডিলিট\n🛠️ **Services** আপডেট\n👥 **Team Members** ম্যানেজ\n📄 **Page Content** পরিবর্তন\n📚 **Courses** ম্যানেজ\n\nআমাকে বলুন কি করতে হবে! ছবি দিয়ে বলতে পারেন — আমি সব করে দিবো। 🚀"
        : "Hello! 👋 I'm **Alpha Assistant**. I can manage everything on your website.\n\n🎨 Add/edit/delete **Works/Portfolio**\n🛠️ Update **Services**\n👥 Manage **Team Members**\n📄 Change **Page Content**\n📚 Manage **Courses**\n\nTell me what you need! You can share images too — I'll handle everything. 🚀",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
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
      // Build conversation history (last 10 messages for context)
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

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-h-[800px]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">
            {language === "bn" ? "Alpha Assistant" : "Alpha Assistant"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {language === "bn"
              ? "AI দিয়ে পুরো ওয়েবসাইট ম্যানেজ করুন"
              : "Manage your entire website with AI"}
          </p>
        </div>
        <Badge variant="secondary" className="ml-auto bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse" />
          Online
        </Badge>
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {quickActions.map((action) => (
            <Button
              key={action}
              variant="outline"
              size="sm"
              className="text-xs rounded-full"
              onClick={() => {
                setInput(action);
                setTimeout(() => sendMessage(), 100);
              }}
            >
              {action}
            </Button>
          ))}
        </div>
      )}

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
              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                msg.role === "user"
                  ? "bg-primary/10 text-primary"
                  : "bg-gradient-to-br from-violet-500 to-purple-600 text-white"
              }`}
            >
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-secondary/50 border border-border/50 rounded-bl-md"
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

              {/* Action results */}
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
                {msg.timestamp.toLocaleTimeString("bn-BD", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-secondary/50 border border-border/50 rounded-2xl rounded-bl-md px-4 py-3">
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
              <Badge variant="secondary" className="text-xs">✅ ছবি রেডি</Badge>
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <div className="flex items-end gap-2 border border-border rounded-2xl bg-background p-2">
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
          className="min-h-[40px] max-h-[120px] border-0 resize-none focus-visible:ring-0 text-sm"
          rows={1}
        />
        <Button
          size="icon"
          className="rounded-xl flex-shrink-0 h-9 w-9 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
          onClick={sendMessage}
          disabled={isLoading || (!input.trim() && !imageUrl)}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
