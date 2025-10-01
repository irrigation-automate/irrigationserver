# 🌱 Irrigation Server

> **Note**: This project uses TypeScript and generates build artifacts in the `dist/` directory.
> The `dist/` directory is intentionally excluded from version control. Always build the project
> locally before running in production environments.

A robust backend server for irrigation automation systems, built with Node.js, Express, TypeScript, and MongoDB, following clean architecture principles.

## 🏗️ Project Structure

```
src/
├── Controllers/         # Request handlers
│   └── health.controller.ts
├── Models/             # Database models
├── Routes/             # Route definitions
│   ├── health.ts
│   └── tests/
├── Services/           # Business logic
│   └── health.service.ts
├── utils/              # Utility functions
└── index.ts            # Application entry point
```

## 🚀 Features

### Health Check Endpoints

The server provides comprehensive health monitoring through the following endpoints:

#### 1. Health Check

- **Endpoint**: `GET /health`
- **Description**: Provides detailed health status of the application
- **Response**:
  ```json
  {
    "success": true,
    "message": "Health check successful",
    "data": {
      "status": "UP",
      "timestamp": "2023-01-01T00:00:00.000Z",
      "uptime": 3600,
      "database": {
        "status": "CONNECTED",
        "responseTime": 10
      },
      "memory": {
        "rss": "100.00 MB",
        "heapTotal": "50.00 MB",
        "heapUsed": "30.00 MB",
        "external": "20.00 MB"
      }
    },
    "timestamp": "2023-01-01T00:00:00.000Z"
  }
  ```

#### 2. Readiness Probe

- **Endpoint**: `GET /health/readiness`
- **Description**: Used by Kubernetes to check if the application is ready to receive traffic
- **Success Response (200)**:
  ```json
  {
    "status": "UP",
    "timestamp": "2023-01-01T00:00:00.000Z"
  }
  ```
- **Error Response (503)**:
  ```json
  {
    "status": "DOWN",
    "timestamp": "2023-01-01T00:00:00.000Z",
    "database": {
      "status": "ERROR",
      "error": "Connection failed"
    }
  }
  ```

#### 3. Liveness Probe

- **Endpoint**: `GET /health/liveness`
- **Description**: Used by Kubernetes to check if the application is running
- **Response**:
  ```json
  {
    "status": "UP",
    "timestamp": "2023-01-01T00:00:00.000Z"
  }
  ```

### API Documentation with Swagger

This project includes automated API documentation using Swagger/OpenAPI. The documentation is automatically generated from your route handlers and TypeScript types.

**Access the documentation:**

- **Development**: http://localhost:5000/api-docs
- **API Spec**: http://localhost:5000/swagger.json

#### Generating Documentation

To update the API documentation:

```bash
# Generate Swagger documentation
npm run swagger:generate

# Auto-generate on file changes
npm run swagger:serve
```

#### Documenting Endpoints

Document your endpoints using JSDoc comments in your route handlers:

```typescript
/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Returns a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get('/api/users', (req, res) => {
  // Your route handler
});
```

## 🧪 Testing

The project includes a comprehensive test suite using Jest and Supertest for both unit and integration testing. The test structure follows the same organization as the source code.

### Test Structure

```
__tests__/
├── Controllers/         # Controller tests
├── Services/            # Service layer tests
├── configs/             # Configuration tests
├── models/              # Model tests
├── routes/              # Route tests
├── server.spec.ts       # Main server tests
├── serverModule.spec.ts # Server module tests
└── utils/               # Utility function tests
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run a specific test file
npm test -- path/to/test/file.spec.ts

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

The test suite provides comprehensive coverage for:

- Server startup and shutdown
- Database connections
- API endpoints
- Error handling
- Middleware
- Utility functions

To view the coverage report, run `npm run test:coverage` and open `coverage/lcov-report/index.html` in your browser.

### Writing Tests

When adding new features, please include corresponding tests. Follow these patterns:

1. **Unit Tests**: Test individual functions in isolation
2. **Integration Tests**: Test interactions between components
3. **E2E Tests**: Test complete API endpoints

Example test structure:

```typescript
describe('Feature', () => {
  beforeAll(() => {
    // Setup code
  });

  afterEach(() => {
    // Cleanup after each test
    jest.clearAllMocks();
  });

  describe('when condition', () => {
    it('should do something', async () => {
      // Test implementation
      expect(result).toBe(expected);
    });
  });
});
```

### Mocking

Use Jest's mocking capabilities for external dependencies:

```typescript
// Mock external modules
jest.mock('module-name');

// Mock function implementation
const mockFunction = jest.fn().mockResolvedValue(mockData);

// Mock class
jest.mock('class-name', () => ({
  ClassName: jest.fn().mockImplementation(() => ({
    method: jest.fn().mockResolvedValue(mockData),
  })),
}));
```

## 📚 API Documentation

### Accessing Documentation

- **Development**: http://localhost:5000/api-docs
- **Production**: `https://your-domain.com/api-docs`
- **OpenAPI Spec**: `/swagger.json`

