"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AiOutlineSafety,
  AiOutlinePhone,
  AiOutlineRobot,
  AiOutlineHistory,
  AiOutlineUser,
} from "react-icons/ai";

export default function ToolsHome() {
  const tools = [
    {
      title: "Trust Score Analyzer",
      desc: "AI-powered trust scoring with risk level classification.",
      icon: <AiOutlineSafety size={40} />,
      color: "bg-blue-600",
      link: "/tools/trust-score",
    },
    {
      title: "Phone Number Checker",
      desc: "Detect validity, activity status, and spam probability.",
      icon: <AiOutlinePhone size={40} />,
      color: "bg-green-600",
      link: "/tools/phone-check",
    },
    {
      title: "Social Analyzer",
      desc: "Analyze usernames from FB, Instagram, Twitter, LinkedIn.",
      icon: <AiOutlineUser size={40} />,
      color: "bg-purple-600",
      link: "/tools/social-analyzer",
    },
    {
      title: "Advanced AI Analysis",
      desc: "Deep AI reasoning: red flags, scam signals, probability.",
      icon: <AiOutlineRobot size={40} />,
      color: "bg-orange-600",
      link: "/tools/advanced",
    },
    {
      title: "Report History",
      desc: "View all previous checks and AI report logs.",
      icon: <AiOutlineHistory size={40} />,
      color: "bg-gray-700",
      link: "/tools/history",
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Trustverse AI Tools</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-xl text-white shadow-lg ${t.color}`}
          >
            <div className="mb-3">{t.icon}</div>
            <h2 className="text-xl font-semibold">{t.title}</h2>
            <p className="text-sm mt-2">{t.desc}</p>

            <Link
              href={t.link}
              className="inline-block mt-4 bg-white text-black px-4 py-2 rounded-lg font-semibold"
            >
              Open Tool
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
