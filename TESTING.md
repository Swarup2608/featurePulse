# Test Suite Documentation

## Test Structure

Tests are organized into three categories:

### 1. Unit Tests
- **Purpose**: Test individual functions in isolation
- **Location**: `src/__tests__/*.test.ts`
- **Coverage**: Validation, error handling, utility functions
- **Framework**: Jest
- **Running**: `npm test`

### 2. Integration Tests
- **Purpose**: Test complete API flows end-to-end
- **Location**: `src/__tests__/integration.test.ts`
- **Coverage**: Feature creation → event linking → analytics
- **Scenarios**: Authorization, pagination, error handling
- **Status**: Documented (ready for implementation with test framework)

### 3. Test Coverage by Module

#### Authentication
- [x] User registration with email/password
- [x] Login with valid credentials
- [x] Refresh token rotation
- [x] Logout and token cleanup
- [x] Protected route access
- [ ] Invalid credentials rejected
- [ ] Email validation
- [ ] Password strength requirements

#### Features
- [x] Create feature with valid data
- [x] Reject duplicate slugs (409 Conflict)
- [x] Update feature status (DRAFT → ACTIVE → RELEASED → ARCHIVED)
- [x] Pagination with limit capping (max 100)
- [x] Feature-specific authorization checks
- [ ] Slug generation from name
- [ ] Feature export/import

#### Events
- [x] Create event definitions
- [x] List events with pagination
- [x] Link event to feature (409 on duplicate)
- [x] Unlink event from feature
- [ ] Event metadata tracking
- [ ] Event deduplication

#### Event Sources
- [x] Create event source with type/environment
- [x] List sources with filtering
- [ ] Toggle source active status
- [ ] Source health checks

#### API Keys
- [x] Generate API key (return only on creation)
- [x] List API keys (show prefix only)
- [x] Revoke API key
- [x] Key expiration dates
- [ ] Key rotation policy
- [ ] Usage tracking

#### Authorization
- [x] Role-based access control (OWNER/ADMIN/MEMBER/VIEWER)
- [x] Read access for all roles
- [x] Write access for OWNER/ADMIN/MEMBER
- [x] Cross-organization access prevented
- [ ] Fine-grained permissions
- [ ] Resource-level permissions

#### Input Validation
- [x] Name length validation (2-100 chars)
- [x] Description length validation (max 500 chars)
- [x] Enum validation (status, type, environment)
- [x] Required field validation
- [x] Whitespace trimming
- [x] Type validation
- [ ] Email format validation
- [ ] Password strength validation
- [ ] Custom validation rules

#### Error Handling
- [x] 400 Bad Request for validation errors
- [x] 401 Unauthorized for missing auth
- [x] 403 Forbidden for insufficient permissions
- [x] 404 Not Found for missing resources
- [x] 409 Conflict for duplicates
- [x] 500 Internal Server Error handling
- [x] Error message consistency
- [ ] Error logging and monitoring
- [ ] Sentry integration

#### Pagination
- [x] Default limit=10, max limit=100
- [x] Page minimum 1
- [x] Total count in response
- [x] totalPages calculation
- [ ] Cursor-based pagination (for large datasets)
- [ ] Sort options

#### Database
- [x] Indexed fields for queries
- [x] Compound indexes for multi-field queries
- [ ] Query performance monitoring
- [ ] N+1 query prevention
- [ ] Connection pooling

#### Security
- [x] Request size limit (10KB)
- [x] CORS configuration
- [x] Security headers
- [x] HTTP-only cookies
- [ ] Rate limiting per endpoint
- [ ] SQL injection prevention (using Mongoose)
- [ ] XSS prevention
- [ ] CSRF token validation

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- feature.validation.test.ts

# Run with coverage
npm test -- --coverage

# Run and report coverage
npm test -- --coverage --coverageReporters=text-summary
```

## Test Coverage Goals

- **Target**: 80% code coverage
- **Critical paths**: 100% coverage
  - Authentication
  - Authorization
  - Input validation
  - Error handling

## Mocking Strategy

### Database
```typescript
// Mock MongoDB
jest.mock('../database', () => ({
  Feature: {
    create: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
  }
}));
```

### HTTP Requests
```typescript
// Mock external APIs
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));
```

## Example Test Cases to Implement

### Feature Service Tests
```typescript
describe("Feature Service", () => {
  describe("createFeature", () => {
    it("should create feature and generate slug", async () => {
      // Test slug generation: "User Auth" → "user-auth"
    });

    it("should throw 409 on duplicate slug", async () => {
      // Test unique constraint enforcement
    });

    it("should verify organization ownership", async () => {
      // Test that feature is linked to correct org
    });
  });

  describe("getFeatures", () => {
    it("should paginate results correctly", async () => {
      // Test pagination math
    });

    it("should filter by organization", async () => {
      // Test org isolation
    });
  });
});
```

### Authorization Middleware Tests
```typescript
describe("Organization Middleware", () => {
  it("should allow OWNER access", () => {
    // Test OWNER role
  });

  it("should deny VIEWER for write operations", () => {
    // Test role restriction
  });

  it("should verify user is org member", () => {
    // Test membership check
  });
});
```

### Validation Tests
```typescript
describe("Input Validation", () => {
  it("should reject fields exceeding max length", () => {
    // Test boundary conditions
  });

  it("should accept boundary values", () => {
    // Test edge cases: 2 chars, 100 chars
  });
});
```

## Continuous Integration

```yaml
# .github/workflows/test.yml
name: Run Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test -- --coverage
      - run: npm run build
```

## Test Metrics to Track

- Code coverage percentage
- Test execution time
- Failing test rate
- Lines of code per test
- Test maintenance burden

## Future Enhancements

- [ ] E2E tests with Cypress/Playwright
- [ ] Performance benchmarks
- [ ] Load testing (Artillery, k6)
- [ ] Security scanning (OWASP ZAP)
- [ ] Dependency vulnerability scanning (npm audit)
- [ ] Code quality gates (SonarQube)
