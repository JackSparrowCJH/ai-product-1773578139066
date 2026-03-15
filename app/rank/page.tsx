"use client";

import { useEffect, useState } from "react";

interface RankUser {
  openid: string;
  nickname: string;
  avatar: string;
  merit: number;
  rank: number;
}

interface RankData {
  ok: boolean;
  ranking?: RankUser[];
  myRank?: RankUser | null;
  empty?: boolean;
  message?: string | null;
  error?: string;
  code?: string;
}

export default function RankPage() {
  const [openid, setOpenid] = useState("");
  const [data, setData] = useState<RankData | null>(null);
  const [loading, setLoading] = useState(false);
  const [inputId, setInputId] = useState("");

  const fetchRank = async (id?: string) => {
    setLoading(true);
    const qid = id ?? openid;
    const url = qid ? `/api/rank?openid=${encodeURIComponent(qid)}` : `/api/rank`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      setData(json);
    } catch {
      setData({ ok: false, error: "网络错误" });
    }
    setLoading(false);
  };

  const handleLogin = () => {
    if (inputId.trim()) {
      setOpenid(inputId.trim());
      fetchRank(inputId.trim());
    }
  };

  return (
    <div style={{ padding: "1.5rem", fontFamily: "sans-serif", maxWidth: 500, margin: "0 auto" }}>
      <h2>🏆 好友功德排行榜</h2>

      <div style={{ marginBottom: "1rem", display: "flex", gap: 8 }}>
        <input
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          placeholder="输入你的 openid 查看排行"
          style={{ flex: 1, padding: "0.5rem", borderRadius: 4, border: "1px solid #ccc" }}
        />
        <button onClick={handleLogin} style={{ padding: "0.5rem 1rem", borderRadius: 4, background: "#4f46e5", color: "#fff", border: "none", cursor: "pointer" }}>
          查看
        </button>
        <button onClick={() => { setOpenid(""); setData(null); }} style={{ padding: "0.5rem", borderRadius: 4, border: "1px solid #ccc", cursor: "pointer" }}>
          登出
        </button>
      </div>

      {loading && <p>加载中...</p>}

      {!loading && data && !data.ok && data.code === "NOT_LOGGED_IN" && (
        <div style={{ padding: "2rem", textAlign: "center", color: "#888", background: "#f9f9f9", borderRadius: 8 }}>
          <p style={{ fontSize: "2rem" }}>🔒</p>
          <p>{data.error}</p>
        </div>
      )}

      {!loading && data && data.ok && data.empty && (
        <div style={{ padding: "2rem", textAlign: "center", color: "#888", background: "#f9f9f9", borderRadius: 8 }}>
          <p style={{ fontSize: "2rem" }}>📭</p>
          <p>{data.message}</p>
          {data.ranking && data.ranking.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <p style={{ color: "#333", fontWeight: "bold" }}>我的功德</p>
              <p style={{ fontSize: "1.5rem", color: "#4f46e5" }}>{data.ranking[0].merit}</p>
            </div>
          )}
        </div>
      )}

      {!loading && data && data.ok && !data.empty && data.ranking && (
        <div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
                <th style={{ padding: "0.5rem" }}>排名</th>
                <th style={{ padding: "0.5rem" }}>用户</th>
                <th style={{ padding: "0.5rem", textAlign: "right" }}>功德</th>
              </tr>
            </thead>
            <tbody>
              {data.ranking.map((u) => (
                <tr
                  key={u.openid}
                  style={{
                    borderBottom: "1px solid #f0f0f0",
                    background: u.openid === openid ? "#eef2ff" : "transparent",
                  }}
                >
                  <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                    {u.rank === 1 ? "🥇" : u.rank === 2 ? "🥈" : u.rank === 3 ? "🥉" : `#${u.rank}`}
                  </td>
                  <td style={{ padding: "0.5rem" }}>{u.nickname}</td>
                  <td style={{ padding: "0.5rem", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    {u.merit.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.myRank && (
            <p style={{ marginTop: "1rem", color: "#666", textAlign: "center" }}>
              你的排名：第 {data.myRank.rank} 名 | 功德：{data.myRank.merit.toLocaleString()}
            </p>
          )}
        </div>
      )}

      {!loading && !data && (
        <div style={{ padding: "2rem", textAlign: "center", color: "#888", background: "#f9f9f9", borderRadius: 8 }}>
          <p style={{ fontSize: "2rem" }}>🔒</p>
          <p>未登录，请先授权登录后查看排行榜</p>
        </div>
      )}
    </div>
  );
}
