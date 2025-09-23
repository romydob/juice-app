"use client";
import { useState, useEffect } from "react";
import { useSupabase } from "@/components/SupabaseProvider";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const code = searchParams.get("code");
    console.log("URL params:", searchParams.toString());

    // Listen for password recovery event
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setEnabled(true);
      }
    });

    // If code is present in URL, enable form
    if (code) {
      setEnabled(true);
    }

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase, searchParams]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enabled) {
      setMessage("❌ Cannot reset now. Try via the link again.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage(`❌ ${error.message}`);
    } else {
      setMessage("✅ Password updated! Redirecting to sign-in...");
      setTimeout(() => router.push("/signin"), 2000);
    }
  };

  return (
    <form onSubmit={handleReset} className="...">
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={!enabled}>
        {enabled ? "Update Password" : "Waiting for recovery link..."}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
