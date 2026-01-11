"use client";

import { EntitySchema } from "@/core/metadata/types";
import styles from "./FormRenderer.module.css";

export function FormRenderer({
  schema,
  locale,
}: {
  schema: EntitySchema;
  locale: string;
}) {
  return (
    <form className={styles.form}>
      {schema.attributes.map((attr) => (
        <div key={attr.name} className={styles.field}>
          <label className={styles.label}>{attr.label[locale]}</label>
          <input
            className={styles.input}
            type={attr.type === "number" ? "number" : "text"}
            placeholder={`Enter ${attr.label[locale]}`}
          />
        </div>
      ))}
    </form>
  );
}
