"use client";

import { useEffect, useRef, useState } from "react";
import { marked } from "marked";

export default function HeatAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([
    {
      role: "assistant",
      text: "Hi! I'm your Heat Transfer Assistant. How can I help?",
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

    setMessages((m) => [
      ...m,
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

      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          text: data.reply || "No reply",
        };
        return copy;
      });
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          text: "❌ Connection error. Try again.",
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
          width: 64,
          height: 64,
          borderRadius: "50%",
          border: "2px solid #d35400",
          background: "#fff",
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
          right: open ? 0 : "-360px",
          width: 360,
          height: "100vh",
          background: "#fff",
          boxShadow: "-10px 0 25px rgba(0,0,0,0.2)",
          transition: "0.3s",
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
          Thermal Guide AI
          <span
            style={{ cursor: "pointer" }}
            onClick={() => setOpen(false)}
          >
            ✕
          </span>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            padding: 12,
            overflowY: "auto",
            background: "#fafafa",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                maxWidth: "85%",
                alignSelf:
                  m.role === "user" ? "flex-end" : "flex-start",
                background:
                  m.role === "user" ? "#e67e22" : "#f1f1f1",
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

        {/* Input */}
        <div
          style={{
            padding: 10,
            borderTop: "1px solid #ddd",
            display: "flex",
            gap: 8,
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about heat transfer..."
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 20,
              border: "1px solid #ccc",
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
            }}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
