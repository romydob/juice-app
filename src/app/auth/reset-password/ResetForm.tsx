"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/SupabaseProvider";

export default function ResetForm() {
  const { supabase } = useSupabase();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Supabase automatically sets a temporary session when user clicks the recovery link
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setEnabled(true);
      } else {
        setMessage("❌ Waiting for recovery session…");
      }
    };

    checkSession();
  }, [supabase]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enabled) return;

    const { error } = await supabase.auth.updateUser({ password });

    if (error) setMessage(`❌ ${error.message}`);
    else {
      setMessage("✅ Password updated! Redirecting to sign-in...");
      setTimeout(() => router.push("/signin"), 2000);
    }
  };

  return (
    <form onSubmit={handleReset} className="flex flex-col gap-4 max-w-sm mx-auto mt-20">
      <h1 className="text-2xl font-bold text-center">Reset Password</h1>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="border p-2 rounded w-full"
      />
      <button
        type="submit"
        disabled={!enabled}
        className={`py-2 rounded text-white ${enabled ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
      >
        {enabled ? "Update Password" : "Waiting for recovery session..."}
      </button>
      {message && <p className={`text-center ${message.startsWith("✅") ? "text-green-600" : "text-red-500"}`}>{message}</p>}
    </form>
  );
}
