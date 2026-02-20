import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CategoryPicker from "@/components/CategoryPicker";
import { CATEGORIES } from "@/lib/categories";

export default async function FiszkiPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", user.id)
    .single();
  if (!profile?.nickname) redirect("/ustaw-nick");

  return (
    <CategoryPicker
      baseUrl="/fiszki"
      title="🧠 Fiszki"
      subtitle="Wybierz temat do nauki:"
      categoryCount={CATEGORIES.length}
    />
  );
}
