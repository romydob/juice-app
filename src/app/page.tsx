"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";
import EntryDisplay from "@/components/entry-displayer"; // adjust path if needed

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type EntryRow = Database["public"]["Tables"]["entries"]["Row"];

interface EntryWithVotes extends EntryRow {
  vote_count: number;
}

export default function HomePage() {
  const [greenHeight, setGreenHeight] = useState("65vh");
  const [buttonWidth, setButtonWidth] = useState("180px");
  const [topEntries, setTopEntries] = useState<EntryWithVotes[]>([]);
  const [loading, setLoading] = useState(true);

  // Responsive green section and buttons
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 480) {
        setGreenHeight("35vh");
        setButtonWidth("140px");
      } else {
        setGreenHeight("65vh");
        setButtonWidth("180px");
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch leaderboard top 3
  async function fetchLeaderboard() {
    try {
      setLoading(true);

      // Get active contest
      const { data: activeContest } = await supabase
        .from("contests")
        .select("id")
        .eq("is_active", true)
        .single();

      if (!activeContest) {
        setTopEntries([]);
        setLoading(false);
        return;
      }

      // Get entries for active contest
      const { data: entries } = await supabase
        .from("entries")
        .select("*")
        .eq("contest_id", activeContest.id);

      if (!entries) {
        setTopEntries([]);
        setLoading(false);
        return;
      }

      // Get all votes
      const { data: votes } = await supabase.from("votes").select("entry_id");

      const voteCounts: Record<string, number> = {};
      votes?.forEach((v) => {
        voteCounts[v.entry_id] = (voteCounts[v.entry_id] || 0) + 1;
      });

      // Combine votes with entries
      const withVotes: EntryWithVotes[] = entries.map((entry) => ({
        ...entry,
        vote_count: voteCounts[entry.id] || 0,
      }));

      const sorted = withVotes.sort((a, b) => b.vote_count - a.vote_count).slice(0, 3);
      setTopEntries(sorted);
    } catch (err) {
      console.error("Leaderboard fetch failed:", err);
      setTopEntries([]);
    } finally {
      setLoading(false);
    }
  }

  // Initial fetch + realtime updates
  useEffect(() => {
    fetchLeaderboard();

    const channel = supabase
      .channel("votes-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "votes" },
        () => fetchLeaderboard()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Button styling
  const buttonStyleBase = {
    width: buttonWidth,
    padding: "0.75rem 2rem",
    borderRadius: "var(--radius-md)",
    fontFamily: "var(--font-body)",
    fontSize: "clamp(0.875rem, 1.5vw, 1.125rem)",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Green Section */}
      <div
        style={{
          backgroundColor: "var(--color-green)",
          color: "var(--color-background)",
          fontFamily: "var(--font-body)",
          minHeight: greenHeight,
          padding: "5rem 1rem",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 8vw, 5rem)",
            lineHeight: "1.2",
            marginBottom: "2rem",
            letterSpacing: "0.5rem",
          }}
        >
          100 Enter <br />
          3 Finalists <br />
          1 Champion
        </h1>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/enter">
            <button
              style={{
                ...buttonStyleBase,
                backgroundColor: "var(--color-red)",
                color: "white",
                border: "3px solid white",
              }}
            >
              enter - ($20)
            </button>
          </Link>
          <Link href="/rules">
            <button
              style={{
                ...buttonStyleBase,
                backgroundColor: "white",
                color: "var(--color-red)",
                border: "3px solid var(--color-red)",
              }}
            >
              rules - t/c&apos;s
            </button>
          </Link>
        </div>
      </div>

      {/* Red Diagonal Divider */}
      <div
        style={{
          position: "relative",
          backgroundColor: "var(--color-red)",
          height: "150px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "120%",
            height: "150px",
            backgroundColor: "white",
            border: "10px solid var(--color-red)",
            transform: "rotate(-7deg)",
          }}
        />
        <span
          style={{
            position: "absolute",
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 8vw, 5rem)",
            color: "var(--color-green)",
            transform: "rotate(-7deg)",
            whiteSpace: "nowrap",
          }}
        >
          Leaderboard
        </span>
      </div>

      {/* Yellow Section with White Leaderboard Box */}
      <div
        style={{
          backgroundColor: "var(--color-yellow)",
          padding: "5rem 1rem",
          fontFamily: "var(--font-body)",
          color: "var(--color-black)",
          minHeight: "65vh",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* White container inside yellow section */}
        <div
          style={{
            width: "100%",
            maxWidth: "1000px",
            textAlign: "center",
            backgroundColor: "white",
            borderRadius: "var(--radius-lg)",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", marginBottom: "1rem" }}>
            🏆 Top 3 Drinks
          </h2>

          {loading ? (
            <p>Loading leaderboard...</p>
          ) : topEntries.length === 0 ? (
            <p>No votes yet! Be the first to vote 🍸</p>
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
                    width: "250px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "var(--color-green)",
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

    </div>
  );
}
