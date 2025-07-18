"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, User, LogOut, Film, List, Home } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function Navigation() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="border-b bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="flex items-center space-x-2">
            <Film className="h-6 w-6 text-purple-400" />
            <span className="font-bold text-xl text-purple-400">JumboBoxd</span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/movies"
                className="flex items-center space-x-1 text-gray-300 hover:text-purple-400 transition-colors">
                <Home className="h-4 w-4" />
                <span>Browse</span>
              </Link>
              <Link
                href="/watchlist"
                className="flex items-center space-x-1 text-gray-300 hover:text-purple-400 transition-colors">
                <List className="h-4 w-4" />
                <span>My Movies</span>
              </Link>
              <Link
                href="/find"
                className="flex items-center space-x-1 text-gray-300 hover:text-purple-400 transition-colors">
                <Search className="h-4 w-4" />
                <span>Find Movies</span>
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <form
              onSubmit={handleSearch}
              className="hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-400"
                />
              </div>
            </form>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full hover:bg-gray-800">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.user_metadata?.avatar_url || "/placeholder.svg"}
                    />
                    <AvatarFallback className="bg-purple-600 text-white">
                      {user.user_metadata?.full_name?.[0] ||
                        user.email?.[0] ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-gray-900 border-gray-700"
                align="end">
                <DropdownMenuItem
                  asChild
                  className="text-gray-300 hover:text-white hover:bg-gray-800">
                  <Link
                    href="/profile"
                    className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="text-gray-300 hover:text-white hover:bg-gray-800">
                  <Link
                    href="/friends"
                    className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Friends
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-gray-300 hover:text-white hover:bg-gray-800">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
