# Security Review & Hardening Guide

> **Accuracy note (2026-09-04).** This document was originally aspirational and
> over-stated the implemented state. The list below reflects what is actually in
> the code after the P0 hardening pass:
>
> **Implemented:** JWT access/refresh in httpOnly cookies; bcrypt (cost 12)
> password hashing; RBAC with organization/project isolation; Zod validation on
> auth/project/feature/event/source/key endpoints; CORS locked to `CLIENT_URL`
> with credentials; `helmet` with a locked-down CSP on the API and a full
> security-header set (CSP, HSTS, Referrer-Policy, X-Frame-Options, …) on the web
> app; **real rate limiting + account lockout** via Upstash Redis
> (`src/middleware/rate-limit.middleware.ts`, login lockout in `auth.service.ts`);
> **CSRF protection** for the cross-site cookie session — double-submit token
> (`GET /api/v1/csrf` + `X-CSRF-Token` header) plus an `Origin` allow-list
> (`src/middleware/csrf.middleware.ts`); cross-site cookies set
> `SameSite=None; Secure`; refresh cookie scoped to `/api/v1/auth`; request body
> capped at 10 KB; generic 5xx messages (no stack traces to clients);
> `.env.example` for both apps.
>
> **Not implemented (tracked as follow-ups):** token/refresh revocation store,
> refresh-token rotation, password-reset flow, session invalidation on password
> change, 2FA, structured logging + request-ID tracing, response compression,
> per-request timeouts, API-key hashing upgrade (currently unsalted SHA-256, not
> bcrypt), CI-gated `npm audit` / Dependabot, event-ingestion auth.
>
> HTTPS/TLS is provided by Vercel for both projects.

## ✅ Completed Security Measures

### 1. Authentication Security

- [x] JWT tokens with secure expiration
  - AccessToken: 15 minutes (shorter for security)
  - RefreshToken: 7 days (longer for user experience)
- [x] HTTP-only cookies prevent JavaScript access
- [x] Secure flag set on every Vercel deployment (not gated on NODE_ENV alone)
- [x] `SameSite=None; Secure` for the cross-site cookie session, paired with
      double-submit CSRF token + Origin allow-list (see §CSRF)
- [x] Bearer token fallback for API clients
- [x] Refresh cookie scoped to `path=/api/v1/auth`
- [x] Token refresh mechanism prevents long-lived access tokens
- [x] Logout clears cookies from the client
- [ ] Server-side token/refresh revocation — **not implemented**; a stolen token
      is valid until it expires regardless of logout
- [ ] Refresh-token rotation — **not implemented**

### 2. Password Security

- [x] Passwords hashed with bcrypt (cost factor 12, hardcoded)
- [x] Minimum length enforced at registration (8–128 chars); no complexity or
      breached-password check
- [x] No plaintext passwords stored/transmitted
- [ ] Password reset via email link — **not implemented**
- [ ] Session invalidation on password change — **not implemented**

### 3. API Key Security

- [x] API keys hashed in database — **unsalted SHA-256** (not bcrypt); upgrade to
      a keyed HMAC / per-key salt before ingestion auth ships
- [x] Only keyPrefix visible in list endpoints
- [x] Full key returned only at creation time
- [x] Key rotation via revoke and create new
- [x] API key prefixes prevent accidental exposure
- [ ] Per-key expiration — schema field exists, not enforced
- [ ] API keys are **not yet consumed** anywhere (no ingestion endpoint)

### 4. Authorization & Access Control

- [x] Role-based access control (RBAC) with 4 roles
  - OWNER: Full access including delete/settings
  - ADMIN: Write/read access, no delete
  - MEMBER: Write/read access to features/events
  - VIEWER: Read-only access
- [x] Organization-level isolation (cross-org access prevented)
- [x] Project-level resource isolation
- [x] Feature-level access inherited from project
- [x] Middleware verifies role before allowing action

### 5. Input Validation & Sanitization

- [x] Zod schema validation on all POST/PATCH endpoints
- [x] Input length limits (name: 2-100 chars, description: max 500)
- [x] String trimming to prevent whitespace bypasses
- [x] Enum validation for constrained values (status, type, environment)
- [x] Required field validation
- [x] Type validation (string, number, boolean)
- [x] No eval() or dynamic code execution
- [x] Parameterized queries via Mongoose (SQL injection prevention)

### 6. Output Sanitization & XSS Prevention

