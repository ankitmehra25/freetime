import tenantA from "@/data/tenants/tenant-a.json";
import tenantB from "@/data/tenants/tenant-b.json";
import { EntitySchema } from "./types";

export function getSchema(tenantId: string, entity: string): EntitySchema {
  const schemas: Record<string, EntitySchema> = {
    "tenant-a": tenantA as EntitySchema,
    "tenant-b": tenantB as EntitySchema,
  };

  const schema = schemas[tenantId];
  if (!schema || schema.entity !== entity) {
    throw new Error("Schema not found");
  }

  return schema;
}
