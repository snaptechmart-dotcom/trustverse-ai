"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      setStatus("error");
      return;
    }

    // 🔒 For now we just simulate success
    // Later we can connect email / backend API here
    setStatus("success");

    // Reset form
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Contact Us
      </h1>

      <p className="text-center text-gray-600 mb-10">
        Have questions, feedback, or need help?  
        Send us a message and our team will get back to you.
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
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
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
        >
          Send Message
        </button>

        {/* STATUS MESSAGE */}
        {status === "success" && (
          <p className="text-green-600 text-center">
            ✅ Your message has been sent successfully.
          </p>
        )}

        {status === "error" && (
          <p className="text-red-600 text-center">
            ❌ Please fill in all fields before submitting.
          </p>
        )}
      </form>
    </div>
  );
}
