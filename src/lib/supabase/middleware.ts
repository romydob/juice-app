import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  // Create Supabase client for server
  const supabase = createServerComponentClient({ cookies });

  // Get current session
  const {
     data: { session } } = await supabase.auth.getSession();

  // Example: redirect if not logged in
  if (!session) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // Proceed normally
  return NextResponse.next();
}
