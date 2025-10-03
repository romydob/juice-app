"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/components/SupabaseProvider";
import { useRouter } from "next/navigation";
import EntryDisplay from "@/components/entry-displayer";
import { Database } from "@/types/supabase";

type Entry = Database["public"]["Tables"]["entries"]["Row"];

export default function MyEntries() {
  const { supabase } = useSupabase();
  const [userId, setUserId] = useState<string | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const router = useRouter();

  useEffect(() => {
    const checkSessionAndFetch = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/signin");
        return;
      }

      setUserId(session.user.id);

      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .eq("user_id", session.user.id);

      if (error) {
        console.error("Error fetching user entries:", error.message);
      } else {
        setEntries(data || []);
      }
    };

    checkSessionAndFetch();
  }, [supabase, router]);

  if (!userId) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Entries</h1>

      {entries.length === 0 ? (
        <p className="text-gray-500">
          You haven&apos;t submitted any entries yet.
        </p>
      ) : (
        <div className="space-y-6">
          {entries.map((entry) => (
            <EntryDisplay key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
