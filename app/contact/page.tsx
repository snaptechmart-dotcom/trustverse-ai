"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>

      {/* 🟢 Removed broken image — no error now */}

      <p className="text-center text-gray-600 mb-10">
        Have questions? Want help? Just send us a message.
      </p>

      <form className="space-y-6">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-3 rounded bg-gray-800 text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Your Email"
          className="w-full p-3 rounded bg-gray-800 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <textarea
          placeholder="Your Message"
          className="w-full p-3 rounded bg-gray-800 text-white h-32"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          type="button"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
