"use client";

import { useEffect, useState, type ReactNode } from "react";

export function CartProvider({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return <>{children}</>;

  return <>{children}</>;
}