### Generating Documentation

```bash
# Generate Swagger documentation
npm run swagger:generate

# Auto-generate on file changes
npm run swagger:serve
```

### Documenting Endpoints

Document your endpoints using JSDoc comments in your route handlers:

```typescript
/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Returns a list of users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of users to return
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
```

### Example Model Definition

```typescript
/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The username
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           default: user
 */
```

## 🛠 Development

### Prerequisites

- Node.js 18+
- MongoDB 6.0+
- npm 9+

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
4. Update the `.env` file with your configuration

### Development Workflow

1. Start the development server:

   ```bash
   npm run dev
   ```

   The server will be available at `http://localhost:5000`

2. Run tests:

   ```bash
   # Run all tests
   npm test

   # Run tests in watch mode
   npm run test:watch

   # Generate test coverage
   npm run test:coverage
   ```

3. Build for production:
   ```bash
   npm run build
   npm start
   ```

### NPM Scripts

| Script             | Description                                |
| ------------------ | ------------------------------------------ |
| `dev`              | Start development server with hot-reload   |
| `build`            | Compile TypeScript to JavaScript           |
| `start`            | Start production server                    |
| `test`             | Run all tests                              |
| `test:watch`       | Run tests in watch mode                    |
| `test:coverage`    | Generate test coverage report              |
| `lint`             | Run ESLint                                 |
| `lint:fix`         | Fix linting issues                         |
| `swagger:generate` | Generate Swagger documentation             |
| `swagger:serve`    | Auto-generate Swagger docs on file changes |

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/irrigation

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

## 🚀 Deployment

### Production Build

1. Install production dependencies:

   ```bash
   npm ci --only=production
   ```

2. Build the application:

   ```bash
   npm run build
   ```

3. Start the production server:
   ```bash
   NODE_ENV=production node dist/index.js
   ```

### Docker

A `Dockerfile` is provided for containerized deployments:

```bash
# Build the Docker image
docker build -t irrigation-server .

# Run the container
docker run -d \
  --name irrigation-server \
  -p 5000:5000 \
  --env-file .env \
  --restart unless-stopped \
  irrigation-server
```

### Kubernetes

The health check endpoints are compatible with Kubernetes:

```yaml
livenessProbe:
  httpGet:
    path: /health/liveness
    port: 5000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health/readiness
    port: 5000
  initialDelaySeconds: 5
  periodSeconds: 5
```

### Environment Variables

| Variable         | Required | Default       | Description                          |
| ---------------- | -------- | ------------- | ------------------------------------ |
| `PORT`           | No       | `5000`        | Port to run the server on            |
| `NODE_ENV`       | No       | `development` | Environment (development/production) |
| `MONGODB_URI`    | Yes      | -             | MongoDB connection string            |
| `JWT_SECRET`     | Yes      | -             | Secret for JWT signing               |
| `JWT_EXPIRES_IN` | No       | `7d`          | JWT expiration time                  |

## 🔒 Authentication

Most endpoints require authentication. Include the JWT token in the `Authorization` header:

```
Authorization: Bearer your-jwt-token
```

## 🧪 Testing

The project uses Jest for testing with a focus on:

- Unit tests for services and utilities
- Integration tests for API endpoints
- Mocking external dependencies

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage
npm run test:coverage

# Run specific test file
npm test -- path/to/test/file.spec.ts
```

### Test Structure

```
__tests__/
├── health.spec.ts       # Health check tests
└── test.spec.ts         # General API tests
```

### Writing Tests

Example test suite:

```typescript
describe('User Service', () => {
  beforeEach(() => {
    // Setup test data and mocks
  });

  afterEach(() => {
    // Clean up
    jest.clearAllMocks();
  });

  it('should create a new user', async () => {
    // Test implementation
  });
});
```

## 🧪 Running Tests

```bash
npm test
```

## 🧹 Linting

```bash
# Check for linting errors
npm run lint

# Fix linting errors
npm run lint:fix
```

## 📂 Project Structure

```
src/
├── Models/          # Database models
├── Routes/          # API route handlers
├── configs/         # Configuration files
├── interface/       # TypeScript interfaces
└── validations/     # Request validation
```

## 🔒 Environment Variables

| Variable        | Description               | Required | Default |
| --------------- | ------------------------- | -------- | ------- |
| PORT            | Server port               | No       | 3000    |
| mongoDbUserName | MongoDB Atlas username    | Yes      | -       |
| mongoDbPassword | MongoDB Atlas password    | Yes      | -       |
| mongoDbDatabase | MongoDB database name     | Yes      | -       |
| JWTSecret       | Secret key for JWT tokens | Yes      | -       |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For any inquiries, please contact the project maintainer.
