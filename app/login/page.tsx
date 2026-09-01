"use client";

import { createClient } from "@/lib/supabase/client";

export default function Login() {
  const handleGoogleLogin = async () => {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error(error.message);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <button
        onClick={handleGoogleLogin}
        className="rounded-lg bg-black px-6 py-3 text-white"
      >
        Continue with Google
      </button>
    </main>
  );
}