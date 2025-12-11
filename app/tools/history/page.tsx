"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AiOutlineHistory } from "react-icons/ai";

export default function HistoryPage() {
  const [items, setItems] = useState([]);

  const loadHistory = async () => {
    const res = await fetch("/api/history");
    const data = await res.json();
    setItems(data.history);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <AiOutlineHistory size={40} className="text-purple-500" />
        <h1 className="text-3xl font-bold">AI Report History</h1>
      </motion.div>

      {/* History Cards */}
      <div className="space-y-5">
        {items.map((item: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="p-5 bg-white rounded-xl shadow-md border"
          >
            <p className="text-sm text-gray-600">
              <b>Prompt:</b> {item.prompt}
            </p>

            <p className="mt-2">
              <b>AI Response:</b>
            </p>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {item.response}
            </pre>
          </motion.div>
        ))}

        {items.length === 0 && (
          <p className="text-gray-500 text-center">No reports found yet.</p>
        )}
      </div>
    </div>
  );
}
