import { AppError } from "../utils/AppError";

describe("AppError", () => {
  it("should create error with message and status", () => {
    const error = new AppError("Not found", 404);
    expect(error.message).toBe("Not found");
    expect(error.statusCode).toBe(404);
  });

  it("should default to 500 status code", () => {
    const error = new AppError("Server error");
    expect(error.statusCode).toBe(500);
  });

  it("should be instance of Error", () => {
    const error = new AppError("Test error", 400);
    expect(error).toBeInstanceOf(Error);
  });

  it("should preserve error message in toString", () => {
    const error = new AppError("Custom message", 400);
    expect(error.toString()).toContain("Custom message");
  });

  describe("Common HTTP status codes", () => {
    it("should support 400 Bad Request", () => {
      const error = new AppError("Invalid input", 400);
      expect(error.statusCode).toBe(400);
    });

    it("should support 401 Unauthorized", () => {
      const error = new AppError("Not authenticated", 401);
      expect(error.statusCode).toBe(401);
    });

    it("should support 403 Forbidden", () => {
      const error = new AppError("Not authorized", 403);
      expect(error.statusCode).toBe(403);
    });

    it("should support 404 Not Found", () => {
      const error = new AppError("Resource not found", 404);
      expect(error.statusCode).toBe(404);
    });

    it("should support 409 Conflict", () => {
      const error = new AppError("Already exists", 409);
      expect(error.statusCode).toBe(409);
    });

    it("should support 500 Internal Server Error", () => {
      const error = new AppError("Server error", 500);
      expect(error.statusCode).toBe(500);
    });
  });
});
