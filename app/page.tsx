"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { IdentityProvider } from "@/core/identity/IdentityContext";
import type { IdentityContextType } from "@/core/identity/IdentityContext";
import { getSchema } from "@/core/metadata/registry";
import { FormRenderer } from "@/components/renderer/FormRenderer";
import styles from "./page.module.css";

export default function DashboardPage() {
  const router = useRouter();
  const [identity, setIdentity] = useState<IdentityContextType | null>(null);

  // ---- Identity Guard (Day-1 contract) ----
  useEffect(() => {
    const raw = sessionStorage.getItem("identity");
    if (!raw) {
      router.replace("/select");
      return;
    }

    try {
      setIdentity(JSON.parse(raw));
    } catch {
      sessionStorage.removeItem("identity");
      router.replace("/select");
    }
  }, [router]);

  if (!identity) {
    return null; // block rendering until identity is resolved
  }

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
