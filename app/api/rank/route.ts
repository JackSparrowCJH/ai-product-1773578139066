import { query, initDB } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await initDB();
    const { searchParams } = new URL(req.url);
    const openid = searchParams.get("openid");

    // Not logged in
    if (!openid) {
      return Response.json({
        ok: false,
        error: "未登录，请先授权登录后查看排行榜",
        code: "NOT_LOGGED_IN"
      }, { status: 401 });
    }

    // Check user exists
    const userRes = await query(`SELECT * FROM users WHERE openid = $1`, [openid]);
    if (userRes.rowCount === 0) {
      return Response.json({
        ok: false,
        error: "用户不存在，请先登录",
        code: "NOT_LOGGED_IN"
      }, { status: 401 });
    }

    // Get friends ranked by merit descending
    const rankRes = await query(
      `SELECT u.openid, u.nickname, u.avatar, u.merit
       FROM friendships f
       JOIN users u ON u.openid = f.friend_openid
       WHERE f.user_openid = $1
       ORDER BY u.merit DESC, u.updated_at ASC`,
      [openid]
    );

    // Include self in ranking
    const self = userRes.rows[0];
    const allUsers = [
      { openid: self.openid, nickname: self.nickname, avatar: self.avatar, merit: Number(self.merit) },
      ...rankRes.rows.map((r: any) => ({
        openid: r.openid,
        nickname: r.nickname,
        avatar: r.avatar,
        merit: Number(r.merit),
      }))
    ];

    // Sort by merit descending
    allUsers.sort((a, b) => b.merit - a.merit);

    // Assign rank
    const ranked = allUsers.map((u, i) => ({ ...u, rank: i + 1 }));

    // Find current user's rank
    const myRank = ranked.find((u) => u.openid === openid);

    // Empty state: only self, no friends
    const hasFriends = rankRes.rowCount! > 0;

    return Response.json({
      ok: true,
      ranking: ranked,
      myRank: myRank || null,
      empty: !hasFriends,
      message: hasFriends ? null : "暂无好友排名数据，快邀请好友一起来敲木鱼吧！"
    });
  } catch (e: any) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
