'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    let sid = localStorage.getItem('chat_session');
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem('chat_session', sid);
    }
    setSessionId(sid);

    const loadMessages = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sid)
        .order('created_at', { ascending: true });
      setMessages(data || []);
    };
    loadMessages();

    const channel = supabase
      .channel('chat_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${sid}` }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMsg = { session_id: sessionId, sender_type: 'customer', message: input };
    await supabase.from('chat_messages').insert(newMsg);
    await fetch('/api/chat/send', { method: 'POST', body: JSON.stringify({ message: input, sessionId }) });
    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gold text-black px-6 py-3 rounded-full font-bold shadow-lg hover:bg-gold/90 transition"
        >
          💬 Chat
        </button>
      ) : (
        <div className="w-80 bg-gray-900 border border-gold rounded-lg shadow-xl">
          <div className="bg-gold text-black p-3 rounded-t-lg flex justify-between items-center">
            <span className="font-bold">VJ CLUB Support</span>
            <button onClick={() => setIsOpen(false)} className="text-black hover:text-gray-800">✕</button>
          </div>
          <div className="h-80 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 && <p className="text-gray-400 text-sm text-center">Start a conversation with us!</p>}
            {messages.map(msg => (
              <div key={msg.id} className={`p-2 rounded ${
                msg.sender_type === 'customer' 
                  ? 'bg-gray-800 text-white ml-auto max-w-[80%]' 
                  : 'bg-gold/20 text-gold mr-auto max-w-[80%]'
              }`}>
                {msg.message}
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-gray-700 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 bg-black text-white p-2 rounded-l"
              placeholder="Type your message..."
            />
            <button onClick={sendMessage} className="bg-gold text-black px-4 rounded-r font-semibold">Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
