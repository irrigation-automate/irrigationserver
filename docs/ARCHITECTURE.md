# System Architecture

## High-Level Overview

```mermaid
graph TD
    A[Client] --> B[API Gateway]
    B --> C[Auth Service]
    B --> D[User Service]
    B --> E[Irrigation Service]
    C --> F[(MongoDB)]
    C --> G
    D --> F
    E --> F
    E --> G[(Redis)]
    E --> H[External Weather API]
```

## Components

### 1. API Gateway

- Entry point for all client requests
- Request routing and load balancing
- Rate limiting and request validation
- Authentication middleware

### 2. Auth Service

- User authentication and authorization
- JWT token management
- Session handling
- OAuth2 integration

### 3. User Service

- User profile management
- Role-based access control
- Account status management
- Audit logging

### 4. Irrigation Service

- Schedule management
- Zone control
- Weather integration
- Sensor data processing

## Data Flow

1. **Authentication Flow**
   - Client sends credentials to Auth Service
   - Service validates and issues tokens
   - Tokens are used for subsequent requests

2. **User Request Flow**
   - Request hits API Gateway
   - Gateway validates token and permissions
   - Request is routed to appropriate service
   - Service processes request and returns response

## Technology Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript

### Database

- **Primary**: MongoDB (Document Store)
- **Cache**: Redis
- **ORM**: Mongoose

### Infrastructure

- **Containerization**: Docker
- **Orchestration**: Kubernetes (optional)
- **CI/CD**: GitHub Actions

## Data Model Architecture

### Core Domain Models

```mermaid
classDiagram
    class User {
        +String id
        +String email
        +String firstName
        +String lastName
        +String role
        +Date createdAt
        +Date updatedAt
        +generateAuthToken()
    }

    class Pump {
        +String id
        +String name
        +String type
        +String status
        +Number flowRate
        +Number pressure
        +Object health
        +String[] zones
        +control(action, params)
    }

    class Zone {
        +String id
        +String name
        +String pumpId
        +String status
        +Number area
        +String vegetationType
        +String soilType
        +Coordinate[] coordinates
        +startIrrigation(duration)
        +stopIrrigation()
    }

    class Schedule {
        +String id
        +String zoneId
        +String type
        +Number[] days
        +String startTime
        +Number duration
        +Boolean enabled
        +Object weatherConditions
        +Date nextRun
        +calculateNextRun()
    }

    class Notification {
        +String id
        +String moduleName
        +String action
        +Object[] subscribe
        +String status
        +Object payload
        +send()
    }

    User "1" -- "*" Notification : receives
    Pump "1" -- "*" Zone : supplies
    Zone "1" -- "*" Schedule : has
    Zone "1" -- "*" Notification : generates
```

### Authentication & Authorization

```mermaid
classDiagram
    class User {
        +String id
        +String email
        +String passwordHash
        +String role
        +Boolean isActive
        +Date lastLogin
    }

    class Session {
        +String id
        +String userId
        +String refreshToken
        +String userAgent
        +String ipAddress
        +Date expiresAt
        +Boolean isValid()
    }

    class Permission {
        +String id
        +String name
        +String description
        +String[] roles
    }

    User "1" -- "*" Session : has
    User "1" -- "*" Permission : has
```

### Service Layer Architecture

```mermaid
classDiagram
    class IrrigationService {
        +PumpManager pumpManager
        +ZoneManager zoneManager
        +Scheduler scheduler
        +start()
        +stop()
    }

    class PumpManager {
        +Map~String, Pump~ pumps
        +addPump(config)
        +getPump(id)
        +controlPump(id, action)
    }

    class ZoneManager {
        +Map~String, Zone~ zones
        +createZone(config)
        +startZone(id, duration)
        +stopZone(id)
    }

    class Scheduler {
        +Map~String, Schedule~ schedules
        +addSchedule(config)
        +runScheduledJobs()
    }

    class NotificationService {
        +send(notification)
        +subscribe(userId, channel)
        +unsubscribe(userId, channel)
    }

    IrrigationService --> PumpManager
    IrrigationService --> ZoneManager
    IrrigationService --> Scheduler
    ZoneManager --> PumpManager
    Scheduler --> ZoneManager
    Scheduler --> NotificationService
```

### Database Schema Relationships

```mermaid
erDiagram
    USER ||--o{ SESSION : has
    USER ||--o{ NOTIFICATION : receives
    PUMP ||--o{ ZONE : supplies
    ZONE ||--o{ SCHEDULE : has
    ZONE ||--o{ WATER_USAGE : records
    USER ||--o{ USER_PREFERENCES : has
    NOTIFICATION ||--o{ NOTIFICATION_SUBSCRIBER : has

    USER {
        string _id
        string email
        string passwordHash
        string firstName
        string lastName
        string role
        date createdAt
        date updatedAt
    }

    SESSION {
        string _id
        string userId
        string refreshToken
        string userAgent
        string ipAddress
        date expiresAt
        date createdAt
    }

    PUMP {
        string _id
        string name
        string type
        string status
        number flowRate
        number pressure
        object health
        date lastActive
    }

    ZONE {
        string _id
        string name
        string pumpId
        string status
        number area
        string vegetationType
        string soilType
        array coordinates
        date lastWatered
    }

    SCHEDULE {
        string _id
        string zoneId
        string type
        array days
        string startTime
        number duration
        boolean enabled
        object weatherConditions
        date nextRun
    }

    NOTIFICATION {
        string _id
        string moduleName
        string action
        string status
        object payload
        date createdAt
    }

    NOTIFICATION_SUBSCRIBER {
        string _id
        string notificationId
        string userId
        date seenAt
    }
```

## Security Considerations

- All communications use HTTPS
- JWT tokens with short expiration
- Rate limiting on authentication endpoints
- Input validation and sanitization
- Regular security audits

## Scalability

- Stateless services for horizontal scaling
- Database sharding for large datasets
- Caching layer for frequently accessed data
- Message queues for async processing
