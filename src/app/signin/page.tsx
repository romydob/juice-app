"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/SupabaseProvider";

export default function SignInPage() {
  const { supabase } = useSupabase();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"chooseLogin" | "enterOTP" | "loggedIn">("chooseLogin");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- Traditional login ---
  const handlePasswordLogin = async () => {
    setLoading(true);
    setMessage(null);
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(`❌ ${error.message}`);
    else if (data.session) {
      setMessage("✅ Logged in successfully!");
      setStep("loggedIn");
    }
    else setMessage("❌ Login succeeded but session missing.");
    setLoading(false);
  };

  // --- OTP login ---
  const handleSendOtp = async () => {
    if (!email) return setMessage("❌ Enter your email first.");
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
    if (error) setMessage(`❌ ${error.message}`);
    else setStep("enterOTP");
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!otp) return setMessage("❌ Enter the OTP.");
    setLoading(true);
    setMessage(null);
    const { data: { session }, error } = await supabase.auth.verifyOtp({ email, token: otp, type: "email" });
    if (error) setMessage(`❌ ${error.message}`);
    else if (session) setStep("loggedIn");
    setLoading(false);
  };

  const handleChangePassword = async () => {
    if (!password) return setMessage("❌ Enter a new password.");
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setMessage(`❌ ${error.message}`);
    else {
      setMessage("✅ Password updated! Redirecting...");
      setTimeout(() => router.push("/"), 2000);
    }
    setLoading(false);
  };

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
          Sign In
        </h1>

        {step === "chooseLogin" && (
          <>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
            <button onClick={handlePasswordLogin} disabled={loading} style={mainButtonStyle}>
              {loading ? "Signing in…" : "Sign in with Password"}
            </button>
            <button onClick={handleSendOtp} disabled={loading} style={mainButtonStyle}>
              {loading ? "Sending OTP…" : "Sign in with OTP"}
            </button>
            <button onClick={() => router.push("/signup")} style={secondaryButtonStyle}>
              Go to Sign Up
            </button>
          </>
        )}

        {step === "enterOTP" && (
          <>
            <p style={{ textAlign: "center", color: "var(--color-red)", marginBottom: "0.5rem" }}>
              Enter the OTP sent to {email}
            </p>
            <input type="text" placeholder="OTP code" value={otp} onChange={(e) => setOtp(e.target.value)} style={inputStyle} />
            <button onClick={handleVerifyOtp} disabled={loading} style={mainButtonStyle}>
              {loading ? "Verifying…" : "Verify OTP"}
            </button>
          </>
        )}

        {step === "loggedIn" && (
          <>
            <p style={{ textAlign: "center", color: "var(--color-red)", marginBottom: "0.5rem" }}>
              You are logged in! You can change your password if desired:
            </p>
            <input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
            <button onClick={handleChangePassword} disabled={loading} style={mainButtonStyle}>
              {loading ? "Updating…" : "Update Password"}
            </button>
          </>
        )}

        {message && (
          <p style={{ marginTop: "1rem", textAlign: "center", color: message.startsWith("✅") ? "var(--color-white)" : "var(--color-red)" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
