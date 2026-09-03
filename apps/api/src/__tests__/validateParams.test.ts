import { validateParams } from "../utils/validateParams";
import { AppError } from "../utils/AppError";

describe("validateParams", () => {
  it("should return params when all required params are present", () => {
    const params = {
      organizationId: "org123",
      projectId: "proj123",
    };
    const result = validateParams(params, ["organizationId", "projectId"]);
    expect(result).toEqual(params);
  });

  it("should throw error when required param is missing", () => {
    const params = { organizationId: "org123" };
    expect(() => validateParams(params, ["organizationId", "projectId"])).toThrow();
  });

  it("should throw 400 error with specific param name", () => {
    const params = { organizationId: "org123" };
    try {
      validateParams(params, ["organizationId", "projectId", "featureId"]);
      fail("Should throw");
    } catch (err: any) {
      expect(err.statusCode).toBe(400);
      expect(err.message).toContain("projectId");
    }
  });

  it("should handle empty params object", () => {
    expect(() => validateParams({}, ["organizationId"])).toThrow();
  });

  it("should handle single required param", () => {
    const params = { userId: "user123" };
    const result = validateParams(params, ["userId"]);
    expect(result).toEqual(params);
  });

  it("should not throw for params that are not required", () => {
    const params = {
      organizationId: "org123",
      projectId: "proj123",
      extraField: "should not matter",
    };
    const result = validateParams(params, ["organizationId", "projectId"]);
    expect(result).toEqual(params);
  });
});
