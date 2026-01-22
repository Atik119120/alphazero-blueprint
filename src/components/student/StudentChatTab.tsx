import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Users, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface StudentChatTabProps {
  language: 'en' | 'bn';
}

interface ChatRoom {
  id: string;
  name: string;
  room_type: 'group' | 'direct';
  course_id: string | null;
  created_at: string;
}

interface ChatMessage {
  id: string;
  message: string;
  sender_id: string;
  created_at: string;
  sender?: {
    full_name: string;
    avatar_url: string | null;
  };
}

const translations = {
  en: {
    title: 'Messages',
    groupChat: 'Group Chat',
    directMessage: 'Direct Message',
    typeMessage: 'Type a message...',
    send: 'Send',
    noRooms: 'No chat rooms yet',
    waitForTeacher: 'Your teachers will add you to chat rooms',
    noMessages: 'No messages yet',
    startConversation: 'Start the conversation!',
    selectRoom: 'Select a chat room to start messaging',
  },
  bn: {
    title: 'মেসেজ',
    groupChat: 'গ্রুপ চ্যাট',
    directMessage: 'ডাইরেক্ট মেসেজ',
    typeMessage: 'মেসেজ লিখুন...',
    send: 'পাঠান',
    noRooms: 'কোনো চ্যাট রুম নেই',
    waitForTeacher: 'আপনার টিচাররা আপনাকে চ্যাট রুমে যোগ করবেন',
    noMessages: 'কোনো মেসেজ নেই',
    startConversation: 'কথোপকথন শুরু করুন!',
    selectRoom: 'মেসেজ শুরু করতে একটি চ্যাট রুম নির্বাচন করুন',
  },
};

export default function StudentChatTab({ language }: StudentChatTabProps) {
  const { user } = useAuth();
  const t = translations[language];
  
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchRooms = async () => {
    if (!user?.id) return;
    
    try {
      // Get rooms where student is a member
      const { data: memberRooms, error } = await supabase
        .from('chat_room_members')
        .select(`
          chat_rooms(*)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const rooms = memberRooms?.map(mr => mr.chat_rooms).filter(Boolean) || [];
      setRooms(rooms as ChatRoom[]);
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (roomId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Fetch sender profiles
      const senderIds = [...new Set(data?.map(m => m.sender_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url')
        .in('user_id', senderIds);
      
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]));
      
      const messagesWithSenders = data?.map(m => ({
        ...m,
        sender: profileMap.get(m.sender_id),
      })) || [];
      
      setMessages(messagesWithSenders);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [user?.id]);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom.id);
      
      // Subscribe to real-time messages
      const channel = supabase
        .channel(`student-room:${selectedRoom.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `room_id=eq.${selectedRoom.id}`,
          },
          async (payload) => {
            const newMsg = payload.new as ChatMessage;
            
            // Fetch sender profile
            const { data: senderProfile } = await supabase
              .from('profiles')
              .select('user_id, full_name, avatar_url')
              .eq('user_id', newMsg.sender_id)
              .single();
            
            setMessages(prev => [...prev, { ...newMsg, sender: senderProfile }]);
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedRoom?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!user?.id || !selectedRoom || !newMessage.trim()) return;
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: selectedRoom.id,
          sender_id: user.id,
          message: newMessage.trim(),
        });
      
      if (error) throw error;
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">{t.title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
        {/* Room List */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Chat Rooms</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <ScrollArea className="h-[520px]">
              {rooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">{t.noRooms}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t.waitForTeacher}</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {rooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        selectedRoom?.id === room.id
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          room.room_type === 'group' ? 'bg-primary/10' : 'bg-secondary'
                        }`}>
                          {room.room_type === 'group' ? (
                            <Users className="h-5 w-5 text-primary" />
                          ) : (
                            <User className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{room.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {room.room_type === 'group' ? t.groupChat : t.directMessage}
                          </Badge>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-2">
          {selectedRoom ? (
            <>
              <CardHeader className="pb-2 border-b">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedRoom.room_type === 'group' ? 'bg-primary/10' : 'bg-secondary'
                  }`}>
                    {selectedRoom.room_type === 'group' ? (
                      <Users className="h-5 w-5 text-primary" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <CardTitle className="text-lg">{selectedRoom.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex flex-col h-[520px]">
                <ScrollArea className="flex-1 p-4">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">{t.noMessages}</p>
                      <p className="text-sm text-muted-foreground">{t.startConversation}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-2 max-w-[80%] ${
                            msg.sender_id === user?.id ? 'flex-row-reverse' : ''
                          }`}>
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={msg.sender?.avatar_url || undefined} />
                              <AvatarFallback>
                                {msg.sender?.full_name?.[0] || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`rounded-lg p-3 ${
                              msg.sender_id === user?.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}>
                              {msg.sender_id !== user?.id && (
                                <p className="text-xs font-medium mb-1">
                                  {msg.sender?.full_name}
                                </p>
                              )}
                              <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                              <p className={`text-xs mt-1 ${
                                msg.sender_id === user?.id
                                  ? 'text-primary-foreground/70'
                                  : 'text-muted-foreground'
                              }`}>
                                {format(new Date(msg.created_at), 'p')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>
                
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={t.typeMessage}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center h-full">
              <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t.selectRoom}</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
