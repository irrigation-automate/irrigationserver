# Irrigation Server

> **Note**: This project uses TypeScript and generates build artifacts in the `dist/` directory. 
> The `dist/` directory is intentionally excluded from version control. Always build the project 
> locally before running in production environments.

A robust backend server for irrigation automation systems, built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Features

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

## 🛠 Development

### Cleaning Build Artifacts

To clean build artifacts and reinstall dependencies:

```bash
./scripts/clean-build.sh
```

This script will:
1. Remove `dist/` and `build/` directories
2. Remove TypeScript build info
3. Clean and reinstall node modules

### Build Process

1. **Development** (with hot-reload):
   ```bash
   npm run dev
   ```

2. **Production Build**:
   ```bash
   npm run build
   ```

3. **Production Start**:
   ```bash
   npm start
   ```

## 🧪 Testing

Run tests with:

```bash
npm test
```

## 🔒 Environment Variables

Create a `.env` file in the project root with the following variables:

```env
PORT=5000
mongoDbUserName=your_username
mongoDbPassword=your_password
mongoDbDatabase=your_database
JWTSecret=your_jwt_secret
```

- **RESTful API** for irrigation system management
- **JWT Authentication** for secure access
- **MongoDB** for data persistence
- **TypeScript** for type safety
- **Environment-based configuration**
- **CORS** enabled
- **Testing** with Jest
- **Linting** with ESLint
- **Hot-reloading** in development
- **API Documentation** with Swagger UI

## 🛠️ Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB Atlas account or local MongoDB instance
- [Optional] Swagger Editor (for viewing/editing OpenAPI specs)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd irrigationserver
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
mongoDbUserName=your_mongodb_username
mongoDbPassword=your_mongodb_password
mongoDbDatabase=your_database_name
JWTSecret=your_jwt_secret_key
```

### 4. Running the Application

**Development Mode**
```bash
npm run dev
```
This will start the server with hot-reloading enabled.

**Production Build**
```bash
# Build the application
npm run build

# Start the server
npm start
```

## 📚 API Documentation

This project uses Swagger for API documentation. The documentation is automatically generated from JSDoc comments in your route handlers.

### Viewing Documentation

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000/api-docs
   ```
   (Replace 3000 with your configured PORT if different)

### Generating Documentation

To generate the Swagger documentation file:

```bash
npm run swagger:generate
```

For automatic regeneration when files change:

```bash
npm run swagger:serve
```

### Documenting Your API

Add JSDoc comments to your route handlers to automatically generate documentation. Example:

```typescript
/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Returns a list of users
 *     description: Returns a list of all users in the system
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get('/api/users', (req, res) => {
  // Your route handler code
});
```

### Documenting Models

Define your models in the Swagger configuration or use JSDoc comments:

```typescript
/**
 * @typedef {object} User
 * @property {string} id.required - The user ID
 * @property {string} username.required - The username
 * @property {string} email.required - The user's email
 * @property {string} role - The user's role
 */
```

## 🔒 Authentication

Most endpoints require authentication. Include the JWT token in the `Authorization` header:

```
Authorization: Bearer your-jwt-token
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

For test coverage:

```bash
npm test -- --coverage
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

| Variable          | Description                     | Required | Default |
|-------------------|---------------------------------|----------|---------|
| PORT              | Server port                     | No       | 3000    |
| mongoDbUserName   | MongoDB Atlas username          | Yes      | -       |
| mongoDbPassword   | MongoDB Atlas password          | Yes      | -       |
| mongoDbDatabase   | MongoDB database name           | Yes      | -       |
| JWTSecret        | Secret key for JWT tokens       | Yes      | -       |

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