- [x] React auto-escapes output (prevents XSS)
- [x] No dangerouslySetInnerHTML used
- [x] No innerHTML usage
- [x] Content-Type: application/json enforced
- [x] No JSON injection (JSON.stringify prevents code execution)
- [x] Error messages don't expose sensitive info (in production)

### 7. CORS Security

- [x] CORS origin restricted to CLIENT_URL
- [x] Credentials support enabled for cookies
- [x] Allowed methods explicitly restricted: GET, POST, PATCH, DELETE
- [x] Allowed headers restricted: Content-Type, Authorization
- [x] No wildcard (\*) origin in production
- [x] Preflight requests handled automatically

### 8. Security Headers

All headers below are now set by `helmet` on the API and by `next.config.ts`
`headers()` on the web app:

- [x] X-Content-Type-Options: nosniff
- [x] X-Frame-Options: DENY
- [x] Strict-Transport-Security: max-age 2y, includeSubDomains, preload
- [x] Content-Security-Policy — `default-src 'none'` on the API; a scoped policy
      on the web app (`connect-src` allows the API origin)
- [x] Referrer-Policy: no-referrer
- [x] Permissions-Policy: camera/microphone/geolocation disabled (web app)
- [x] X-XSS-Protection: 0 (set by helmet; the old `1; mode=block` is deprecated)

### 9. HTTPS/TLS

- [ ] HTTPS enforced (deploy-time configuration)
  - Use environment variable to detect HTTPS
  - Redirect HTTP to HTTPS in production
  - Set Secure flag on cookies only in production
- [ ] TLS 1.3+ recommended
- [ ] Certificate from trusted CA (Let's Encrypt)
- [ ] Certificate auto-renewal configured

### 10. Environment Variables

- [x] Sensitive data in environment variables
  - JWT_SECRET (production: 32+ random chars)
  - JWT_REFRESH_SECRET (production: different secret)
  - DATABASE_URL (MongoDB connection string)
  - CLIENT_URL (CORS origin)
  - NODE_ENV (development/production)
- [x] .env.example documents required variables
- [x] No secrets in code or git repository
- [x] .env file in .gitignore

### 11. Database Security

- [x] MongoDB connection with authentication
- [x] Use connection pooling (Mongoose handles this)
- [x] Parameterized queries prevent injection
- [x] Indexes on frequently-queried fields for performance
- [x] Regular backups recommended
- [x] Database credentials in environment variables

### 12. Error Handling

- [x] Generic error messages in production (no stack traces)
- [x] Detailed errors only in development
- [x] Log errors for monitoring
- [x] No sensitive data in error responses
- [x] Consistent error response format
- [x] HTTP status codes appropriate for error type

### 13. Rate Limiting

- [x] Implemented with `@upstash/ratelimit` + `@upstash/redis`
      (`src/middleware/rate-limit.middleware.ts`). Sliding window, keyed by client
      IP (behind `trust proxy`). Fails open on limiter infrastructure errors.
  - General API (`/api/v1/*`): 100 / 60s
  - `POST /auth/login`, `/auth/register`, `/auth/refresh`: 10 / 60s
- [x] Account lockout: 10 failed logins per email in 15 min → `429`
      (`auth.service.ts`). Layered on the per-IP limiter.
- [x] `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` required when
      `NODE_ENV=production` (enforced in `config/env.ts`); optional locally, where
      the limiter degrades to pass-through.

### 14. Request/Response Security

- [x] Request size limits (10KB max payload)
- [ ] Response compression (gzip/br) — **not implemented** (Vercel's edge may add it)
- [ ] Structured logging with redaction — **not implemented** (only `console.*`)
- [ ] Per-request timeout — **not implemented**
- [ ] Request-ID / trace-ID tracking — **not implemented**

### 15. Dependency Security

- [x] `npm audit` clean on the API (0 vulnerabilities as of 2026-09-04)
- [x] Lockfiles committed for both apps
- [x] `apps/api/.npmrc` sets `legacy-peer-deps=true` (ts-jest's peer range still
      caps TypeScript `<7`; the project runs TS 7 and uses `@swc/jest` to run
      tests)
- [ ] CI-gated `npm audit` / Dependabot — **not configured** (no CI yet)

## ⚠️ Recommendations for Production

### Pre-Deployment Checklist

#### HTTPS/TLS Setup

```bash
# Use Let's Encrypt (free certificate)
# Install certbot on server
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Configure server to use certificate
# Redirect HTTP to HTTPS

# In app.ts, detect HTTPS and set secure cookie flag:
const isProduction = env.NODE_ENV === 'production';
const isSecure = req.protocol === 'https' || isProduction;
// Set cookie with: httpOnly: true, secure: isSecure, sameSite: 'strict'
```

#### Environment Variables

```bash
# .env.production
NODE_ENV=production
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/featurepulse
CLIENT_URL=https://app.featurepulse.com
JWT_SECRET=<64-char-random-string>
JWT_REFRESH_SECRET=<64-char-random-string>

# Generate random secrets:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Cookie Security Improvements

```typescript
// Current cookie setup should be enhanced:
res.cookie("accessToken", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Only HTTPS
  sameSite: "strict", // CSRF protection
  maxAge: 15 * 60 * 1000, // 15 minutes
  domain: ".featurepulse.com", // Restrict to domain
});

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/api/v1/auth/refresh", // Restrict to refresh endpoint
});
```

#### Content Security Policy

```typescript
// Add to app.ts middleware
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires this
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' " + process.env.API_URL,
      "frame-ancestors 'none'",
    ].join("; "),
  );
  next();
});
```

#### Rate Limiting Implementation

```bash
# Install dependencies
npm install express-rate-limit redis ioredis

