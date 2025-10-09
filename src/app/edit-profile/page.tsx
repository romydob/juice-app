"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/SupabaseProvider";
import { User } from "@supabase/supabase-js";

interface UserProfile extends User {
  user_metadata: {
    display_name?: string;
    [key: string]: unknown;
  };
}

export default function EditProfilePage() {
  const { supabase } = useSupabase();
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        setMessage(`❌ ${error.message}`);
        setLoading(false);
        return;
      }
      if (!session?.user) {
        router.push("/signin");
        return;
      }
      setUser(session.user as UserProfile);
      setDisplayName(session.user.user_metadata?.display_name || "");
      setLoading(false);
    };
    fetchUser();
  }, [supabase, router]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setMessage("");
    setLoading(true);

    const updates: { data?: { display_name?: string }; password?: string } = {};
    if (displayName !== user.user_metadata?.display_name) updates.data = { display_name: displayName };
    if (password) updates.password = password;

    if (Object.keys(updates).length === 0) {
      setMessage("⚠️ No changes to update.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser(updates);
    if (error) setMessage(`❌ ${error.message}`);
    else {
      setMessage("✅ Profile updated successfully!");
      setPassword("");
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setMessage(`❌ ${error.message}`);
      return;
    }
    router.push("/signin");
  };

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", justifyContent: "center", alignItems: "center" }}>
        <p>Loading profile…</p>
      </div>
    );
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
        

        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "1rem", color: "var(--color-white)", textAlign: "center" }}>
          Edit Profile
        </h1>

        <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <input type="text" placeholder="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} style={inputStyle} />
          <input
            type="password"
            placeholder="New password (blank to keep current)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" disabled={loading} style={mainButtonStyle}>
            {loading ? "Updating…" : "Update Profile"}
          </button>
          <button onClick={handleLogout} style={mainButtonStyle}>
            Logout
          </button>
        </form>

        {message && <p style={{ marginTop: "1rem", textAlign: "center", color: message.startsWith("✅") ? "var(--color-white)" : "var(--color-red)" }}>{message}</p>}
      </div>
    </div>
  );
}
