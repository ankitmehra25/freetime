"use client";

import { useState } from "react";
import { EntitySchema, Attribute } from "@/core/metadata/types";
import styles from "./FormRenderer.module.css";

type Errors = Record<string, string[]>;

export function FormRenderer({
  schema,
  locale,
}: {
  schema: EntitySchema;
  locale: string;
}) {
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Errors>({});

  const isVisible = (attr: Attribute) => {
    if (!attr.visibleWhen) return true;
    const depValue = values[attr.visibleWhen.dependsOn];

    if ("exists" in attr.visibleWhen) {
      return depValue !== undefined && depValue !== "";
    }

    if ("equals" in attr.visibleWhen) {
      return depValue === attr.visibleWhen.equals;
    }

    return true;
  };

  const validate = () => {
    const nextErrors: Errors = {};

    schema.attributes.forEach((attr) => {
      const value = values[attr.name];
      attr.validations?.forEach((rule) => {
        if (rule.type === "required" && !value) {
          nextErrors[attr.name] = [rule.message?.[locale] ?? "Required"];
        }
      });
    });

    setErrors(nextErrors);
  };

  return (
    <form className={styles.form} onBlur={validate}>
      {schema.attributes.map((attr) => {
        if (!isVisible(attr)) return null;

        return (
          <div key={attr.name} className={styles.field}>
            <label className={styles.label}>{attr.label[locale]}</label>
            <input
              className={styles.input}
              type={attr.type === "number" ? "number" : "text"}
              value={
                values[attr.name] !== undefined && values[attr.name] !== null
                  ? String(values[attr.name])
                  : ""
              }
              onChange={(e) =>
                setValues({ ...values, [attr.name]: e.target.value })
              }
            />

            {errors[attr.name]?.map((msg, i) => (
              <div
                key={i}
                style={{ color: "var(--error)", fontSize: "0.75rem" }}
              >
                {msg}
              </div>
            ))}
          </div>
        );
      })}
    </form>
  );
}
