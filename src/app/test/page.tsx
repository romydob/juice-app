"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/components/SupabaseProvider";

export default function WelcomePage() {
  const { supabase } = useSupabase();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error.message);
        setLoading(false);
        return;
      }

      if (session?.user) {
        setUserName(session.user.user_metadata?.display_name || session.user.email);
      }

      setLoading(false);
    };

    fetchUser();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold">
        {userName ? `Welcome, ${userName}!` : "Welcome!"}
      </h1>
    </div>
  );
}