# Create Redis-backed rate limiter
npm install express-rate-limit redis
```

```typescript
// middleware/rateLimiter.ts
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "redis";

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "6379"),
});

const limiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: "rate-limit:",
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

export default limiter;
```

#### Dependency Scanning

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Generate SBOM (Software Bill of Materials)
npm install -g sbom-tool
sbom-tool generate -d . -m ... -o ./sbom

# Use GitHub Dependabot for automated updates
# (Auto-create PRs for dependency updates)
```

#### Monitoring & Logging

```typescript
// Add structured logging
import winston from "winston";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Log authentication failures
logger.warn("Failed login attempt", { email, ip: req.ip });

// Log authorization denials
logger.warn("Unauthorized access attempt", { userId, resource: req.path });
```

### Security Testing

#### OWASP Top 10 Verification

```bash
# 1. Injection (SQL, NoSQL)
# ✅ Mongoose parameterized queries prevent injection

# 2. Broken Authentication
# ✅ JWT with expiration and refresh tokens
# ✅ HTTP-only, secure, sameSite cookies
# TODO: Implement 2FA

# 3. Sensitive Data Exposure
# ✅ HTTPS enforced (deploy-time)
# ✅ API keys hashed
# ✅ Passwords hashed with bcrypt
# TODO: Enable database encryption at rest

# 4. XML External Entities (XXE)
# ✅ Not applicable (using JSON)

# 5. Broken Access Control
# ✅ RBAC middleware on all routes
# ✅ Organization isolation verified
# TODO: Audit all endpoints for authorization

# 6. Security Misconfiguration
# ✅ Security headers configured
# ✅ CORS properly restricted
# TODO: Disable debug mode in production

# 7. Cross-Site Scripting (XSS)
# ✅ React escapes output by default
# ✅ No dangerouslySetInnerHTML
# TODO: Add CSP headers

# 8. Insecure Deserialization
# ✅ Not applicable (using JSON, no pickle/marshal)

# 9. Using Components with Known Vulnerabilities
# ✅ npm audit checks
# TODO: Automate with GitHub Dependabot

# 10. Insufficient Logging & Monitoring
# ✅ Error handling in place
# TODO: Implement centralized logging (ELK, Datadog)
```

#### Penetration Testing Checklist

- [x] Cross-Site Request Forgery (CSRF)
  - Double-submit token: `GET /api/v1/csrf` issues an httpOnly `csrfToken`
    cookie + returns the value; state-changing requests must echo it in the
    `X-CSRF-Token` header (`src/middleware/csrf.middleware.ts`)
  - `Origin` header checked against the `CLIENT_URL` allow-list on unsafe methods
  - `SameSite=None` cookies (cross-site deployment), so the token + Origin check
    are the real protection, not SameSite
- [ ] Cross-Site Scripting (XSS)
  - Inject `<script>alert('xss')</script>` in form fields
  - Verify it's escaped in response
- [ ] SQL Injection (NoSQL)
  - Inject `{"$where":"1==1"}` in query
  - Verify it's treated as literal string
- [ ] Privilege Escalation
  - Try to access resources as different role
  - Verify 403 Forbidden response
