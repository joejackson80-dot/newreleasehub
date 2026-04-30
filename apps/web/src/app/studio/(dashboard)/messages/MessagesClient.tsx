'use client';
import React, { useState } from 'react';
import { Mail, Search, MessageSquare, ArrowLeft, Send, Lock, MoreVertical, ShieldCheck, User } from 'lucide-react';
import Link from 'next/link';

import { useSearchParams } from 'next/navigation';

export default function MessagesClient({ initialMessages, org }: { initialMessages: any[], org: any }) {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<any[]>(initialMessages);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [replyText, setReplyText] = useState('');

  // Group messages by conversation (user)
  const conversationsMap = messages.reduce((acc: any, m: any) => {
    const otherParty = m.senderUserId === null ? (m.receiverUserId === null ? null : m.receiverUser) : m.senderUser;
    if (!otherParty) return acc;
    const key = otherParty.id;
    if (!acc[key]) {
      acc[key] = {
        user: otherParty,
        lastMessage: m,
        messages: []
      };
    }
    acc[key].messages.push(m);
    return acc;
  }, {});

  const conversations = Object.values(conversationsMap).sort((a: any, b: any) => 
    new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
  );

  // Auto-select from searchParams
  React.useEffect(() => {
    const userId = searchParams.get('userId');
    if (userId && conversationsMap[userId]) {
      setSelectedConversation(conversationsMap[userId]);
    }
  }, [searchParams, conversationsMap]);

  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isSending || !selectedConversation) return;

    setIsSending(true);
    try {
      const res = await fetch('/api/studio/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverUserId: selectedConversation.user.id,
          text: replyText
        })
      });

      const data = await res.json();
      if (data.success) {
        // Optimistically update the UI or refetch
        setMessages([...messages, data.message]);
        setReplyText('');
        
        // Update selected conversation messages
        const updatedConv = { ...selectedConversation };
        updatedConv.messages.push(data.message);
        setSelectedConversation(updatedConv);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-100px)]">
        
        {/* LEFTBAR: CONVERSATIONS */}
        <div className="lg:col-span-4 border-r border-white/5 flex flex-col bg-[#050505]">
           <div className="p-8 border-b border-white/5 space-y-6">
              <Link href="/studio" className="flex items-center gap-2 text-gray-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest">
                 <ArrowLeft className="w-4 h-4" />
                 Back to Studio
              </Link>
              <h1 className="text-3xl font-bold italic tracking-tighter uppercase">Communications</h1>
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                 <input 
                   type="text" 
                   placeholder="Search inbound logs..."
                   className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-xs font-bold uppercase tracking-widest text-white focus:outline-none focus:border-[#00D2FF]"
                 />
              </div>
           </div>

           <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                 <div className="p-12 text-center space-y-4">
                    <Mail className="w-12 h-12 text-white/5 mx-auto" />
                    <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                       No active communication threads detected in the network.
                    </p>
                 </div>
              ) : (
                 <div className="divide-y divide-white/5">
                    {conversations.map((conv: any) => (
                       <button 
                         key={conv.user.id}
                         onClick={() => setSelectedConversation(conv)}
                         className={`w-full p-8 text-left transition-all flex items-start gap-5 group relative ${selectedConversation?.user.id === conv.user.id ? 'bg-[#00D2FF]/5 border-l-2 border-[#00D2FF]' : 'hover:bg-white/5 border-l-2 border-transparent'}`}
                       >
                          <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-2xl relative">
                             <img src={conv.user.avatarUrl || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200&q=80'} alt="" className="w-full h-full object-cover" />
                             <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-black"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="flex items-center justify-between mb-1">
                                <h4 className="font-bold text-white truncate group-hover:text-[#00D2FF] transition-colors uppercase tracking-tight">{conv.user.displayName || conv.user.username}</h4>
                                <span className="text-[9px] text-gray-600 font-bold uppercase">{new Date(conv.lastMessage.createdAt).toLocaleDateString()}</span>
                             </div>
                             <p className="text-xs text-gray-500 line-clamp-1 italic">"{conv.lastMessage.text}"</p>
                          </div>
                       </button>
                    ))}
                 </div>
              )}
           </div>
        </div>

        {/* RIGHTBAR: CONVERSATION VIEW */}
        <div className="lg:col-span-8 flex flex-col bg-[#020202]">
           {selectedConversation ? (
              <>
                 {/* Chat Header */}
                 <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#050505]/50 backdrop-blur-xl">
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10">
                          <img src={selectedConversation.user.avatarUrl || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200&q=80'} alt="" className="w-full h-full object-cover" />
                       </div>
                       <div>
                          <h3 className="text-xl font-bold uppercase tracking-tighter italic">{selectedConversation.user.displayName || selectedConversation.user.username}</h3>
                          <div className="flex items-center gap-2">
                             <ShieldCheck className="w-3 h-3 text-[#00D2FF]" />
                             <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Verified Fan Account</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-all">
                          <MoreVertical className="w-4 h-4" />
                       </button>
                    </div>
                 </div>

                 {/* Chat Body */}
                 <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-[url('/backgrounds/grid.svg')] bg-repeat">
                    {selectedConversation.messages.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((m: any) => {
                       const isMine = m.senderOrgId === org.id;
                       return (
                          <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                             <div className={`max-w-[70%] space-y-2 ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                                <div className={`p-6 rounded-3xl text-sm font-medium leading-relaxed ${isMine ? 'bg-[#00D2FF] text-white rounded-tr-none shadow-[0_0_20px_rgba(0,210,255,0.3)]' : 'bg-[#111] border border-white/5 text-gray-300 rounded-tl-none'}`}>
                                   {m.text}
                                </div>
                                <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                             </div>
                          </div>
                       );
                    })}
                 </div>

                 {/* Chat Input */}
                 <div className="p-8 border-t border-white/5 bg-[#050505]">
                    <form 
                      onSubmit={handleSend}
                      className="flex items-center gap-4"
                    >
                       <input 
                         value={replyText}
                         onChange={(e) => setReplyText(e.target.value)}
                         disabled={isSending}
                         placeholder="Type a professional response..."
                         className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-sm text-white focus:outline-none focus:border-[#00D2FF]/50 transition-all shadow-inner disabled:opacity-50"
                       />
                       <button 
                         disabled={isSending || !replyText.trim()}
                         className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center hover:bg-[#00D2FF] hover:text-white transition-all hover:scale-105 active:scale-95 shadow-2xl disabled:opacity-50 disabled:scale-100"
                       >
                          {isSending ? <Lock className="w-6 h-6 animate-pulse" /> : <Send className="w-6 h-6" />}
                       </button>
                    </form>
                 </div>
              </>
           ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-10">
                 <div className="w-32 h-32 rounded-[3rem] bg-white/5 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-[#00D2FF]/20 blur-3xl opacity-50 animate-pulse"></div>
                    <Lock className="w-12 h-12 text-gray-700 relative z-10" />
                 </div>
                 <div className="space-y-4 max-w-sm">
                    <h2 className="text-4xl font-bold uppercase tracking-tighter italic">Secure Inbound Console</h2>
                    <p className="text-gray-500 font-medium leading-relaxed">
                       Operating on the NRH Verified protocol. Select an inbound fan communication to engage in secure professional dialogue.
                    </p>
                 </div>
              </div>
           )}
        </div>

      </div>
    </div>
  );
}
