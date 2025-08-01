"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Film, Star, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await getSupabaseClient().auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = getSupabaseClient().auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        router.push("/movies");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (user) {
    router.push("/movies");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800">
      <div className="text-center text-white">
        <div className="flex items-center justify-center mb-6">
          <Film className="h-16 w-16 mr-4" />
          <h1 className="text-6xl font-bold">JumboBoxd</h1>
        </div>
        <p className="text-xl mb-8">Track and rate your favorite movies</p>
        <Link href="/login">
          <Button
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100">
            Log in
          </Button>
        </Link>
      </div>
    </div>
  );
}
