"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";
import EntryDisplay from "@/components/entry-displayer"; // adjust path if needed

// Lazy-loaded Supabase client
export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are not set!");
  }

  return createClient<Database>(url, key);
}

type EntryRow = Database["public"]["Tables"]["entries"]["Row"];

interface EntryWithVotes extends EntryRow {
  vote_count: number;
}

interface Contest {
  id: string;
  name: string;
}

export default function HallOfFame() {
  const [competitions, setCompetitions] = useState<Contest[]>([]);
  const [selectedContest, setSelectedContest] = useState<string>("");
  const [topEntries, setTopEntries] = useState<EntryWithVotes[]>([]);
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  // Track window width for responsiveness
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch finished competitions
  useEffect(() => {
    async function fetchCompetitions() {
      const supabase = getSupabaseClient(); // <- runtime only
      const { data } = await supabase
        .from("contests")
        .select("id,name")
        .eq("is_active", false)
        .order("end_date", { ascending: false });

      if (data) setCompetitions(data);
    }
    fetchCompetitions();
  }, []);

  // Fetch top 3 entries for selected competition
  useEffect(() => {
    if (!selectedContest) {
      setTopEntries([]);
      return;
    }

    async function fetchTopEntries() {
      setLoading(true);
      const supabase = getSupabaseClient(); // <- runtime only
      try {
        const { data: entries } = await supabase
          .from("entries")
          .select("*")
          .eq("contest_id", selectedContest);

        if (!entries) {
          setTopEntries([]);
          return;
        }

        const { data: votes } = await supabase.from("votes").select("entry_id");

        const voteCounts: Record<string, number> = {};
        votes?.forEach((v) => {
          voteCounts[v.entry_id] = (voteCounts[v.entry_id] || 0) + 1;
        });

        const withVotes: EntryWithVotes[] = entries.map((entry) => ({
          ...entry,
          vote_count: voteCounts[entry.id] || 0,
        }));

        const sorted = withVotes
          .sort((a, b) => b.vote_count - a.vote_count)
          .slice(0, 3);

        setTopEntries(sorted);
      } catch (err) {
        console.error("Failed to fetch top entries:", err);
        setTopEntries([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTopEntries();
  }, [selectedContest]);

  // Responsive box width
  const boxWidth = windowWidth < 480 ? "100%" : "1000px";

  return (
    <div style={{ width: "100%", padding: "2rem 1rem", fontFamily: "var(--font-body)" }}>
      <h1 style={{ fontSize: "2rem", textAlign: "center", marginBottom: "2rem" }}>
        🏆 Hall of Fame
      </h1>

      {/* Competition selector */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <label htmlFor="contest-select" style={{ marginRight: "1rem", fontWeight: "bold" }}>
          Select a finished competition:
        </label>
        <select
          id="contest-select"
          value={selectedContest}
          onChange={(e) => setSelectedContest(e.target.value)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "var(--radius-md)",
            fontSize: "1rem",
          }}
        >
          <option value="">-- Choose a competition --</option>
          {competitions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Top 3 entries */}
      {selectedContest && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "var(--color-green)",
            padding: "3rem 1rem",
          }}
        >
          <div
            style={{
              width: boxWidth,
              backgroundColor: "white",
              borderRadius: "var(--radius-lg)",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              alignItems: "center",
            }}
          >
            <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>Top 3 Entries</h2>

            {loading ? (
              <p>Loading...</p>
            ) : topEntries.length === 0 ? (
              <p>No votes recorded for this competition.</p>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  flexWrap: "wrap",
                  gap: "1.5rem",
                }}
              >
                {topEntries.map((entry, index) => (
                  <div
                    key={entry.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.5rem",
                      width: windowWidth < 480 ? "100%" : "250px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        color: "var(--color-red)",
                      }}
                    >
                      #{index + 1} – {entry.vote_count} votes
                    </div>
                    <EntryDisplay entry={entry} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
