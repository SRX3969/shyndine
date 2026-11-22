"use client";

import { ReactNode, useMemo } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

export function AppConvexProvider({ children }: { children: ReactNode }) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  const convex = useMemo(() => {
    if (convexUrl && convexUrl.startsWith("http")) {
      return new ConvexReactClient(convexUrl);
    }
    return null;
  }, [convexUrl]);

  if (convex) {
    return <ConvexProvider client={convex}>{children}</ConvexProvider>;
  }

  return <>{children}</>;
}
