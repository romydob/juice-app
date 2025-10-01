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
    if (displayName !== user.user_metadata?.display_name) {
      updates.data = { display_name: displayName };
    }
    if (password) updates.password = password;

    if (Object.keys(updates).length === 0) {
      setMessage("⚠️ No changes to update.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser(updates);

    if (error) {
      setMessage(`❌ ${error.message}`);
    } else {
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
      <div className="flex h-screen items-center justify-center">
        <p>Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        {/* Logout button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-4 text-center">Edit Profile</h1>

        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="w-full border rounded p-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {loading ? "Updating…" : "Update Profile"}
          </button>
        </form>

        {message && <p className="mt-4 text-center text-sm font-medium">{message}</p>}
      </div>
    </div>
  );
}
