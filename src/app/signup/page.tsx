"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/SupabaseProvider";

export default function SignupPage() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: "/auth/callback", data: { display_name: displayName } },
    });

    if (error) setMessage(`❌ ${error.message}`);
    else setMessage("✅ Check your email to confirm signup!");
  }

  async function handleResend() {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: "/auth/callback" },
    });

    if (error) setMessage(`❌ ${error.message}`);
    else setMessage("✅ Confirmation email resent!");
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "300px",
    padding: "0.75rem 1rem",
    marginBottom: "1rem",
    borderRadius: "var(--radius-md)",
    border: "2px solid var(--color-red)",
    fontSize: "1rem",
    fontFamily: "var(--font-body)",
  };

  const mainButtonStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "300px",
    padding: "0.75rem 1rem",
    borderRadius: "var(--radius-md)",
    fontFamily: "var(--font-body)",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    border: "none",
    backgroundColor: "var(--color-red)",
    color: "var(--color-white)",
    transition: "all 0.2s ease",
    marginBottom: "0.5rem",
  };

  const secondaryButtonStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "300px",
    padding: "0.75rem 1rem",
    borderRadius: "var(--radius-md)",
    border: "2px solid var(--color-red)",
    backgroundColor: "var(--color-white)",
    color: "var(--color-red)",
    fontFamily: "var(--font-body)",
    cursor: "pointer",
    marginBottom: "0.5rem",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "var(--color-green)",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "var(--color-yellow)",
          padding: "2rem",
          borderRadius: "var(--radius-md)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            marginBottom: "1rem",
            color: "var(--color-white)",
          }}
        >
          Sign Up
        </h1>

        <form onSubmit={handleSignup} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <input
            type="email"
            placeholder="Email"
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Display Name"
            style={inputStyle}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
          <button type="submit" style={mainButtonStyle}>
            Sign Up
          </button>
        </form>

        <button onClick={handleResend} style={secondaryButtonStyle}>
          Resend Confirmation Email
        </button>

        <button onClick={() => router.push("/signin")} style={secondaryButtonStyle}>
          Go to Sign In
        </button>

        {message && (
          <p
            style={{
              marginTop: "1rem",
              textAlign: "center",
              color: message.startsWith("✅") ? "var(--color-white)" : "var(--color-red)",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
