import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { getTimelineEvents } from "@/lib/game-data";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user)) {
    return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });
  }
  const events = getTimelineEvents();
  return new NextResponse(JSON.stringify(events, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": "attachment; filename=os-czasu.json",
    },
  });
}
