import { z } from "zod";
import { createFeatureSchema, updateFeatureSchema } from "../modules/features/feature.validation";

describe("Feature Validation", () => {
  describe("createFeatureSchema", () => {
    it("should validate valid feature creation", () => {
      const valid = {
        name: "User Authentication",
        description: "Add user login and registration",
      };
      expect(() => createFeatureSchema.parse(valid)).not.toThrow();
    });

    it("should reject name with less than 2 characters", () => {
      const invalid = { name: "A" };
      expect(() => createFeatureSchema.parse(invalid)).toThrow();
    });

    it("should reject name longer than 100 characters", () => {
      const invalid = { name: "A".repeat(101) };
      expect(() => createFeatureSchema.parse(invalid)).toThrow();
    });

    it("should reject description longer than 500 characters", () => {
      const invalid = {
        name: "Valid Name",
        description: "X".repeat(501),
      };
      expect(() => createFeatureSchema.parse(invalid)).toThrow();
    });

    it("should trim whitespace from name", () => {
      const input = { name: "  Feature Name  " };
      const result = createFeatureSchema.parse(input);
      expect(result.name).toBe("Feature Name");
    });

    it("should allow optional description", () => {
      const valid = { name: "Feature" };
      const result = createFeatureSchema.parse(valid);
      expect(result.description).toBeUndefined();
    });
  });

  describe("updateFeatureSchema", () => {
    it("should validate partial updates", () => {
      const valid = { status: "ACTIVE" };
      expect(() => updateFeatureSchema.parse(valid)).not.toThrow();
    });

    it("should reject invalid status", () => {
      const invalid = { status: "INVALID" };
      expect(() => updateFeatureSchema.parse(invalid)).toThrow();
    });

    it("should allow empty updates", () => {
      const valid = {};
      expect(() => updateFeatureSchema.parse(valid)).not.toThrow();
    });
  });
});
