import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export const createServerSupabase = () => {
  // Pass the Next.js cookies object
  return createServerComponentClient({ cookies });
};
