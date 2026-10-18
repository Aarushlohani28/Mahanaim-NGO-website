"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, ChevronDown, Heart, Send, Sparkles } from "lucide-react";
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

  // Window event listener for mobile navbar trigger
  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("toggle-chatbot", handleToggle);
    return () => window.removeEventListener("toggle-chatbot", handleToggle);
  }, []);

  return (
    <>
      {/* ── Floating Action Button (Visible on sm+ screens) ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="hidden sm:flex fixed bottom-6 right-6 w-14 h-14 bg-card text-foreground border border-border rounded-full shadow-lg hover:shadow-xl items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 z-50 group"
          aria-label="Open AI Assistant Chat"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-card animate-pulse" />
          </div>
        </button>
      )}

      {/* ── Chat Window ── */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-auto w-auto sm:w-[390px] bg-card text-card-foreground border border-border shadow-2xl z-[60] flex flex-col h-[480px] sm:h-[530px] max-h-[75vh] sm:max-h-[82vh] rounded-3xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          
          {/* Header */}
          <div className="bg-[#111418] text-white p-4 sm:p-5 flex justify-between items-center relative overflow-hidden shrink-0 border-b border-white/10">
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-9 h-9 bg-primary/20 text-primary rounded-xl flex items-center justify-center border border-primary/30">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide text-white">Mahanaim AI Assistant</h3>
                <p className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  Online • 80G &amp; Drive Support
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <ChevronDown className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-secondary/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-primary text-white rounded-2xl rounded-tr-sm font-medium"
                      : "bg-card text-card-foreground border border-border rounded-2xl rounded-tl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Loading dots */}
            {isLoading && (
              <div className="flex flex-col items-start">
                <div className="bg-card border border-border text-muted-foreground rounded-2xl rounded-tl-sm shadow-sm p-3.5 text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 sm:p-4 border-t border-border bg-card flex items-end gap-2 shrink-0"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about drives, 80G receipts..."
              className="flex-1 max-h-24 min-h-[44px] bg-secondary/50 border border-border rounded-2xl p-2.5 sm:p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              rows={1}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-11 h-11 shrink-0 bg-primary hover:bg-rose-700 text-white flex items-center justify-center rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
