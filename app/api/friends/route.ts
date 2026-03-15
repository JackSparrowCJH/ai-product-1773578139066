import { query, initDB } from "@/lib/db";

// Add friendship
export async function POST(req: Request) {
  try {
    await initDB();
    const { user_openid, friend_openid } = await req.json();
    if (!user_openid || !friend_openid) {
      return Response.json({ ok: false, error: "user_openid and friend_openid are required" }, { status: 400 });
    }
    if (user_openid === friend_openid) {
      return Response.json({ ok: false, error: "Cannot add yourself as friend" }, { status: 400 });
    }
    // Bidirectional friendship
    await query(
      `INSERT INTO friendships (user_openid, friend_openid) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [user_openid, friend_openid]
    );
    await query(
      `INSERT INTO friendships (user_openid, friend_openid) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [friend_openid, user_openid]
    );
    return Response.json({ ok: true });
  } catch (e: any) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
