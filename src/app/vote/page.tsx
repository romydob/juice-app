"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/components/SupabaseProvider";
import { useUser } from "@supabase/auth-helpers-react";
import EntryDisplay from "@/components/entry-displayer";
import { Database } from "@/types/supabase";

type Entry = Database["public"]["Tables"]["entries"]["Row"];

const ADMIN_ID = "2c634a8f-2d0e-4cde-bc91-6a31e55cd734";

export default function AdminVotingPage() {
  const { supabase } = useSupabase();
  const user = useUser();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Use a flag to know if user is authorized
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  // Check authorization once
  useEffect(() => {
    if (!user) {
      setAuthorized(false);
    } else {
      setAuthorized(user.id === ADMIN_ID);
    }
  }, [user]);

  // Fetch entries and votes for active contest
  useEffect(() => {
    if (authorized === false) return;

    const fetchData = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        // Get active contest
        const { data: activeContest, error: contestError } = await supabase
          .from("contests")
          .select("*")
          .eq("is_active", true)
          .limit(1)
          .single();

        if (contestError) throw contestError;
        if (!activeContest) throw new Error("No active contest found.");

        // Get entries for this contest
        const { data: entriesData, error: entriesError } = await supabase
          .from("entries")
          .select("*")
          .eq("contest_id", activeContest.id)
          .order("drink_name", { ascending: true });

        if (entriesError) throw entriesError;
        setEntries(entriesData || []);

        // Get votes
        const { data: votesData, error: votesError } = await supabase
          .from("votes")
          .select("entry_id");

        if (votesError) throw votesError;

        // Count votes per entry
        const counts: Record<string, number> = {};
        (votesData || []).forEach((v: { entry_id: string }) => {
          counts[v.entry_id] = (counts[v.entry_id] || 0) + 1;
        });
        setVotes(counts);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "An unknown error occurred";
        console.error(error);
        setErrorMessage(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, authorized]);

  const handleVote = async (entryId: string) => {
    try {
      const { error } = await supabase.from("votes").insert({ entry_id: entryId });
      if (error) throw error;

      // Update vote count locally
      setVotes((prev) => ({
        ...prev,
        [entryId]: (prev[entryId] || 0) + 1,
      }));
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Vote failed for unknown reason";
      console.error("Vote failed:", error);
      setErrorMessage(message);
    }
  };

  // Render messages for unauthorized or loading
  if (authorized === false) return <p>You are not authorized to vote</p>;
  if (!user) return <p>Please log in</p>;
  if (loading) return <p>Loading entries...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Voting</h1>
      {errorMessage && <p className="text-red-500 mb-4">Error: {errorMessage}</p>}
      {entries.length === 0 ? (
        <p>No entries found for the current competition.</p>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between">
              <div>
                <EntryDisplay entry={entry} />
                <p className="text-gray-500">Votes: {votes[entry.id] || 0}</p>
              </div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => handleVote(entry.id)}
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
