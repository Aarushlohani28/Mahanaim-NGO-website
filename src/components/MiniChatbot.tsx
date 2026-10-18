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

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+919876543210";
  const cleanWhatsappNumber = whatsappNumber.startsWith("+")
    ? whatsappNumber
    : `+${whatsappNumber}`;
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber.replace(/[^0-9+]/g, "")}?text=${encodeURIComponent(
    "Hello Mahanaim Miraj NGO, I would like to connect with your team."
  )}`;

  return (
    <>
      {/* ── Floating Action Buttons (WhatsApp to the left, AI Assistant to the right) ── */}
      {!isOpen && (
        <div className="hidden sm:flex fixed bottom-6 right-6 items-center gap-3.5 z-50">
          {/* WhatsApp Floating Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 bg-card text-foreground border border-border rounded-full shadow-lg hover:shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 group relative"
            aria-label="Connect on WhatsApp"
            title="Chat with Mahanaim NGO on WhatsApp"
          >
            <div className="relative flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
                className="w-6 h-6 text-[#25D366] group-hover:scale-110 transition-transform duration-200"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#25D366] ring-2 ring-card animate-pulse" />
            </div>

            {/* Hover Tooltip */}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-gray-900 text-white text-[11px] font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
              WhatsApp Support
            </span>
          </a>

          {/* AI Assistant Chat Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-card text-foreground border border-border rounded-full shadow-lg hover:shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 group relative"
            aria-label="Open AI Assistant Chat"
            title="Open AI Assistant Chat"
          >
            <div className="relative flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-card animate-pulse" />
            </div>

            {/* Hover Tooltip */}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-gray-900 text-white text-[11px] font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
              AI Assistant
            </span>
          </button>
        </div>
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
            <div className="flex items-center gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-[#25D366]/20 text-[#25D366] rounded-full transition-colors"
                title="Chat with staff on WhatsApp"
                aria-label="Connect on WhatsApp"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <ChevronDown className="w-4 h-4 text-white" />
              </button>
            </div>
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
