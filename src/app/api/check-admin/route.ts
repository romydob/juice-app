import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) throw new Error("Supabase environment variables are not set!");
  return createClient(url, key);
}

export async function GET(req: NextRequest) {
  const supabaseAdmin = getSupabaseAdmin();
  const userId = req.headers.get("x-user-id");

  if (!userId) return NextResponse.json({ ok: false });

  const { data: admin } = await supabaseAdmin
    .from("admins")
    .select("id")
    .eq("id", userId)
    .single();

  return NextResponse.json({ ok: !!admin });
}
