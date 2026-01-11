"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import { IdentityProvider } from "@/core/identity/IdentityContext";
import type { IdentityContextType } from "@/core/identity/IdentityContext";
import { getSchema } from "@/core/metadata/registry";
import { FormRenderer } from "@/components/renderer/FormRenderer";
import styles from "./page.module.css";

export default function DashboardPage() {
  const router = useRouter();

  // ---- Identity Guard (Day-1 contract) ----
  // Initialize identity from sessionStorage using lazy initialization
  const [state] = useState<{
    identity: IdentityContextType | null;
    isLoading: boolean;
  }>(() => {
    // This function only runs once during initial render
    // Check if we're on the client side
    if (typeof window === "undefined") {
      return { identity: null, isLoading: true };
    }

    const raw = sessionStorage.getItem("identity");

    if (!raw) {
      return { identity: null, isLoading: false };
    }

    try {
      const parsedIdentity = JSON.parse(raw);
      return { identity: parsedIdentity, isLoading: false };
    } catch {
      sessionStorage.removeItem("identity");
      return { identity: null, isLoading: false };
    }
  });

  // Ensure we only render the content after hydration to match server output
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Redirect if no valid identity found
  useEffect(() => {
    if (isMounted && !state.isLoading && !state.identity) {
      router.replace("/select");
    }
  }, [state.identity, state.isLoading, router, isMounted]);

  if (!isMounted || state.isLoading || !state.identity) {
    return null; // block rendering until identity is resolved and hydration matches
  }

  const { identity } = state;

  // ---- Tenant-scoped metadata (Day-2 core) ----
  const schema = getSchema(identity.tenantId, "lead");

  return (
    <IdentityProvider initialIdentity={identity}>
      <main className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Welcome back, {identity.username}</p>
        </header>

        <div className={styles.dashboardGrid}>
          {/* Identity proof (Day-1 validation) */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Identity Context</h3>
              <span className={styles.badge}>{identity.tenantId}</span>
            </div>
            <pre className={styles.pre}>
              {JSON.stringify(identity, null, 2)}
            </pre>
          </section>

          {/* Metadata-driven UI (Day-2 objective) */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                {schema.entity
                  .split(/[-_ ]+/)
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join("")}
              </h3>
            </div>
            <FormRenderer schema={schema} locale={identity.locale} />
          </section>
        </div>
      </main>
    </IdentityProvider>
  );
}
