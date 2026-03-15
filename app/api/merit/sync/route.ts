import { query, initDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await initDB();
    const { openid, merit } = await req.json();
    if (!openid) {
      return Response.json({ ok: false, error: "openid is required" }, { status: 400 });
    }
    if (typeof merit !== "number" || merit < 0) {
      return Response.json({ ok: false, error: "merit must be a non-negative number" }, { status: 400 });
    }
    const res = await query(
      `UPDATE users SET merit = $2, updated_at = NOW() WHERE openid = $1 RETURNING *`,
      [openid, merit]
    );
    if (res.rowCount === 0) {
      return Response.json({ ok: false, error: "User not found" }, { status: 404 });
    }
    return Response.json({ ok: true, user: res.rows[0] });
  } catch (e: any) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
