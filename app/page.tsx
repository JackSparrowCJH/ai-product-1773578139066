import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: 600, margin: "0 auto" }}>
      <h1>🪵 敲木鱼 - 排行榜</h1>
      <p>功德排行榜系统</p>
      <nav style={{ marginTop: "1rem" }}>
        <Link href="/rank" style={{ color: "#4f46e5", textDecoration: "underline" }}>
          查看排行榜 →
        </Link>
      </nav>
    </div>
  );
}
