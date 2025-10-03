"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = localStorage.getItem("token");
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/signin");
    }
  }, [user, router]);

  if (!user) return null; // or a loading spinner

  return <>{children}</>;
}
