"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/components/SupabaseProvider";
import { useRouter } from "next/navigation";

export default function MyEntries() {
    const { supabase } = useSupabase();
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                router.replace("/signin");
            } else {
                setUserId(session.user.id);
            }
        };
        checkSession();
    }, [supabase, router]);

    if (!userId) return null;

    return <div>my entries</div>;
}