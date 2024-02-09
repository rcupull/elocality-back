import { SchemaDefinition } from "mongoose";

export const createdAtSchemaDefinition: SchemaDefinition = {
  createdAt: { type: String, default: new Date().toISOString() },
};
