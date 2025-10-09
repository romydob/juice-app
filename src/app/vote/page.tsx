"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/components/SupabaseProvider";
import EntryDisplay from "@/components/entry-displayer";
import { Database } from "@/types/supabase";

type Entry = Database["public"]["Tables"]["entries"]["Row"];
type Vote = { entry_id: string };

export default function AdminVotingPage() {
  const { supabase } = useSupabase();

  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setUserId(null);
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        setUserId(session.user.id);

        const res = await fetch("/api/check-admin", {
          headers: { "x-user-id": session.user.id },
        });
        const data = await res.json();
        setIsAdmin(data.ok);

        const { data: entriesData, error: entriesError } = await supabase
          .from("entries")
          .select("*");
        if (entriesError) throw entriesError;
        setEntries(entriesData || []);

        try {
          const resVotes = await fetch("/api/get-votes");
          const votesData: Vote[] = await resVotes.json();
          const counts: Record<string, number> = {};
          votesData.forEach((v) => (counts[v.entry_id] = (counts[v.entry_id] || 0) + 1));
          setVotes(counts);
        } catch (err) {
          console.warn("Failed to fetch votes:", err);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        console.error(msg);
        setErrorMessage(msg);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [supabase]);

  const handleVote = async (entryId: string) => {
    if (!userId) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin-vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entry_id: entryId, user_id: userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Vote failed");

      setVotes((prev) => ({
        ...prev,
        [entryId]: (prev[entryId] || 0) + 1,
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // --- Styles ---
  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    backgroundColor: "var(--color-green)",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem",
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "2rem",
    fontWeight: "bold",
    color: "var(--color-white)",
    marginBottom: "1rem",
    textAlign: "center",
    letterSpacing: "1.2rem",
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "2rem",
    width: "100%",
    maxWidth: "1000px",
  };

  const entryBoxStyle: React.CSSProperties = {
    backgroundColor: "var(--color-white)",
    borderRadius: "var(--radius-md)",
    padding: "1rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "0.75rem",
  };

  const voteButtonStyle: React.CSSProperties = {
    padding: "0.5rem 1rem",
    backgroundColor: "var(--color-red)",
    color: "var(--color-white)",
    border: "none",
    borderRadius: "var(--radius-md)",
    cursor: "pointer",
    fontFamily: "var(--font-body)",
    fontWeight: "bold",
    transition: "all 0.2s ease",
  };

  const votesTextStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontSize: "0.9rem",
    color: "var(--color-gray-dark)",
  };

  const errorTextStyle: React.CSSProperties = {
    color: "var(--color-red)",
    fontFamily: "var(--font-body)",
    textAlign: "center",
    marginBottom: "1rem",
  };

  if (loading) return <p style={{ color: "var(--color-white)" }}>Loading...</p>;
  if (!userId) return <p style={{ color: "var(--color-white)" }}>Please log in</p>;
  if (!isAdmin) return <p style={{ color: "var(--color-white)" }}>You are not an admin</p>;

  // Sort entries by votes descending, then alphabetically
  const sortedEntries = [...entries].sort((a, b) => {
    const votesA = votes[a.id] || 0;
    const votesB = votes[b.id] || 0;
    if (votesB !== votesA) return votesB - votesA;
    return a.drink_name.localeCompare(b.drink_name);
  });

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Admin Voting</h1>
      {errorMessage && <p style={errorTextStyle}>{errorMessage}</p>}

      {sortedEntries.length === 0 ? (
        <p style={{ color: "var(--color-white)", textAlign: "center" }}>No entries found.</p>
      ) : (
        <div style={gridStyle}>
          {sortedEntries.map((entry) => (
            <div key={entry.id} style={entryBoxStyle}>
              <EntryDisplay entry={entry} />
              <p style={votesTextStyle}>Votes: {votes[entry.id] || 0}</p>
              <button
                style={voteButtonStyle}
                onClick={() => handleVote(entry.id)}
                disabled={loading}
              >
                Vote
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
