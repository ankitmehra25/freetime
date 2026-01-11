export type AttributeType = "string" | "number" | "enum";

export type ValidationRule =
  | { type: "required"; message?: Record<string, string> }
  | { type: "min"; value: number; message?: Record<string, string> }
  | { type: "max"; value: number; message?: Record<string, string> };

export type VisibilityRule =
  | {
      dependsOn: string;
      exists: true;
    }
  | {
      dependsOn: string;
      equals: unknown;
    };

export type Attribute = {
  name: string;
  type: AttributeType;
  label: Record<string, string>;

  validations?: ValidationRule[];
  visibleWhen?: VisibilityRule;
};

export type EntitySchema = {
  tenantId: string;
  entity: string;
  version: string;
  attributes: Attribute[];
};
