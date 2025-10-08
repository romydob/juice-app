"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/components/SupabaseProvider";
import { useUser } from "@supabase/auth-helpers-react";
import EntryDisplay from "@/components/entry-displayer";

const ADMIN_ID = "2c634a8f-2d0e-4cde-bc91-6a31e55cd734";

export default function AdminVotingPage() {
  const user = useUser();
  const { supabase } = useSupabase();

  const [activeContest, setActiveContest] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        // Ensure session exists
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session?.user) {
          setErrorMessage("Please log in");
          setLoading(false);
          return;
        }

        if (session.user.id !== ADMIN_ID) {
          setErrorMessage("You are not authorized to vote");
          setLoading(false);
          return;
        }

        // Fetch active contest
        const { data: contestsData, error: contestError } = await supabase
          .from("contests")
          .select("*")
          .eq("is_active", true)
          .limit(1)
          .single();
        
        if (contestError) throw contestError;
        setActiveContest(contestsData);

        if (!contestsData) {
          setEntries([]);
          setLoading(false);
          return;
        }

        // Fetch entries for active contest
        const { data: entriesData, error: entriesError } = await supabase
          .from("entries")
          .select("*")
          .eq("contest_id", contestsData.id)
          .order("drink_name", { ascending: true });

        if (entriesError) throw entriesError;
        setEntries(entriesData || []);

        // Fetch votes for these entries
        const { data: votesData, error: votesError } = await supabase
          .from("votes")
          .select("entry_id");

        if (votesError) throw votesError;

        const counts: Record<string, number> = {};
        (votesData || []).forEach((v: any) => {
          counts[v.entry_id] = (counts[v.entry_id] || 0) + 1;
        });
        setVotes(counts);

      } catch (err: any) {
        console.error(err);
        setErrorMessage(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  const handleVote = async (entryId: string) => {
    try {
      const { error } = await supabase.from("votes").insert({ entry_id: entryId });
      if (error) throw error;

      // Optimistic update
      setVotes((prev) => ({
        ...prev,
        [entryId]: (prev[entryId] || 0) + 1,
      }));
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to record vote");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (errorMessage) return <p className="text-red-600">{errorMessage}</p>;

  if (!activeContest) return <p>No active contest found</p>;
  if (entries.length === 0) return <p>No entries found for the current competition.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Voting</h1>
      <h2 className="mb-4">Active Contest: {activeContest.name}</h2>

      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="flex items-center justify-between border p-2 rounded">
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
    </div>
  );
}
