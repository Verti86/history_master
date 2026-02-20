import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TimelineGame from "./TimelineGame";
import { getTimelineEvents } from "@/lib/game-data";

export default async function OsCzasuPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", user.id)
    .single();

  if (!profile?.nickname) {
    redirect("/ustaw-nick");
  }

  const events = getTimelineEvents();

  return <TimelineGame events={events} userId={user.id} />;
}
