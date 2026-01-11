"use client";

import { useContext } from "react";
import { IdentityContext } from "./IdentityContext";

export function useIdentity() {
  const context = useContext(IdentityContext);

  if (context === undefined) {
    throw new Error("useIdentity must be used within an IdentityProvider");
  }

  return context;
}
