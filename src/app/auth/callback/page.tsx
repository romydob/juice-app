"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/SupabaseProvider";

export default function AuthCallbackPage() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [status, setStatus] = useState("Processing authentication...");

  useEffect(() => {
    const handleAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        setStatus("❌ Missing auth code in callback URL");
        return;
      }

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        setStatus(`❌ Error: ${error.message}`);
        return;
      }

      const session = data.session;

      if (!session) {
        setStatus("❌ No active session found");
        return;
      }

      // Normal login / signup confirmation
      setStatus("✅ Login successful! Redirecting...");
      router.push("/test"); // change to wherever you want after login
    };

    handleAuthCallback();
  }, [supabase, router]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Authentication</h1>
      <p className="mt-4">{status}</p>
    </div>
  );
}
