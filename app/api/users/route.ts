import { query, initDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await initDB();
    const body = await req.json();
    const { openid, nickname, avatar } = body;
    if (!openid) {
      return Response.json({ ok: false, error: "openid is required" }, { status: 400 });
    }
    const res = await query(
      `INSERT INTO users (openid, nickname, avatar)
       VALUES ($1, $2, $3)
       ON CONFLICT (openid) DO UPDATE SET
         nickname = COALESCE(NULLIF($2, ''), users.nickname),
         avatar = COALESCE(NULLIF($3, ''), users.avatar),
         updated_at = NOW()
       RETURNING *`,
      [openid, nickname || "匿名用户", avatar || ""]
    );
    return Response.json({ ok: true, user: res.rows[0] });
  } catch (e: any) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
