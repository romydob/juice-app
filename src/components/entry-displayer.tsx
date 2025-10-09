"use client";

import { Database } from "@/types/supabase";
import Image from "next/image";

type Entry = Database["public"]["Tables"]["entries"]["Row"];

interface EntryDisplayProps {
  entry: Entry;
}

export default function EntryDisplay({ entry }: EntryDisplayProps) {
  const containerStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "400px",
    margin: "1rem auto",
    padding: "2rem",
    backgroundColor: "var(--color-yellow)",
    borderRadius: "var(--radius-md)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    textAlign: "center",
    color: "var(--color-white)",
  };

  const textStyle: React.CSSProperties = {
    marginBottom: "0.5rem",
    color: "var(--color-white)",
    textAlign: "center",
  };

  const tagStyle: React.CSSProperties = {
    backgroundColor: "var(--color-red)",
    color: "var(--color-white)",
    padding: "0.25rem 0.5rem",
    borderRadius: "var(--radius-sm)",
    fontSize: "0.75rem",
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>{entry.drink_name}</h2>
      <p style={textStyle}>{entry.description}</p>
      <div style={{ marginBottom: "0.5rem", textAlign: "center" }}>
        <span style={{ fontWeight: "bold" }}>Ingredients:</span> {entry.ingredients}
      </div>
      {entry.dietary_tags && entry.dietary_tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", marginBottom: "0.5rem" }}>
          {entry.dietary_tags.map((tag) => (
            <span key={tag} style={tagStyle}>
              {tag}
            </span>
          ))}
        </div>
      )}
      {entry.image_url && (
        <div style={{ marginTop: "1rem" }}>
          <Image
            src={entry.image_url}
            alt={entry.drink_name}
            width={300}
            height={300}
            style={{ borderRadius: "var(--radius-md)" }}
          />
        </div>
      )}
    </div>
  );
}
