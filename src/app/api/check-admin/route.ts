import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Server-side Supabase client using service_role key
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ ok: false });

  const { data: admin } = await supabaseAdmin
    .from("admins")
    .select("id")
    .eq("id", userId)
    .single();

  return NextResponse.json({ ok: !!admin });
}
