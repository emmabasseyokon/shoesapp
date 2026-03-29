"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag, User, Menu, X, LogOut } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const totalItems = useCartStore((s) => s.totalItems);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  const isAdmin = user?.app_metadata?.role === "admin";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-surface-900/95 backdrop-blur-md border-b border-surface-700"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold tracking-tight text-white">
              SHOES<span className="text-brand-500">APP</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-sm text-surface-200 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-sm text-surface-200 hover:text-white transition-colors"
              >
                Products
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
                >
                  Admin
                </Link>
              )}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <Link href="/cart" className="relative p-2 text-surface-200 hover:text-white transition-colors">
                <ShoppingBag className="h-5 w-5" />
                {totalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
                    {totalItems()}
                  </span>
                )}
              </Link>

              {/* Account */}
              {user ? (
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    href="/account"
                    className="flex items-center gap-2 text-sm text-surface-200 hover:text-white transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-surface-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:flex items-center gap-2 text-sm text-surface-200 hover:text-white transition-colors"
                >
                  <User className="h-4 w-4" />
                  Login
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-surface-200 hover:text-white cursor-pointer"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute top-16 right-0 w-64 h-[calc(100vh-4rem)] bg-surface-900 border-l border-surface-700 p-6 flex flex-col gap-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-surface-200 hover:text-white transition-colors py-2"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-surface-200 hover:text-white transition-colors py-2"
            >
              Products
            </Link>
            {user ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-surface-200 hover:text-white transition-colors py-2"
                >
                  My Account
                </Link>
                <Link
                  href="/account/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-surface-200 hover:text-white transition-colors py-2"
                >
                  My Orders
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-brand-400 hover:text-brand-300 transition-colors py-2"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors py-2 text-left cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-surface-200 hover:text-white transition-colors py-2"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-brand-400 hover:text-brand-300 transition-colors py-2"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
