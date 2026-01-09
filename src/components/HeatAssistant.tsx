"use client";

import { useState, useEffect, useRef } from "react";
import { marked } from "marked";

export default function HeatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm your Heat Transfer Assistant. How can I help you today?",
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
      { role: "bot", text: "Analyzing thermal properties..." },
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
          role: "bot",
          text: data.reply ?? "No response from server.",
        };
        return copy;
      });
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "bot",
          text: "Server communication error.",
        };
        return copy;
      });
    }
  }

  return (
    <>
      {/* Floating Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "#fff",
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(0,0,0,.25)",
          zIndex: 9999,
        }}
      >
        <img
          src="/bot-icon.png"
          alt="Assistant"
          style={{ width: "100%", height: "100%", borderRadius: "50%" }}
        />
      </div>

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: isOpen ? 0 : "-360px",
          width: 360,
          height: "100%",
          background: "#fff",
          transition: "0.3s",
          zIndex: 10000,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            background: "#d35400",
            color: "#fff",
            padding: 14,
            fontWeight: "bold",
          }}
        >
          Thermal Guide AI
          <span
            style={{ float: "right", cursor: "pointer" }}
            onClick={() => setIsOpen(false)}
          >
            ✕
          </span>
        </div>

        <div
          ref={scrollRef}
          style={{ flex: 1, overflowY: "auto", padding: 12 }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                marginBottom: 10,
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                background: m.role === "user" ? "#e67e22" : "#f1f1f1",
                color: m.role === "user" ? "#fff" : "#000",
                padding: 10,
                borderRadius: 10,
                maxWidth: "85%",
              }}
              dangerouslySetInnerHTML={{ __html: marked.parse(m.text) }}
            />
          ))}
        </div>

        <div style={{ padding: 10, display: "flex", gap: 6 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about heat transfer..."
            style={{ flex: 1, padding: 10, borderRadius: 20 }}
          />
          <button
            onClick={sendMessage}
            style={{
              background: "#d35400",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: 20,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
