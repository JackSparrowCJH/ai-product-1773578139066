import { initDB } from "@/lib/db";

export async function POST() {
  try {
    await initDB();
    return Response.json({ ok: true, message: "Database initialized" });
  } catch (e: any) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
