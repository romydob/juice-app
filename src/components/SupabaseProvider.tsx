"use client";

import { createContext, useContext, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

type SupabaseContextType = {
  supabase: ReturnType<typeof createClient>;
  session: Session | null;
};

const Context = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) => {
  const [supabase] = useState(() => createClient());

  return (
    <Context.Provider value={{ supabase, session }}>
      {children}
    </Context.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(Context);
  if (!context) throw new Error("useSupabase must be used inside SupabaseProvider");
  return context;
};
export default SupabaseProvider;
