"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSupabase } from "@/components/SupabaseProvider";
import { Database } from "@/types/supabase";

export const dynamic = "force-dynamic";

type EntryInsert = Database["public"]["Tables"]["entries"]["Insert"];

export default function SuccessPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // prevent SSR from touching this page

  return <SuccessPageClient />;
}

function SuccessPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { supabase } = useSupabase();
  const [status, setStatus] = useState("Submitting your entry...");

  useEffect(() => {
    const submitEntry = async () => {
      const entryJson = searchParams.get("entry");
      if (!entryJson) {
        setStatus("❌ No entry data provided");
        return;
      }

      try {
        const entryData: EntryInsert = JSON.parse(entryJson);
        const { error } = await supabase.from("entries").insert([entryData]);

        if (error) throw error;

        setStatus("✅ Payment successful! Entry submitted.");
        setTimeout(() => router.push("/my-entries"), 3000);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to submit entry";
        setStatus(`❌ ${message}`);
      }
    };

    submitEntry();
  }, [searchParams, supabase, router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "var(--color-green)",
        padding: "2rem",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "var(--radius-md)",
          maxWidth: "500px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            color: status.startsWith("✅") ? "var(--color-green)" : "var(--color-red)",
            marginBottom: "1rem",
          }}
        >
          {status}
        </h1>
        {status.startsWith("✅") && (
          <p style={{ color: "var(--color-black)" }}>
            Redirecting you to <strong>My Entries</strong> in 3 seconds…
          </p>
        )}
      </div>
    </div>
  );
}
