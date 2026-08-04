"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, ChevronDown, Heart, Send } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
}

interface ApiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export default function MiniChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isSignedIn, user } = useUser();
  const [hasGreetedLoggedInUser, setHasGreetedLoggedInUser] = useState(false);

  // Auto-open and greet when user logs in
  useEffect(() => {
    if (isSignedIn && user && !hasGreetedLoggedInUser) {
      setIsOpen(true);
      setMessages([
        {
          id: "1",
          sender: "bot",
          text: `Welcome back, ${user.firstName || "friend"}! I'm the AI assistant for Mahanaim Miraj NGO. I can answer any questions you have about our community drives, donations, and 80G tax exemptions. How can I help you today?`,
        },
      ]);
      setHasGreetedLoggedInUser(true);
    }
  }, [isSignedIn, user, hasGreetedLoggedInUser]);

  // Standard initialization if opened manually and not logged in
  useEffect(() => {
    if (isOpen && messages.length === 0 && !isSignedIn) {
      setMessages([
        {
          id: "1",
          sender: "bot",
          text: "Hello! I'm the AI assistant for Mahanaim Miraj NGO. I can answer any questions you have about our community drives, donations, and 80G tax exemptions. How can I help you today?",
        },
      ]);
    }
  }, [isOpen, messages.length, isSignedIn]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const history: ApiMessage[] = messages.slice(1).map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history, message: userText }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "API response was not ok");
      }
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: data.text || "Sorry, I am having trouble understanding that right now.",
        },
      ]);
    } catch (err: any) {
      console.error("Chat Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text:
            err.message ||
            "I'm sorry, I'm having trouble connecting to my servers. Please try again later or email us directly.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* ── Floating Action Button ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="
            fixed bottom-6 right-6 w-16 h-16
            bg-white dark:bg-slate-800
            border border-border
            text-foreground
            rounded-full shadow-glass dark:shadow-glassDark
            flex items-center justify-center
            hover:scale-105 hover:shadow-cardHover
            transition-all duration-300
            z-50
          "
          aria-label="Open chat"
        >
          <MessageSquare className="w-7 h-7 text-foreground" />
        </button>
      )}

      {/* ── Chat Window ── */}
      {isOpen && (
        <div
          className="
            fixed bottom-6 right-6
            w-[340px] sm:w-[400px]
            bg-white dark:bg-slate-900
            border border-border
            shadow-glassDark dark:shadow-cardDark
            z-50 flex flex-col
            h-[550px] max-h-[85vh]
            rounded-3xl overflow-hidden
            animate-in slide-in-from-bottom-5 duration-300
          "
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white p-5 flex justify-between items-center relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-sm">
                <Heart className="w-5 h-5 fill-coralAccent-500 text-coralAccent-500" />
              </div>
              <div>
                <h3 className="font-bold text-base tracking-wide">Mahanaim AI</h3>
                <p className="text-xs text-gray-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/25 rounded-full transition-colors relative z-10"
              aria-label="Close chat"
            >
              <ChevronDown className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-secondary dark:bg-slate-900/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-4 text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? /* User bubble — brand red in dark, near-black in light */
                        "bg-brandRed-500 dark:bg-brandRed-600 text-white rounded-[1.5rem] rounded-tr-md"
                      : /* Bot bubble — card surface, always readable */
                        "bg-card text-card-foreground border border-border rounded-[1.5rem] rounded-tl-md"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Loading dots */}
            {isLoading && (
              <div className="flex flex-col items-start">
                <div className="bg-card border border-border text-muted-foreground rounded-[1.5rem] rounded-tl-md shadow-sm p-4 text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-border bg-card flex items-end gap-3 shrink-0"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="
                flex-1 max-h-32 min-h-[48px]
                bg-background dark:bg-slate-800
                border border-border
                rounded-2xl p-3 text-sm text-foreground
                placeholder:text-muted-foreground
                resize-none
                focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                shadow-sm transition-colors
              "
              rows={1}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="
                w-12 h-12 shrink-0
                bg-brandRed-500 hover:bg-brandRed-600
                text-white
                flex items-center justify-center
                rounded-2xl
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:shadow-lg hover:-translate-y-0.5
                transition-all shadow-md
              "
              aria-label="Send message"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
