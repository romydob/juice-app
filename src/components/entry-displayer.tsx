"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/components/SupabaseProvider";
import Image from "next/image";
import { Database } from "@/types/supabase";

type Entry = Database["public"]["Tables"]["entries"]["Row"];

interface EntryDisplayProps {
  entry: Entry;
}

export default function EntryDisplay({ entry }: EntryDisplayProps) {
  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg mt-6">
      <h2 className="text-xl font-bold mb-2">{entry.drink_name}</h2>
      <p className="mb-2 text-gray-700">{entry.description}</p>
      <div className="mb-2">
        <span className="font-semibold">Ingredients:</span>{" "}
        {entry.ingredients}
      </div>
      {entry.dietary_tags && entry.dietary_tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {entry.dietary_tags.map((tag) => (
            <span
              key={tag}
              className="bg-primary/10 text-primary px-2 py-1 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {entry.image_url && (
        <div className="mt-4">
          <Image
            src={entry.image_url}
            alt={entry.drink_name}
            width={300}
            height={300}
            className="rounded"
          />
        </div>
      )}
      
    </div>
  );
}