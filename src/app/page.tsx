"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/components/SupabaseProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
        // router.push("/signin"); // redirect if not logged in
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
        <p className="font-body text-lg text-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground font-body">
      {/* Top right edit profile button */}
      <div className="flex justify-end p-4">
        <Link
          href="/edit-profile"
          className="rounded-lg bg-primary px-4 py-2 text-white shadow hover:bg-primary/90 transition"
        >
          Edit Profile
        </Link>
      </div>

      {/* Center content */}
      <div className="flex flex-1 flex-col items-center justify-center text-center px-4">
        <h1 className="font-display text-5xl font-bold leading-snug mb-8">
          100 enter <br />
          3 finalists <br />
          1 champion
        </h1>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/enter">
            <button className="btn btn-primary px-6 py-3 rounded-lg shadow-lg font-display text-lg transition hover:bg-primary/90">
              Enter
            </button>
          </Link>
          <Link href="/rules">
            <button className="btn btn-accent px-6 py-3 rounded-lg shadow-lg font-display text-lg transition hover:bg-accent/90">
              Rules
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
