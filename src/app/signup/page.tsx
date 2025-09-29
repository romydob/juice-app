"use client";

import { useState } from "react";
import { useSupabase } from "@/components/SupabaseProvider";

export default function SignupPage() {
  const { supabase } = useSupabase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [displayName, setDisplayName] = useState("");


  async function handleSignup(e: React.FormEvent) {
  e.preventDefault();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "http://localhost:3000/auth/callback",
      data: { display_name: displayName }, // <-- store in user_metadata
    },
  });

  if (error) {
    setMessage(`❌ ${error.message}`);
    return;
  }

  setMessage("✅ Check your email to confirm signup!");
}


  // Resend confirmation email
  async function handleResend() {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "http://localhost:3000/auth/callback",
      },
    });

    if (error) setMessage(`❌ ${error.message}`);
    else setMessage("✅ Confirmation email resent!");
  }

  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sign up</h1>
      <form onSubmit={handleSignup} className="flex flex-col gap-2 max-w-sm">
        <input
          type="email"
          placeholder="Email"
          className="border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Display Name"
          className="border p-2"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white p-2">
          Sign Up
        </button>
      </form>

      {/* Resend button */}
      <button onClick={handleResend} className="mt-2 bg-gray-200 p-2">
        Resend Confirmation Email
      </button>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
