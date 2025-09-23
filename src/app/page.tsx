"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/components/SupabaseProvider";
import { useRouter } from "next/navigation";

export default function Home() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
      }
    };

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/signin");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      {user && (
        <h1 className="text-xl font-bold">
          Hello, {user.user_metadata?.display_name || user.email} 👋
        </h1>
      )}

      <button
        onClick={handleSignOut}
        className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700"
      >
        Sign Out
      </button>
    </div>
  );
}
