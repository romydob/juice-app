"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/components/SupabaseProvider";

export default function EditUserPage() {
  const { supabase } = useSupabase();
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        setMessage(`❌ ${error.message}`);
        return;
      }
      if (session) {
        setUser(session.user);
        setDisplayName(session.user.user_metadata?.display_name || "");
      }
    };

    fetchUser();
  }, [supabase]);

  // Update user info
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setMessage("❌ You must be logged in.");
      return;
    }

    const updates: any = { data: { display_name: displayName } };
    if (password) updates.password = password;

    const { error } = await supabase.auth.updateUser(updates);

    if (error) setMessage(`❌ ${error.message}`);
    else setMessage("✅ Profile updated successfully!");
    setPassword(""); // clear password field after update
  };

  if (!user) return <p>Loading user info…</p>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
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
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Update Profile
          </button>
        </form>

        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}
