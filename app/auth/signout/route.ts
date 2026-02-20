import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/site-config";

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(getBaseUrl() + "/", 302);
}
