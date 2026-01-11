// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IdentityProvider } from "@/core/identity/IdentityContext";

export default function AppHome() {
  const router = useRouter();
  const [identity, setIdentity] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("identity");
    if (!raw) {
      router.replace("/select");
      return;
    }
    setIdentity(JSON.parse(raw));
  }, [router]);

  if (!identity) return null;

  return (
    <IdentityProvider initialIdentity={identity}>
      <main>
        <h1>App Shell</h1>
        <pre>{JSON.stringify(identity, null, 2)}</pre>
      </main>
    </IdentityProvider>
  );
}