- [ ] Authentication Bypass
  - Try accessing protected endpoints without token
  - Verify 401 Unauthorized response
- [ ] Sensitive Data Exposure
  - Check network traffic for API keys/passwords
  - Verify all sensitive data is HTTPS-only
- [ ] Directory Traversal
  - Try `../../../etc/passwd` in file paths
  - Verify access denied

### Security Monitoring & Alerting

```typescript
// Monitor failed login attempts
app.post("/auth/login", (req, res) => {
  // Track failed attempts per IP
  const failedAttempts = getFailedAttempts(req.ip);
  if (failedAttempts > 5) {
    logger.alert("Brute force attempt detected", { ip: req.ip });
    return res.status(429).json({ error: "Too many attempts" });
  }
});

// Monitor unauthorized access attempts
app.use((err, req, res, next) => {
  if (err.statusCode === 403) {
    logger.warn("Unauthorized access attempt", {
      userId: req.userId,
      resource: req.path,
      ip: req.ip,
    });
  }
});
```

### Secrets Management

```typescript
// Never log secrets
console.log({ password: '***' });

// Never commit secrets
// .gitignore:
# Environment
.env
.env.local
.env.*.local

# Keys
*.pem
*.key
*.crt

// Use secrets management in production:
// - GitHub Secrets (CI/CD)
// - HashiCorp Vault
// - AWS Secrets Manager
// - Azure Key Vault
```

## Security Audit Checklist

- [x] Input validation on all POST/PATCH endpoints
- [x] Output sanitization (React auto-escape)
- [x] CORS properly configured
- [x] Security headers set
- [x] Authentication required for protected routes
- [x] Authorization checked (RBAC middleware)
- [x] Passwords hashed (bcrypt)
- [x] API keys hashed
- [x] HTTP-only, secure, sameSite cookies
- [x] JWT with reasonable expiration
- [x] Token refresh mechanism
- [x] Request size limits
- [x] Error messages don't leak info
- [x] Parameterized queries (Mongoose)
- [ ] HTTPS enforced (deploy-time)
- [ ] Rate limiting implemented
- [ ] Logging and monitoring
- [ ] Regular dependency updates
- [ ] OWASP Top 10 verification
- [ ] Penetration testing

## Incident Response Plan

### Suspicious Activity Response

```
1. Alert
   - Detect: Failed login attempts, unauthorized access
   - Notify: Security team, DevOps

2. Investigate
   - Review logs for pattern
   - Identify affected users
   - Check for data exposure

3. Contain
   - Block IP if brute force
   - Revoke compromised tokens
   - Reset passwords if needed

4. Notify
   - Inform affected users
   - File incident report
   - Document lessons learned
```

### Compromised Secret Response

```
1. Rotate
   - Generate new JWT_SECRET
   - Invalidate all active tokens
   - Restart API servers

2. Audit
   - Check API logs for unauthorized access
   - Review changed resources
   - Audit user account activity

3. Notify
   - Inform affected users
   - Recommend password change
   - Enable 2FA
```

## Compliance & Standards

- OWASP Top 10 ✅
- CWE Top 25 (Common Weakness Enumeration)
- NIST Cybersecurity Framework
- GDPR (if EU users) - Data protection, DPA
- CCPA (if CA users) - Privacy rights

## Summary

**Current Status**: Core security controls implemented (auth, RBAC, validation,
rate limiting + lockout, CSRF, security headers/CSP). Not yet hardened for
high-assurance production — see the "Not implemented" list at the top.

**Done in the P0 pass:** HTTPS (Vercel), strong JWT secret enforcement, rate
limiting + account lockout, CSRF protection, helmet + CSP, `.env.example`,
cross-site cookie hardening, working test runner.

**Still required before a serious production launch:**

1. Rotate the MongoDB Atlas credentials currently in the working-tree `.env`
2. Token/refresh revocation store + refresh-token rotation
3. Structured logging + monitoring/alerting (Sentry or equivalent)
4. CI with typecheck + tests + `npm audit` gate
5. Real integration tests (auth, RBAC denial, tenant isolation)
6. Upgrade API-key hashing (HMAC / per-key salt)
7. Penetration testing
8. Automated database backups

**Post-Launch** (Ongoing):

1. Monitor for suspicious activity
2. Keep dependencies updated
3. Regular security audits
4. Incident response exercises
5. User security awareness training
