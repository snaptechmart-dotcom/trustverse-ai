"use client";

import { useState, useEffect, useRef } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // 🔄 Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 🔄 Fetch credits
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await fetch("/api/credits");
        const data = await res.json();
        setCredits(data.credits ?? 0);
      } catch {
        setCredits(0);
      }
    };
    fetchCredits();
  }, []);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        role: "assistant",
        content:
          data?.reply ??
          "I could not analyze this request. Please try again.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "There was an issue processing your request. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const guidedAsk = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-gray-900">
          Trustverse AI Advisor
        </h1>
        <div className="text-sm text-gray-600">
          Credits: <span className="font-medium">{credits ?? "—"}</span>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 && !loading && (
          <div className="max-w-2xl text-gray-700">
            <p className="mb-2 text-base font-medium">
              Tell me what you want to check before trusting.
            </p>
            <p className="mb-6 text-sm text-gray-600">
              You can ask about a phone number, email address, or any trust
              concern.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => guidedAsk("Check a phone number")}
                className="rounded-md border bg-white px-4 py-2 text-sm hover:bg-gray-100"
              >
                Check a phone number
              </button>
              <button
                onClick={() => guidedAsk("Check an email address")}
                className="rounded-md border bg-white px-4 py-2 text-sm hover:bg-gray-100"
              >
                Check an email address
              </button>
              <button
                onClick={() => guidedAsk("Is this safe to trust?")}
                className="rounded-md border bg-white px-4 py-2 text-sm hover:bg-gray-100"
              >
                Is this safe to trust?
              </button>
            </div>
          </div>
        )}

        {/* MESSAGES */}
        <div className="mt-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-900 border"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-lg border bg-white px-4 py-3 text-sm text-gray-600">
                Analyzing trust signals…
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* INPUT */}
      <div className="border-t bg-white px-4 py-4">
        <div className="mx-auto flex max-w-3xl gap-3">
          <input
            type="text"
            placeholder="Ask Trustverse AI…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage(input);
            }}
            className="flex-1 rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="rounded-md bg-gray-900 px-5 py-2 text-sm text-white disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
