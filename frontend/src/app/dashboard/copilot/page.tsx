"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import axios from "@/lib/axios";
import { auth } from "@/lib/firebase";

export default function CopilotPage() {
  const defaultMessages: {role: "user" | "bot", text: string}[] = [
    { role: "bot", text: "Hello! I am the Beacon AI Copilot. I have full access to your workspace's global metrics, active Sybil clusters, and live alerts. How can I assist your investigation today?" }
  ];

  const [messages, setMessages] = useState<{role: "user" | "bot", text: string}[]>(defaultMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("copilot_messages");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (e) {
        console.error("Failed to parse saved messages", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("copilot_messages", JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userQuery = input.trim();
    setMessages(prev => [...prev, { role: "user", text: userQuery }]);
    setInput("");
    setIsLoading(true);

    try {
      // Stub workspace for Phase 3
      const workspaceId = "workspace-1";
      
      let token = "";
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      }

      const res = await axios.post("http://localhost:3001/api/copilot/chat", {
        prompt: userQuery,
        workspaceId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessages(prev => [...prev, { role: "bot", text: res.data.reply }]);
    } catch (error: any) {
      console.error("Copilot Error", error);
      const fallback = error.response?.data?.reply || "I'm sorry, I am currently unable to connect to the intelligence layer. Please check your API keys or try again later.";
      setMessages(prev => [...prev, { role: "bot", text: fallback }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-[var(--accent)]" />
          AI Copilot
        </h1>
        <p className="text-[var(--secondary)]">
          Your global forensic assistant. Ask questions about network threats and active clusters.
        </p>
      </div>

      {/* Chat Box */}
      <div className="flex-1 bg-white rounded-2xl border border-[var(--border)] shadow-sm flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[var(--accent)] text-white' : 'bg-[#EFEFEF] text-[var(--primary)]'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-6 h-6" />}
              </div>
              <div className={`max-w-[75%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-[var(--background)] border border-[var(--border)]' : 'bg-white border border-[var(--border)] shadow-sm'}`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#EFEFEF] text-[var(--primary)] flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[var(--border)] shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></span>
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[var(--background)] border-t border-[var(--border)]">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about active Sybil clusters or network anomalies..."
              className="w-full pl-6 pr-14 py-4 rounded-xl border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm shadow-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--accent)] transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
