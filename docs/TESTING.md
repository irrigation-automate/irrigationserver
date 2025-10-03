# Testing Strategy

## Test Types

### 1. Unit Tests

- Test individual functions and components in isolation
- No external dependencies
- Fast execution

### 2. Integration Tests

- Test interactions between components
- May use test databases
- Mock external services

### 3. E2E Tests

- Test complete user flows
- Use real services in test environment
- Simulate user interactions

## Test Structure

```
__tests__/
├── unit/
│   ├── services/
│   │   ├── auth.service.test.ts
│   │   └── user.service.test.ts
│   └── utils/
│       └── validation.test.ts
├── integration/
│   ├── api/
│   │   ├── auth.test.ts
│   │   └── users.test.ts
│   └── services/
│       └── email.service.test.ts
└── e2e/
    ├── auth.flow.test.ts
    └── user.flow.test.ts
```

## Running Tests

### Run All Tests

```bash
npm test
# or
yarn test
```

### Run Specific Test File

```bash
npm test __tests__/unit/services/auth.service.test.ts
# or
yarn test __tests__/unit/services/auth.service.test.ts
```

### Run Tests with Coverage

```bash
npm run test:coverage
# or
yarn test:coverage
```

## Test Data

### Test Database

- Uses a separate MongoDB database (`irrigation_test`)
- Database is cleared before each test
- Each test should create its own test data

### Test Users

```typescript
const testUser = {
  email: 'test@example.com',
  password: 'TestPass123!',
  name: 'Test User',
};
```

## Mocking

### External Services

- Use Jest's mocking capabilities
- Mock HTTP requests with `nock`
- Mock database calls when appropriate

### Example: Mocking an Email Service

```typescript
jest.mock('../../src/services/email.service', () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
}));
```

## Test Coverage

### Minimum Coverage Requirements

- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

### Viewing Coverage Report

After running tests with coverage, open:

```
coverage/lcov-report/index.html
```

## Writing Tests

### Best Practices

1. **Arrange-Act-Assert (AAA) Pattern**

   ```typescript
   // Arrange
   const userData = { email: 'test@example.com', password: 'pass123' };

   // Act
   const result = await authService.register(userData);

   // Assert
   expect(result).toHaveProperty('id');
   expect(result.email).toBe(userData.email);
   ```

2. **Test Naming**
   - Use descriptive test names
   - Follow pattern: `should [expected behavior] when [condition]`

   ```typescript
   it('should throw error when email is already registered', async () => {
     // test implementation
   });
   ```

3. **Test Isolation**
   - Each test should be independent
   - Use `beforeEach` and `afterEach` for setup/teardown
   - Clean up test data after tests

## Integration with CI/CD

Tests are automatically run on:

- Pull requests
- Pushes to main branch
- Before deployment

## Performance Testing

### Load Testing

- Use tools like k6 or Artillery
- Test critical paths under load
- Monitor response times and error rates

### Example k6 Script

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const res = http.get('http://localhost:3000/api/health');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
```

## Security Testing

### OWASP ZAP

- Run security scans
- Identify vulnerabilities
- Generate reports

### Dependency Scanning

- Use `npm audit`
- Keep dependencies updated
- Monitor for security advisories
