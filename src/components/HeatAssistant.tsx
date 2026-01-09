'use client';

import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';

export default function HeatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm your Heat Transfer Assistant. How can I help you minimize energy loss today?" }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Stable 2026 API configuration
  const API_KEY = "AIzaSyBDVR2VRUEbJinsjPtpAano3G9J1l33S4U";
  const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
  const CONTEXT = "You are a friendly Heat Transfer Expert. Help users with conduction, convection, radiation, and R-values.";

  // Handle Hydration to prevent "Application Error"
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!mounted) return null;

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setMessages(prev => [...prev, { role: 'bot', text: 'Analyzing thermal properties...' }]);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Context-injected prompt to avoid "system_instruction" field errors
        body: JSON.stringify({ 
            contents: [{ parts: [{ text: `${CONTEXT}\n\nUser Question: ${userText}` }] }] 
        })
      });

      const data = await res.json();
      
      if (data.candidates && data.candidates[0].content) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'bot', text: aiResponse };
          return updated;
        });
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'bot', text: 'Thermal communication error. Check your connection.' };
        return updated;
      });
    }
  };

  return (
    <div style={{ color: '#333' }}>
      {/* Updated Floating Icon with your image path */}
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ 
          position: 'fixed', bottom: '25px', right: '25px', width: '65px', height: '65px', 
          background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', 
          zIndex: 9999, overflow: 'hidden', border: '2px solid #d35400' 
        }}
      >
        <img 
          src="/bot-icon.png" 
          alt="Heat Assistant" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>

      {/* Sidebar Chat */}
      <div style={{ position: 'fixed', top: 0, right: isOpen ? 0 : '-400px', width: '350px', height: '100%', background: 'white', boxShadow: '-10px 0 20px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 10000 }}>
        <div style={{ background: '#d35400', color: 'white', padding: '15px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Thermal Guide AI</span>
            <span style={{ cursor: 'pointer', fontSize: '24px' }} onClick={() => setIsOpen(false)}>✕</span>
        </div>
        
        <div ref={scrollRef} style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ 
              padding: '10px', borderRadius: '12px', maxWidth: '85%', fontSize: '14px', lineHeight: '1.5',
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', 
              background: msg.role === 'user' ? '#e67e22' : '#f1f3f4', 
              color: msg.role === 'user' ? 'white' : '#333' 
            }}>
               <div dangerouslySetInnerHTML={{ __html: String(marked.parse(msg.text)) }} />
            </div>
          ))}
        </div>

        <div style={{ padding: '15px', borderTop: '1px solid #eee', display: 'flex', gap: '8px' }}>
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()} 
            placeholder="Ask about heat transfer..." 
            style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '25px', outline: 'none' }} 
          />
          <button 
            onClick={sendMessage} 
            style={{ background: '#d35400', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}