import Link from "next/link";

/* ======================
   SEO METADATA (ADDED)
====================== */
export const metadata = {
  title: "Trustverse AI Blog – Scam Awareness & Online Safety",
  description:
    "Read expert guides on online scams, fraud detection, trust scores, and digital safety powered by Trustverse AI.",
};

const blogs = [
  {
    slug: "how-to-identify-online-scams",
    title: "How to Identify Online Scams Before Losing Money",
    description:
      "Learn practical ways to detect online scams, fake profiles, phishing emails, and fraud attempts before they cause financial or personal damage.",
    date: "2026-01-12",
  },
  {
    slug: "trust-score-explained",
    title: "Trust Score Explained: How to Evaluate Online Risk",
    description:
      "Understand what a Trust Score is, how it works, and how you can use it to make safer decisions online.",
    date: "2026-01-12",
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-10">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Trustverse AI Blog
        </h1>
        <p className="text-gray-600 mt-3 max-w-3xl">
          Insights, guides, and expert analysis on scams, online safety,
          fraud detection, and trust intelligence.
        </p>
      </div>

      {/* ================= BLOG LIST ================= */}
      <div className="grid gap-6 md:grid-cols-2">
        {blogs.map((blog) => (
          <div
            key={blog.slug}
            className="border rounded-xl p-6 bg-white hover:shadow-lg transition"
          >
            <p className="text-sm text-gray-500 mb-2">
              {blog.date}
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              {blog.title}
            </h2>

            <p className="text-gray-600 mt-2">
              {blog.description}
            </p>

            <Link
              href={`/blog/${blog.slug}`}
              className="inline-block mt-4 text-purple-600 font-semibold"
            >
              Read more →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
