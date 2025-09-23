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
      const { data, error } = await supabase.auth.getSessionFromUrl({
        storeSession: true,
      });

      if (error) {
        setStatus(`❌ Error: ${error.message}`);
        return;
      }

      const session = data.session;

      if (!session) {
        setStatus("❌ No active session found");
        return;
      }

      // Check if this is a password recovery
      if (data.url?.includes("type=recovery")) {
        
        setStatus("✅ Password recovery detected. Redirecting...");
        await supabase.auth.signOut();
        router.push("/reset-password");
        return;
      }

      // Normal login / signup confirmation
      setStatus("✅ Login successful! Redirecting...");
      router.push("/test");
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
