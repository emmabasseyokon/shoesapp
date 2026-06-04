"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user?.app_metadata?.role !== "admin") {
      await supabase.auth.signOut();
      setError("Access denied. Admin credentials required.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-[#f8f9fa]">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <span className="w-[56px] h-[56px] border border-[#cfcfcf] rounded-[6px] overflow-hidden bg-white p-[4px] mb-4">
            <svg viewBox="0 0 40 40" width="48" height="48" className="block w-full h-full rounded-[4px]">
              <rect width="40" height="40" rx="4" fill="#1b1b1b" />
              <path d="M8 25c2-1 4-1 6 0 3 1.4 6 1.4 9 0 2-1 4-1 7 0l2 .8V29H8z" fill="#cdb79a" />
              <circle cx="15" cy="14" r="4.4" fill="#cdb79a" />
              <path d="M11 26c1.5-3 3-5 6-5s5 1.5 6 4" stroke="#1b1b1b" strokeWidth="1.4" fill="none" />
            </svg>
          </span>
          <h1 className="text-[26px] font-extrabold tracking-[0.3px] text-ink m-0">
            GEEMANFOOTWEARS
          </h1>
          <p className="text-muted text-[15px] mt-1 m-0">Admin sign in</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white border border-line rounded-[12px] p-7 flex flex-col gap-4 shadow-[0_2px_12px_rgba(0,0,0,.06)]"
        >
          {error && (
            <div className="rounded-[7px] bg-[#fff3f4] border border-[#f5c6cb] p-3 text-[14px] text-danger">
              {error}
            </div>
          )}

          <label className="flex flex-col gap-[6px] text-[15px] font-semibold">
            <span>Email</span>
            <input
              type="email"
              required
              placeholder="admin@geemanfootwears.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="font-[inherit] text-[16px] font-normal px-[13px] py-[11px] border border-[#ced4da] rounded-[7px] w-full outline-none focus:border-accent focus:shadow-[0_0_0_3px_color-mix(in_srgb,#198754_22%,transparent)]"
            />
          </label>

          <label className="flex flex-col gap-[6px] text-[15px] font-semibold">
            <span>Password</span>
            <input
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="font-[inherit] text-[16px] font-normal px-[13px] py-[11px] border border-[#ced4da] rounded-[7px] w-full outline-none focus:border-accent focus:shadow-[0_0_0_3px_color-mix(in_srgb,#198754_22%,transparent)]"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-transparent rounded-[7px] px-4 py-3 text-[16px] font-semibold cursor-pointer transition-colors bg-accent text-white hover:bg-accent-dark disabled:opacity-60 mt-1"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
