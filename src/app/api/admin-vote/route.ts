import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) throw new Error("Supabase environment variables are not set!");
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  const supabaseAdmin = getSupabaseAdmin();
  const { entry_id, user_id } = await req.json();

  if (!entry_id || !user_id) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  // Verify admin
  const { data: admin } = await supabaseAdmin
    .from("admins")
    .select("id")
    .eq("id", user_id)
    .single();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Insert vote
  const { error } = await supabaseAdmin.from("votes").insert({ entry_id });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
