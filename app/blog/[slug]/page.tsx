import { notFound } from "next/navigation";
import type { Metadata } from "next";

/* ======================
   SITE CONFIG
====================== */
const SITE_URL = "https://trustverseai.com";
const SITE_NAME = "Trustverse AI";

/* ======================
   BLOG DATA (ALL SLUGS MUST BE HERE)
====================== */
const posts = [
  {
    slug: "trust-score-explained",
    title: "Trust Score Explained – How Trustverse AI Evaluates Online Risk",
    date: "2026-01-12",
    author: "Trustverse AI Team",
    seo: {
      title:
        "Trust Score Explained – How Trustverse AI Evaluates Online Risk",
      description:
        "Understand what a Trust Score is, how Trustverse AI calculates it, and how it helps detect online scams, fraud websites, phishing emails, and risky phone numbers.",
      image: "/og/trust-score.png",
    },
    content: (
      <>
        <p>
          Online scams are evolving faster than ever. Fraudsters now create
          professional-looking websites, realistic phishing emails, and
          convincing phone scams that can fool even experienced users.
        </p>

        <p>
          This is why relying on gut feeling is no longer enough. A{" "}
          <strong>Trust Score</strong> gives you a data-driven way to measure
          online risk before you interact, click, reply, or make a payment.
        </p>

        <h2>What Is a Trust Score?</h2>
        <p>
          A Trust Score is a numerical rating between <strong>0 and 100</strong>{" "}
          that indicates how safe or risky an online entity is.
        </p>

        <ul>
          <li>
            <strong>70–100:</strong> Low risk, generally safe to interact
          </li>
          <li>
            <strong>40–69:</strong> Medium risk, caution recommended
          </li>
          <li>
            <strong>0–39:</strong> High risk, possible scam or fraud
          </li>
        </ul>

        <h2>Why Trust Scores Matter in Today’s Internet</h2>
        <p>
          Cybercriminals adapt quickly. New scam websites appear daily, phone
          numbers are recycled, and phishing emails impersonate trusted brands.
        </p>

        <h2>How Trustverse AI Calculates Trust Scores</h2>

        <h3>Reputation Signals</h3>
        <p>
          Public scam reports, blacklists, complaint databases, and historical
          fraud data are analyzed.
        </p>

        <h3>Behavioral Analysis</h3>
        <p>
          AI systems detect suspicious behavior such as sudden traffic spikes,
          automation signals, and repeated scam-like actions.
        </p>

        <h3>Scam Pattern Detection</h3>
        <p>
          Known scam templates, phishing layouts, impersonation tactics, and
          fraud scripts are matched using AI models.
        </p>

        <h2>Final Thoughts</h2>
        <p>
          Trust Scores help users make informed decisions in seconds. Staying
          alert and using AI-powered tools is essential for online safety.
        </p>
      </>
    ),
  },

  {
    slug: "how-to-identify-online-scams",
    title: "How to Identify Online Scams Before Losing Money",
    date: "2026-01-12",
    author: "Trustverse AI Team",
    seo: {
      title: "How to Identify Online Scams Before Losing Money",
      description:
        "Learn practical ways to detect online scams, fake profiles, phishing emails, and fraud attempts before they cause financial or personal damage.",
      image: "/og/online-scams.png",
    },
    content: (
      <>
        <p>
          Online scams are increasing worldwide, and attackers continuously
          change their techniques to trick users into sharing money or data.
        </p>

        <h2>Common Types of Online Scams</h2>
        <ul>
          <li>Phishing emails and fake messages</li>
          <li>Impersonation scams</li>
          <li>Fake investment opportunities</li>
          <li>Fraudulent shopping websites</li>
        </ul>

        <h2>Warning Signs You Should Never Ignore</h2>
        <ul>
          <li>Urgent payment or action requests</li>
          <li>Unknown links or attachments</li>
          <li>Offers that sound too good to be true</li>
          <li>Pressure tactics and threats</li>
        </ul>

        <h2>How Trustverse AI Helps Detect Scams</h2>
        <p>
          Trustverse AI analyzes scam reports, reputation data, and behavioral
          patterns to identify fraud before users suffer damage.
        </p>

        <p>
          <strong>
            Awareness and verification are the strongest defenses against
            online scams.
          </strong>
        </p>
      </>
    ),
  },
];

/* ======================
   SEO METADATA
====================== */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};

  const url = `${SITE_URL}/blog/${slug}`;

  return {
    title: post.seo.title,
    description: post.seo.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.seo.title,
      description: post.seo.description,
      url,
      siteName: SITE_NAME,
      type: "article",
      images: [
        {
          url: `${SITE_URL}${post.seo.image}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo.title,
      description: post.seo.description,
      images: [`${SITE_URL}${post.seo.image}`],
    },
  };
}

/* ======================
   PAGE
====================== */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-8">
        {post.date} · {post.author}
      </p>

      <article className="prose prose-neutral max-w-none">
        {post.content}
      </article>
    </main>
  );
}
