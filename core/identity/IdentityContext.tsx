"use client";

import { createContext, useContext, useState } from "react";

export type IdentityContextType = {
  tenantId: string;
  username: string;
  role: "admin" | "user";
  locale: string;
};

type IdentityContextValue = {
  identity: IdentityContextType;
  setIdentity: (i: IdentityContextType) => void;
};

export const IdentityContext = createContext<IdentityContextValue | null>(null);

export function IdentityProvider({
  initialIdentity,
  children,
}: {
  initialIdentity: IdentityContextType;
  children: React.ReactNode;
}) {
  const [identity, setIdentity] = useState(initialIdentity);

  return (
    <IdentityContext.Provider value={{ identity, setIdentity }}>
      {children}
    </IdentityContext.Provider>
  );
}

export function useIdentity() {
  const ctx = useContext(IdentityContext);
  if (!ctx) {
    throw new Error("useIdentity must be used inside IdentityProvider");
  }
  return ctx.identity;
}
