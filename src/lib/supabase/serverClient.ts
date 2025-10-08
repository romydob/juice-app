import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

export const supabaseServer = createClient<Database>(
  process.env.SUPABASE_URL!,           // server-only Supabase URL
  process.env.SUPABASE_SERVICE_KEY!    // service role key (server-only)
);
