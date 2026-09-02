"use client";

import { createClient } from "@/lib/supabase/client";
import { BarChart3, Sparkles } from "lucide-react";
import Image from "next/image";
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-100/50 blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl shadow-gray-200/50 sm:p-10">
          
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Image
                       src="/icon.png"
                       alt="Logo"
                       width={60}
                       height={60}
                     />
          </div>

          {/* Heading */}
          <div className="text-center">
            <div className="mb-3 flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">
                AI-Powered Business Intelligence
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Welcome to{" "}
              <span className="text-blue-600">
                Biai
              </span>
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Turn your business data into clear insights, explanations,
              and actionable decisions.
            </p>
          </div>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Sign in
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            className="group flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md active:scale-[0.99]"
          >
            {/* Google Icon */}
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M21.35 12.23c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.26Z"
              />
              <path
                fill="#34A853"
                d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.5Z"
              />
              <path
                fill="#FBBC05"
                d="M6.54 13.58A5.86 5.86 0 0 1 6.23 12c0-.55.1-1.08.31-1.58V7.89H3.3A9.5 9.5 0 0 0 2.25 12c0 1.53.37 2.98 1.05 4.11l3.24-2.53Z"
              />
              <path
                fill="#EA4335"
                d="M12 6.39c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.49 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.39l3.24 2.53C7.31 8.11 9.46 6.39 12 6.39Z"
              />
            </svg>

            <span>Continue with Google</span>
          </button>

          {/* Footer */}
          <p className="mt-6 text-center text-xs leading-5 text-gray-400">
            By continuing, you agree to our terms and acknowledge our
            privacy policy.
          </p>
        </div>

        {/* Bottom text */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Analyze. Understand. Act.
        </p>
      </div>
    </main>
  );
}