import { notFound } from "next/navigation";
import type { Metadata } from "next";

/* ======================
   SITE CONFIG
====================== */
const SITE_URL = "https://trustverseai.com";
const SITE_NAME = "Trustverse AI";

/* ======================
   BLOG DATA
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

        <ul>
          <li>Receiving calls from unknown phone numbers</li>
          <li>Visiting new or unfamiliar websites</li>
          <li>Opening emails with links or attachments</li>
          <li>Making online payments or sharing personal data</li>
        </ul>

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

        <h3>AI Risk Intelligence Models</h3>
        <p>
          Machine-learning models combine all signals to calculate a final
          Trust Score that reflects real-world risk.
        </p>

        <h2>Real-World Use Cases of Trust Scores</h2>
        <ul>
          <li>Checking unknown phone numbers before answering</li>
          <li>Verifying websites before making payments</li>
          <li>Detecting phishing emails and fake offers</li>
          <li>Evaluating online businesses and partners</li>
        </ul>

        <h2>Trust Score vs Traditional Scam Checks</h2>
        <ul>
          <li>Traditional checks rely on limited data sources</li>
          <li>Trust Scores use AI-powered real-time analysis</li>
          <li>Trustverse AI adapts to new scam patterns</li>
          <li>Users get a clear risk score instead of guesswork</li>
        </ul>

        <h2>How to Check a Trust Score Using Trustverse AI</h2>
        <ol>
          <li>Open the Trustverse AI dashboard</li>
          <li>Select the appropriate tool</li>
          <li>Enter a website, phone number, or email</li>
          <li>Receive instant Trust Score and insights</li>
        </ol>

        <h2>Frequently Asked Questions</h2>

        <h3>What is a good Trust Score?</h3>
        <p>
          A Trust Score above 70 generally indicates low risk, but caution is
          always recommended.
        </p>

        <h3>Can a Trust Score change over time?</h3>
        <p>
          Yes. Scores update as new data, reports, and behavior patterns appear.
        </p>

        <h3>Is Trustverse AI free to use?</h3>
        <p>
          Basic checks are free. Advanced insights are available in Pro plans.
        </p>

        <h2>Final Thoughts</h2>
        <p>
          A Trust Score empowers users to make informed decisions in seconds.
          AI-powered trust verification is no longer optional.
        </p>

        <p>
          <strong>
            Stay alert. Stay informed. Protect yourself with Trustverse AI.
          </strong>
        </p>
      </>
    ),
  },
];

/* ======================
   METADATA
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
