"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/components/SupabaseProvider";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { supabase } = useSupabase();
  const router = useRouter();

  const [user, setUser] = useState<{ display_name?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error(error.message);
        setLoading(false);
        return;
      }

      if (!session?.user) {
        router.push("/signin"); // redirect if not logged in
        return;
      }

      setUser(session.user.user_metadata);
      setLoading(false);
    };

    fetchUser();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold">
        Welcome {user?.display_name || "User"}!
      </h1>
    </div>
  );
}
