"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { AiOutlineRobot } from "react-icons/ai";

export default function AdvancedAIAnalysis() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);

    const res = await fetch("/api/advanced-analysis", {
      method: "POST",
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <AiOutlineRobot className="text-blue-500" size={40} />
        <h1 className="text-3xl font-bold">Advanced AI Analysis</h1>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-5 rounded-xl shadow-md"
      >
        <textarea
          placeholder="Paste chat, text, message, profile, number, email, etc..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-4 h-40 border rounded-lg outline-none"
        />

        <button
          onClick={analyze}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg shadow"
        >
          {loading ? "Analyzing..." : "Run AI Analysis"}
        </button>
      </motion.div>

      {/* Result Section */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-gray-50 p-6 rounded-xl shadow"
        >
          <h2 className="text-xl font-semibold mb-3">AI Result</h2>

          <p><b>Red Flags:</b> {result.redFlags}</p>
          <p><b>Text Complexity:</b> {result.complexity}</p>
          <p><b>Probability Score:</b> {result.probability}%</p>
        </motion.div>
      )}
    </div>
  );
}
