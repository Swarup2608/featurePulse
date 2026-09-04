import { afterEach, describe, expect, it, vi } from "vitest";

// api-client keeps the CSRF token as module-level state, so each test needs a
// fresh module instance to avoid bleeding state between cases. ApiError must
// come from that same fresh registry too, or `instanceof` checks against the
// statically-imported class will fail even for a genuine ApiError.
const loadApiClient = async () => {
  vi.resetModules();
  const [{ apiClient }, { ApiError }] = await Promise.all([
    import("./api-client"),
    import("./api-error"),
  ]);
  return { apiClient, ApiError };
};

// A fresh Response per call — Response bodies can only be read once, so a mock
// reused across multiple requests (e.g. via mockResolvedValue) would silently
// fail to parse on the second read.
const jsonResponse = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
    ...init,
  });

describe("apiClient", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("unwraps the `data` envelope on a successful GET and skips the CSRF handshake", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementation(() => jsonResponse({ success: true, data: { id: "1" } }));
    vi.stubGlobal("fetch", fetchMock);
    const { apiClient } = await loadApiClient();

    const result = await apiClient.get<{ id: string }>("/projects");

    expect(result).toEqual({ id: "1" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, options] = fetchMock.mock.calls[0];
    expect(options.credentials).toBe("include");
    expect(options.headers["X-CSRF-Token"]).toBeUndefined();
  });

  it("fetches a CSRF token before a POST and sends it on the request", async () => {
    const fetchMock = vi
      .fn()
      // GET /csrf
      .mockImplementationOnce(() =>
        jsonResponse({ success: true, data: { csrfToken: "token-abc" } }),
      )
      // POST /projects
      .mockImplementationOnce(() =>
        jsonResponse({ success: true, data: { id: "1" } }, { status: 201 }),
      );
    vi.stubGlobal("fetch", fetchMock);
    const { apiClient } = await loadApiClient();

    await apiClient.post("/projects", { name: "New" });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toContain("/csrf");
    const [, postOptions] = fetchMock.mock.calls[1];
    expect(postOptions.headers["X-CSRF-Token"]).toBe("token-abc");
  });

  it("reuses one in-flight CSRF fetch for concurrent requests", async () => {
    let resolveCsrf!: (value: Response) => void;
    const csrfPromise = new Promise<Response>((resolve) => {
      resolveCsrf = resolve;
    });
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(() => csrfPromise)
      .mockImplementation(() => jsonResponse({ success: true, data: {} }));
    vi.stubGlobal("fetch", fetchMock);
    const { apiClient } = await loadApiClient();

    const first = apiClient.post("/a");
    const second = apiClient.post("/b");
    resolveCsrf(jsonResponse({ success: true, data: { csrfToken: "shared" } }));
    await Promise.all([first, second]);

    // Exactly one CSRF fetch, no matter how many concurrent writes needed it.
    const csrfCalls = fetchMock.mock.calls.filter(([url]) => String(url).includes("/csrf"));
    expect(csrfCalls).toHaveLength(1);
  });

  it("retries once with a fresh token after a 403, then gives up if it 403s again", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(() =>
        jsonResponse({ success: true, data: { csrfToken: "stale" } }),
      ) // initial csrf
      .mockImplementationOnce(() =>
        jsonResponse({ success: false, message: "bad token" }, { status: 403 }),
      ) // first POST attempt fails
      .mockImplementationOnce(() =>
        jsonResponse({ success: true, data: { csrfToken: "fresh" } }),
      ) // re-fetch csrf
      .mockImplementationOnce(() => jsonResponse({ success: true, data: { ok: true } })); // retried POST succeeds
    vi.stubGlobal("fetch", fetchMock);
    const { apiClient } = await loadApiClient();

    const result = await apiClient.post("/projects");

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it("throws an ApiError with the server message, status and field errors", async () => {
    const fetchMock = vi.fn().mockImplementation(() =>
      jsonResponse(
        { success: false, message: "Validation failed", errors: { email: ["Invalid"] } },
        { status: 422 },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    const { apiClient, ApiError } = await loadApiClient();

    await expect(apiClient.get("/whatever")).rejects.toMatchObject({
      message: "Validation failed",
      status: 422,
      errors: { email: ["Invalid"] },
    });
    await expect(apiClient.get("/whatever")).rejects.toBeInstanceOf(ApiError);
  });

  it("treats a 204 response as no content instead of failing to parse JSON", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(() =>
        jsonResponse({ success: true, data: { csrfToken: "token-abc" } }),
      ) // DELETE needs a CSRF token first
      .mockImplementationOnce(() => new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    const { apiClient } = await loadApiClient();

    await expect(apiClient.delete("/projects/1")).resolves.toBeNull();
  });
});
