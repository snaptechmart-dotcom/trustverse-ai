import { notFound } from "next/navigation";
import Link from "next/link";

async function getHistory(username: string) {
  const res = await fetch(
    `http://localhost:3000/api/profile/${username}/history`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function HistoryPage({
  params,
}: {
  params: { username: string };
}) {
  const data = await getHistory(params.username);

  if (!data) return notFound();

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>
        Profile History
      </h1>

      {data.history.length === 0 && <p>No activity found</p>}

      {data.history.map((item: any) => (
        <div
          key={item._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
            background: "#fff",
          }}
        >
          <strong>{item.action}</strong>
          <div>Impact: {item.impact}</div>
          <div>{item.reason}</div>
          <small>
            {new Date(item.createdAt).toLocaleString()}
          </small>
        </div>
      ))}

      <br />
      <Link href={`/profile/${params.username}`}>
        ← Back to Profile
      </Link>
    </div>
  );
}
