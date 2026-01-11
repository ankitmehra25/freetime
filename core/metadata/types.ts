export type AttributeType = "string" | "number" | "enum";

export type Attribute = {
  name: string;
  type: AttributeType;
  label: Record<string, string>;
  required?: boolean;
};

export type EntitySchema = {
  tenantId: string;
  entity: string;
  version: string;
  attributes: Attribute[];
};
