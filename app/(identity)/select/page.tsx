"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./select.module.css";

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
    <main className={styles.container}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>
            Sign in to your workspace to continue
          </p>
        </header>

        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Tenant</label>
            <select
              className={styles.select}
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
            >
              <option value="tenant-a">Tenant A</option>
              <option value="tenant-b">Tenant B</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Username</label>
            <input
              className={styles.input}
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Role</label>
            <select
              className={styles.select}
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "user")}
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Locale</label>
            <select
              className={styles.select}
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
            >
              <option value="en-IN">English (India)</option>
              <option value="en-US">English (US)</option>
            </select>
          </div>

          <button className={styles.button} onClick={proceed}>
            Proceed
          </button>
        </div>
      </div>
    </main>
  );
}
