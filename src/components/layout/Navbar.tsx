"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
];

export function Navbar({ isAdmin }: { isAdmin: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* 6px topbar */}
      <div className="h-[6px] bg-topbar" />

      <nav className="relative flex items-center justify-between bg-navbg border-b border-line px-5 py-[10px] md:px-12">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 no-underline min-w-0"
          onClick={() => setMenuOpen(false)}
        >
          <span className="flex-none w-[38px] h-[38px] border border-[#cfcfcf] rounded-[4px] overflow-hidden bg-white p-[2px]">
            <svg
              viewBox="0 0 40 40"
              width="34"
              height="34"
              className="block w-full h-full rounded-[3px]"
            >
              <rect width="40" height="40" rx="4" fill="#1b1b1b" />
              <path
                d="M8 25c2-1 4-1 6 0 3 1.4 6 1.4 9 0 2-1 4-1 7 0l2 .8V29H8z"
                fill="#cdb79a"
              />
              <circle cx="15" cy="14" r="4.4" fill="#cdb79a" />
              <path
                d="M11 26c1.5-3 3-5 6-5s5 1.5 6 4"
                stroke="#1b1b1b"
                strokeWidth="1.4"
                fill="none"
              />
            </svg>
          </span>
          <span className="font-extrabold text-[clamp(18px,5vw,26px)] tracking-[0.3px] text-ink whitespace-nowrap">
            GEEMANFOOTWEARS
          </span>
        </Link>

        {/* Hamburger — mobile only */}
        <button
          className="flex flex-col justify-center gap-[5px] w-11 h-11 p-[10px] bg-transparent border-none cursor-pointer min-[860px]:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`block h-[2.5px] w-full bg-ink rounded-[2px] transition-transform duration-200 origin-center ${
              menuOpen ? "translate-y-[7.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[2.5px] w-full bg-ink rounded-[2px] transition-opacity duration-200 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-[2.5px] w-full bg-ink rounded-[2px] transition-transform duration-200 origin-center ${
              menuOpen ? "-translate-y-[7.5px] -rotate-45" : ""
            }`}
          />
        </button>

        {/* Links panel */}
        <div
          className={`
            ${menuOpen ? "flex" : "hidden"}
            min-[860px]:flex
            flex-col items-stretch gap-0
            absolute top-full left-0 right-0
            bg-navbg border-b border-line
            px-5 pt-[6px] pb-[14px]
            shadow-[0_14px_26px_rgba(0,0,0,.08)]
            min-[860px]:static
            min-[860px]:flex-row min-[860px]:items-center min-[860px]:gap-[30px]
            min-[860px]:p-0 min-[860px]:bg-transparent min-[860px]:border-none min-[860px]:shadow-none
          `}
        >
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`
                no-underline font-medium transition-colors duration-150
                py-[13px] border-b border-line text-[18px]
                min-[860px]:py-1 min-[860px]:border-none
                ${
                  isActive(href)
                    ? "text-accent font-semibold"
                    : "text-[#495057] hover:text-ink"
                }
              `}
            >
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className={`
                no-underline font-medium transition-colors duration-150
                py-[13px] border-b border-line text-[18px]
                min-[860px]:py-1 min-[860px]:border-none
                ${
                  isActive("/admin")
                    ? "text-accent font-semibold"
                    : "text-[#495057] hover:text-ink"
                }
              `}
            >
              Admin
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
