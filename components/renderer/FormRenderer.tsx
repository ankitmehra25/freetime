"use client";

import { useState } from "react";
import { EntitySchema, Attribute } from "@/core/metadata/types";

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
    const actual = values[attr.visibleWhen.dependsOn];
    return actual === attr.visibleWhen.equals;
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
    <form
      onBlur={validate}
      style={{ display: "flex", flexDirection: "column", gap: "12px" }}
    >
      {schema.attributes.map((attr) => {
        if (!isVisible(attr)) return null;

        return (
          <div key={attr.name}>
            <label>{attr.label[locale]}</label>
            <input
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
              <div key={i} style={{ color: "red", fontSize: "12px" }}>
                {msg}
              </div>
            ))}
          </div>
        );
      })}
    </form>
  );
}
