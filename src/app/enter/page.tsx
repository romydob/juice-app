"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/components/SupabaseProvider";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import { Database } from "@/types/supabase";

type EntryInsert = Database["public"]["Tables"]["entries"]["Insert"];
type DietaryTag = Database["public"]["Enums"]["dietary_tags"];

export default function EntryForm() {
  const { supabase } = useSupabase();

  const [userId, setUserId] = useState<string | null>(null);
  const [userDisplayName, setUserDisplayName] = useState("");
  const [drinkName, setDrinkName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [dietaryTags, setDietaryTags] = useState<DietaryTag[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [contestId, setContestId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const dietaryOptions: DietaryTag[] = ["Vegan", "Dairy-Free", "Gluten-Free", "Nut-Free"];
  const imageOptions = { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true };

  // Fetch user session and active contest
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUserId(session.user.id);
          setUserDisplayName(session.user.user_metadata?.display_name || "");
        }

        const { data: contest, error } = await supabase
          .from("contests")
          .select("id")
          .eq("is_active", true)
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        if (contest) setContestId(contest.id);
        else setMessage("❌ No active competition.");
      } catch (err) {
        setMessage(err instanceof Error ? `❌ ${err.message}` : "❌ Unexpected error");
      }
    };

    fetchData();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !contestId) {
      setMessage("❌ User or contest not found.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      let imageUrl: string | null = null;

      if (imageFile) {
        const compressedFile = await imageCompression(imageFile, imageOptions);
        const fileExt = compressedFile.name.split(".").pop();
        const timestamp = Date.now();
        const fileName = `${userId}_${timestamp}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("entries-images")
          .upload(fileName, compressedFile);

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage
          .from("entries-images")
          .getPublicUrl(fileName);

        imageUrl = publicData.publicUrl;
      }

      // Build entry object using Supabase generated type
      const newEntry: EntryInsert = {
        user_id: userId,
        contest_id: contestId,
        drink_name: drinkName,
        description,
        ingredients,
        dietary_tags: dietaryTags,
        image_url: imageUrl,
      };

      const { error: insertError } = await supabase.from("entries").insert([newEntry]);
      if (insertError) throw insertError;

      setMessage("✅ Entry submitted successfully!");
      setDrinkName("");
      setDescription("");
      setIngredients("");
      setDietaryTags([]);
      setImageFile(null);
    } catch (err) {
      setMessage(err instanceof Error ? `❌ ${err.message}` : "❌ Unexpected error");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Submit Your Drink</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          type="text"
          placeholder="Drink Name"
          value={drinkName}
          onChange={(e) => setDrinkName(e.target.value)}
          className="border rounded p-2"
          required
        />

        <textarea
          placeholder="Short Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded p-2"
          required
        />

        <textarea
          placeholder="Ingredients / Flavours"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="border rounded p-2"
          required
        />

        <div className="flex flex-wrap gap-2">
          {dietaryOptions.map((tag) => (
            <label key={tag} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={dietaryTags.includes(tag)}
                onChange={(e) =>
                  e.target.checked
                    ? setDietaryTags([...dietaryTags, tag])
                    : setDietaryTags(dietaryTags.filter((t) => t !== tag))
                }
              />
              {tag}
            </label>
          ))}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white py-2 rounded hover:bg-primary/90 transition"
        >
          {loading ? "Submitting…" : "Submit Entry"}
        </button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}

      {imageFile && (
        <Image
          src={URL.createObjectURL(imageFile)}
          alt="Preview"
          width={300}
          height={300}
          className="mt-2 rounded"
        />
      )}
    </div>
  );
}
