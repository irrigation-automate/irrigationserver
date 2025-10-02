# Setup Guide

## Prerequisites

- Node.js 18+ (LTS recommended)
- MongoDB 6.0+
- Redis 7.0+
- npm 9.0+ or yarn 1.22+

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/irrigation-automate/irrigationserver.git
   cd irrigation-server
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory:
   ```env
   # Server
   NODE_ENV=development
   PORT=3000
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/irrigation_dev
   REDIS_URL=redis://localhost:6379
   
   # JWT
   JWT_SECRET=your-secret-key-here
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_EXPIRY=7d
   
   # Email (SMTP)
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your-email@example.com
   SMTP_PASS=your-email-password
   
   # Frontend URL (for CORS and email links)
   FRONTEND_URL=http://localhost:3000
   ```

## Database Setup

1. Start MongoDB service
2. Create a database named `irrigation_dev`
3. Start Redis server

## Running the Application

### Development Mode
```bash
npm run dev
# or
yarn dev
```

The server will be available at `http://localhost:3000`

### Production Mode
```bash
npm run build
npm start
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| NODE_ENV | No | development | Application environment |
| PORT | No | 3000 | Port to run the server |
| MONGODB_URI | Yes | - | MongoDB connection string |
| REDIS_URL | Yes | - | Redis connection URL |
| JWT_SECRET | Yes | - | Secret for JWT signing |
| ACCESS_TOKEN_EXPIRY | No | 15m | Access token expiry time |
| REFRESH_TOKEN_EXPIRY | No | 7d | Refresh token expiry time |
| SMTP_* | Yes | - | SMTP configuration |
| FRONTEND_URL | Yes | - | Frontend URL for CORS |

## Docker Setup

1. Make sure Docker and Docker Compose are installed
2. Run:
   ```bash
   docker-compose up -d
   ```

This will start:
- Node.js application
- MongoDB
- Redis
- MongoDB Express (admin UI on port 8081)

## Testing

Run the test suite:
```bash
npm test
# or
yarn test
```

Run tests with coverage:
```bash
npm run test:coverage
# or
yarn test:coverage
```

## Linting

```bash
npm run lint
# or
yarn lint
```

## Troubleshooting

### Common Issues

1. **Connection refused to MongoDB**
   - Make sure MongoDB is running
   - Check if the connection string is correct

2. **JWT errors**
   - Ensure JWT_SECRET is set in .env
   - Verify token expiration times

3. **Email not sending**
   - Check SMTP configuration
   - Verify network connectivity to SMTP server
