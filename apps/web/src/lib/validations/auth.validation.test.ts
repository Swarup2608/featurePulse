import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "./auth.validation";

describe("loginSchema", () => {
  it("accepts a valid email and non-empty password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "anything",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "anything",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Enter a valid email address");
    }
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("trims surrounding whitespace from the email", () => {
    const result = loginSchema.parse({
      email: "  user@example.com  ",
      password: "anything",
    });
    expect(result.email).toBe("user@example.com");
  });
});

describe("registerSchema", () => {
  const validInput = {
    name: "Ada Lovelace",
    organizationName: "Analytical Engines Inc.",
    email: "ada@example.com",
    password: "supersecret123",
  };

  it("accepts a fully valid payload", () => {
    expect(registerSchema.safeParse(validInput).success).toBe(true);
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = registerSchema.safeParse({ ...validInput, name: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects an organization name that is only whitespace", () => {
    const result = registerSchema.safeParse({
      ...validInput,
      organizationName: "   ",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a password under 8 characters", () => {
    const result = registerSchema.safeParse({ ...validInput, password: "short1" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Password must be at least 8 characters",
      );
    }
  });
});
