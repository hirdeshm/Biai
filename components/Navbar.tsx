"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
type User = {
  name: string;
  avatar: string;
};
const supabase = createClient();
export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser({
          name:
            user.user_metadata.full_name ||
            user.user_metadata.name ||
            "User",
          avatar: user.user_metadata.avatar_url || "",
        });
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          name:
            session.user.user_metadata.full_name ||
            session.user.user_metadata.name ||
            "User",
          avatar: session.user.user_metadata.avatar_url || "",
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/icon.png"
            alt="Logo"
            width={40}
            height={40}
          />

          <span className="text-2xl font-bold text-black">
            Biai
          </span>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/">Home</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/projects/new">New Project</Link>
          <Link href="/about">About</Link>
         
          <a href="#footer">Contact</a>
        </div>

        {/* User / Login */}
        {user ? (
          <div className="flex items-center gap-3">
            {user.avatar && (
              <Image
                src={user.avatar}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}

            <span className="font-medium text-black">
              {user.name}
            </span>

            <button
              onClick={async () => {
                await supabase.auth.signOut();
                setUser(null);
              }}
              className="rounded-lg bg-black px-4 py-2 text-sm text-white"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-lg bg-black px-5 py-2 text-white"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}