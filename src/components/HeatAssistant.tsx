"use client";

import { useState, useEffect, useRef } from "react";
import { marked } from "marked";

export default function HeatAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm your Heat Transfer Assistant. How can I help with your simulation?",
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userText = input;
    setInput("");

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userText },
      { role: "assistant", text: "Thinking..." },
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
          text: data.reply || "No response.",
        };
        return copy;
      });
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          text: "❌ Connection error. Please try again.",
        };
        return copy;
      });
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: "50%",
          border: "2px solid #d35400",
          background: "#fff",
          boxShadow: "0 8px 20px rgba(0,0,0,.25)",
          cursor: "pointer",
          zIndex: 9999,
        }}
      >
        🤖
      </button>

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: open ? 0 : "-380px",
          width: 360,
          height: "100vh",
          background: "#fff",
          boxShadow: "-10px 0 25px rgba(0,0,0,.2)",
          transition: "right .3s ease",
          display: "flex",
          flexDirection: "column",
          zIndex: 10000,
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#d35400",
            color: "#fff",
            padding: 14,
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Thermal Guide AI</span>
          <span style={{ cursor: "pointer" }} onClick={() => setOpen(false)}>
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
                padding: 10,
                borderRadius: 12,
                background: m.role === "user" ? "#e67e22" : "#f1f1f1",
                color: m.role === "user" ? "#fff" : "#000",
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              }}
              dangerouslySetInnerHTML={{ __html: marked.parse(m.text) }}
            />
          ))}
        </div>

        {/* Input Bar */}
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
            placeholder="Ask about heat transfer..."
            style={{
              flex: 1,
              height: 42,
              padding: "0 16px",
              borderRadius: 21,
              border: "1px solid #ccc",
              outline: "none",
              fontSize: 14,
              color: "#000",
              backgroundColor: "#fff",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              background: "#d35400",
              color: "#fff",
              border: "none",
              padding: "0 18px",
              borderRadius: 21,
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
