"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/components/SupabaseProvider";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import { Database } from "@/types/supabase";
import { useRouter } from "next/navigation";

type EntryInsert = Database["public"]["Tables"]["entries"]["Insert"];
type DietaryTag = Database["public"]["Enums"]["dietary_tags"];

export default function EntryForm() {
  const { supabase } = useSupabase();
  const router = useRouter();

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

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) router.replace("/signin");
      else {
        setUserId(session.user.id);
        setUserDisplayName(session.user.user_metadata?.display_name || "");
      }

      const { data: contest, error } = await supabase
        .from("contests")
        .select("id")
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();
      if (error) setMessage(`❌ ${error.message}`);
      else if (contest) setContestId(contest.id);
      else setMessage("❌ No active competition.");
    };

    checkSession();
  }, [supabase, router]);

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

      const entryData: EntryInsert = {
        user_id: userId,
        contest_id: contestId,
        drink_name: drinkName,
        description,
        ingredients,
        dietary_tags: dietaryTags,
        image_url: imageUrl,
      };

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entryData,
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/cancel`,
        }),
      });

      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error || "Failed to start payment session");
    } catch (err) {
      setMessage(err instanceof Error ? `❌ ${err.message}` : "❌ Unexpected error");
      setLoading(false);
    }
  };

  

  const inputStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "300px",
    padding: "0.75rem 1rem",
    marginBottom: "1rem",
    borderRadius: "var(--radius-md)",
    border: "2px solid var(--color-red)",
    fontSize: "1rem",
    fontFamily: "var(--font-body)",
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "300px",
    padding: "0.75rem 1rem",
    borderRadius: "var(--radius-md)",
    fontFamily: "var(--font-body)",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: loading ? "not-allowed" : "pointer",
    border: "none",
    backgroundColor: "var(--color-red)",
    color: "var(--color-white)",
    transition: "all 0.2s ease",
    marginBottom: "0.5rem",
  };

  const checkboxLabelStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  };

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
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "var(--color-yellow)",
          padding: "2rem",
          borderRadius: "var(--radius-md)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            marginBottom: "1rem",
            textAlign: "center",
            color: "var(--color-white)",
          }}
        >
          Submit Your Drink
        </h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <input type="text" placeholder="Drink Name" value={drinkName} onChange={(e) => setDrinkName(e.target.value)} style={inputStyle} required />
          <textarea placeholder="Short Description" value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} required />
          <textarea placeholder="Ingredients / Flavours" value={ingredients} onChange={(e) => setIngredients(e.target.value)} style={inputStyle} required />

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
            {dietaryOptions.map((tag) => (
              <label key={tag} style={checkboxLabelStyle}>
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

          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} style={{ marginBottom: "1rem" }} />

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Submitting…" : "Submit Entry"}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "1rem", textAlign: "center", color: message.startsWith("✅") ? "var(--color-white)" : "var(--color-red)" }}>
            {message}
          </p>
        )}

        {imageFile && (
          <Image
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            width={300}
            height={300}
            style={{ marginTop: "1rem", borderRadius: "var(--radius-md)" }}
          />
        )}
      </div>
    </div>
  );
}
