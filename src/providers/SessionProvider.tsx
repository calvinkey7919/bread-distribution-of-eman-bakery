"use client";

import { useEffect, ReactNode } from "react";
import { useAuthStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { Toaster } from "sonner";

export function SessionProvider({ children }: { children: ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (data) {
            setUser(data);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (data) {
            setUser(data);
          }
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [setUser, setLoading]);

  return (
    <>
      {children}
      <Toaster position="top-center" />
    </>
  );
}
