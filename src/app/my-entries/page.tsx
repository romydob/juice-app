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

  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    backgroundColor: "var(--color-green)",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "2rem",
    fontWeight: "bold",
    color: "var(--color-white)",
    marginBottom: "2rem",
    textAlign: "center",
  };

  const noEntriesStyle: React.CSSProperties = {
    color: "var(--color-white)",
    fontSize: "1rem",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>My Entries</h1>

      {entries.length === 0 ? (
        <p style={noEntriesStyle}>You haven&apos;t submitted any entries yet.</p>
      ) : (
        <div style={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {entries.map((entry) => (
            <EntryDisplay key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
