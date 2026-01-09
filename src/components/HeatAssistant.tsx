"use client";

import { useState, useEffect, useRef } from "react";
import { marked } from "marked";

export default function HeatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm your Heat Transfer Assistant. How can I help with your simulation?",
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  if (!mounted) return null;

  async function sendMessage() {
    if (!input.trim()) return;

    const userText = input;
    setInput("");

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userText },
      { role: "assistant", text: "Calculating thermal flow..." },
    ]);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();

      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          text: data.reply ?? "No response generated.",
        };
        return copy;
      });
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          text: "Groq connection error.",
        };
        return copy;
      });
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          zIndex: 9999,
          border: "2px solid #d35400",
          cursor: "pointer",
        }}
      >
        <img
          src="/bot-icon.png"
          alt="Assistant"
          style={{ width: "100%", height: "100%", borderRadius: "50%" }}
        />
      </button>

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: isOpen ? 0 : "-380px",
          width: 360,
          height: "100vh",
          background: "#fff",
          boxShadow: "-10px 0 25px rgba(0,0,0,0.2)",
          transition: "right 0.3s ease",
          zIndex: 10000,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#d35400",
            color: "#fff",
            padding: "14px 16px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Thermal Guide AI (Groq)</span>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => setIsOpen(false)}
          >
            ✕
          </span>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            padding: 14,
            overflowY: "auto",
            background: "#fafafa",
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                marginBottom: 10,
                maxWidth: "85%",
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                background: m.role === "user" ? "#e67e22" : "#f1f1f1",
                color: m.role === "user" ? "#fff" : "#000",
                padding: 10,
                borderRadius: 12,
              }}
              dangerouslySetInnerHTML={{
                __html: marked.parse(m.text),
              }}
            />
          ))}
        </div>

        {/* Input Bar (FIXED) */}
        <div
          style={{
            padding: 12,
            borderTop: "1px solid #ddd",
            display: "flex",
            gap: 8,
            background: "#fff",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about thermal flows..."
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 20,
              border: "1px solid #ccc",
              outline: "none",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              background: "#d35400",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: 20,
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
