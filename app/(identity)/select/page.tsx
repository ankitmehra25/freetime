"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function IdentitySelectPage() {
  const router = useRouter();

  const [tenantId, setTenantId] = useState("tenant-a");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"admin" | "user">("admin");
  const [locale, setLocale] = useState("en-IN");

  const proceed = () => {
    const identity = { tenantId, username, role, locale };
    sessionStorage.setItem("identity", JSON.stringify(identity));
    router.push("/");
  };

  return (
    <main>
      <h1>Select Identity</h1>

      <select value={tenantId} onChange={(e) => setTenantId(e.target.value)}>
        <option value="tenant-a">Tenant A</option>
        <option value="tenant-b">Tenant B</option>
      </select>

      <input
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <select value={role} onChange={(e) => setRole(e.target.value as any)}>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>

      <select value={locale} onChange={(e) => setLocale(e.target.value)}>
        <option value="en-IN">en-IN</option>
        <option value="en-US">en-US</option>
      </select>

      <button onClick={proceed}>Proceed</button>
    </main>
  );
}
