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

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`❌ ${error.message}`);
    } else if (data.session) {
      setMessage("✅ Logged in successfully!");
      setStep("loggedIn");
    } else {
      setMessage("❌ Login succeeded but session missing.");
    }

    setLoading(false);
  };

  // --- OTP login ---
  const handleSendOtp = async () => {
    if (!email) return setMessage("❌ Enter your email first.");
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });

    if (error) setMessage(`❌ ${error.message}`);
    else setStep("enterOTP");

    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!otp) return setMessage("❌ Enter the OTP.");
    setLoading(true);
    setMessage(null);

    const { data: { session }, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error) setMessage(`❌ ${error.message}`);
    else if (session) setStep("loggedIn");

    setLoading(false);
  };

  // --- Optional password change ---
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">Sign In</h1>

        {step === "chooseLogin" && (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded p-2"
            />
            <button
              onClick={handlePasswordLogin}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {loading ? "Signing in…" : "Sign in with Password"}
            </button>
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mt-2"
            >
              {loading ? "Sending OTP…" : "Sign in with OTP"}
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 mt-2"
            >
              Sign up
            </button>
          </>
        )}

        {step === "enterOTP" && (
          <>
            <p className="text-sm text-center text-gray-600">Enter the OTP sent to {email}</p>
            <input
              type="text"
              placeholder="OTP code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded p-2"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              {loading ? "Verifying…" : "Verify OTP"}
            </button>
          </>
        )}

        {step === "loggedIn" && (
          <>
            <p className="text-sm text-center text-gray-600">You are logged in! You can change your password if desired:</p>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded p-2"
            />
            <button
              onClick={handleChangePassword}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
            >
              {loading ? "Updating…" : "Update Password"}
            </button>
          </>
        )}

        {message && (
          <p
            className={`text-center ${message.startsWith("✅") ? "text-green-600" : "text-red-500"}`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
