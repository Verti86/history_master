import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AssociationsGame from "./AssociationsGame";
import { getAssociations } from "@/lib/game-data";

export default async function SkojarzeniePage() {
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

  const associations = getAssociations();

  return <AssociationsGame associations={associations} userId={user.id} />;
}
