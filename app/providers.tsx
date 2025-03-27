/**
 * Providers wrapper for the Next.js application
 */
"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// Create a Convex client using the deployment URL from environment variables
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}

export default Providers; 