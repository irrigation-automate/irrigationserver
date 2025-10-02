# Authentication Flow

## Architecture Overview

### Directory Structure
```
src/
├── modules/
│   └── auth/
│       ├── controllers/
│       │   ├── auth.controller.ts
│       │   └── admin.controller.ts
│       ├── services/
│       │   ├── auth.service.ts
│       │   ├── token.service.ts
│       │   └── email.service.ts
│       ├── routes/
│       │   ├── auth.routes.ts
│       │   └── admin.routes.ts
│       ├── middleware/
│       │   └── auth.middleware.ts
│       └── interfaces/
│           └── auth.interface.ts
```

### Key Components

#### Controllers
- `AuthController`
  - `register()`: Handle user registration
  - `login()`: Handle user login
  - `verifyEmail()`: Verify email address
  - `forgotPassword()`: Initiate password reset
  - `resetPassword()`: Complete password reset

- `AdminController`
  - `approveUser()`: Approve user registration
  - `listPendingUsers()`: List users pending approval

#### Services
- `AuthService`
  - `registerUser()`: Create new user
  - `verifyUserEmail()`: Verify user's email
  - `loginUser()`: Authenticate user
  - `requestPasswordReset()`: Initiate password reset
  - `resetPassword()`: Update user password

- `TokenService`
  - `generateAuthTokens()`: Generate access & refresh tokens
  - `verifyToken()`: Verify token validity
  - `blacklistToken()`: Invalidate token

- `EmailService`
  - `sendVerificationEmail()`: Send email verification
  - `sendPasswordResetEmail()`: Send password reset email
  - `sendAccountApprovedEmail()`: Notify user of approval

#### Routes
```typescript
// auth.routes.ts
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

// admin.routes.ts
router.use(requireAdmin);
router.get('/users/pending', adminController.listPendingUsers);
router.patch('/users/:userId/approve', adminController.approveUser);
```

## User Registration & Activation

```mermaid
sequenceDiagram
    participant User
    participant MobileApp
    participant AuthController
    participant AuthService
    participant EmailService
    participant Database
    participant Admin
    participant TokenService 
    participant NotificationService
    participant SecureStore
    
    %% Registration Flow
    User->>MobileApp: 1. Open App & Submit Registration Form
    MobileApp->>AuthController: 2. POST /auth/register
    AuthController->>AuthService: 3. Validate input & hash password
    AuthService->>Database: 4. Create User (status: pending)
    Database-->>AuthService: 5. User Created
    AuthService->>TokenService: 6. Generate Email Verification Token
    TokenService-->>AuthService: 7. Token Generated
    AuthService->>EmailService: 8. Send Verification Email
    EmailService-->>User: 9. Verification Email Sent
    
    %% Email Verification
    User->>AuthController: 10. GET /auth/verify-email/:token
    AuthController->>AuthService: 11. Verify Token
    AuthService->>TokenService: 12. Validate Token
    TokenService-->>AuthService: 13. Token Valid
    AuthService->>Database: 14. Update User (emailVerified: true)
    Database-->>AuthService: 15. User Updated
    AuthService-->>AuthController: 16. Email Verified
    AuthController-->>User: 17. Show Email Verified Page
    
    %% Admin Approval
    AuthService->>NotificationService: 18. Notify Admin (New User Pending)
    NotificationService-->>Admin: 19. Send Notification
    Admin->>AdminController: 20. GET /admin/users/pending
    AdminController->>Database: 21. Query Pending Users
    Database-->>AdminController: 22. Return Pending Users
    AdminController-->>Admin: 23. Show Pending Users
    
    Admin->>AdminController: 24. PATCH /admin/users/:userId/approve
    AdminController->>AuthService: 25. Process Approval
    AuthService->>Database: 26. Update User (status: approved)
    Database-->>AuthService: 27. User Approved
    AuthService->>EmailService: 28. Send Activation Email
    EmailService-->>User: 29. Account Activated Email
    
    %% Login Flow
    User->>MobileApp: 30. Enter Credentials & Submit
    MobileApp->>AuthController: 31. POST /auth/login
    AuthController->>AuthService: 32. Validate Input
    AuthService->>Database: 33. Find User by Email
    Database-->>AuthService: 34. User Found
    AuthService->>AuthService: 35. Verify Password
    AuthService->>AuthService: 36. Check Account Status
    
    alt Account Approved
        AuthService->>TokenService: 37. Generate Tokens
        TokenService-->>AuthService: 38. Tokens Generated
        AuthService->>Database: 39. Save Refresh Token
        Database-->>AuthService: 40. Token Saved
        AuthService-->>AuthController: 41. Return User & Tokens
        AuthController-->>MobileApp: 42. HTTP 200: { user, tokens }
        MobileApp->>SecureStore: 43. Store Tokens
        SecureStore-->>MobileApp: 44. Tokens Stored
        MobileApp-->>User: 45. Show Dashboard
    else Account Pending
        AuthService-->>AuthController: 46. Throw AccountNotApprovedError
        AuthController-->>MobileApp: 47. HTTP 403: { error: 'Account pending approval' }
        MobileApp-->>User: 48. Show Pending Approval Message
    end
```

## Password Reset Flow

```mermaid
sequenceDiagram
    participant User
    participant MobileApp
    participant AuthService
    participant EmailService
    participant Database
    
    %% Request Password Reset
    User->>+MobileApp: 1. Click 'Forgot Password'
    MobileApp->>+AuthService: 2. POST /auth/forgot-password
    AuthService->>+Database: 3. Find User by Email
    Database-->>-AuthService: 4. User Found
    AuthService->>+Database: 5. Create Reset Token
    Database-->>-AuthService: 6. Token Created
    AuthService->>+EmailService: 7. Send Password Reset Email
    EmailService-->>-User: 8. Password Reset Email
    
    %% Reset Password
    User->>+AuthService: 9. Open Reset Link
    AuthService->>+Database: 10. Validate Token
    Database-->>-AuthService: 11. Token Valid
    AuthService-->>-User: 12. Show Reset Password Form
    
    User->>+AuthService: 13. Submit New Password
    AuthService->>+Database: 14. Update Password
    Database-->>-AuthService: 15. Password Updated
    AuthService->>+EmailService: 16. Send Password Changed Notification
    EmailService-->>-User: 17. Password Changed Email
    AuthService-->>-User: 18. Redirect to Login
```

## Service Interactions

### Auth Service
- Handles user authentication
- Manages user sessions
- Validates tokens
- Coordinates with Email Service

### Email Service
- Sends verification emails
- Handles password reset emails
- Sends account status updates
- Manages email templates

### Database
- Stores user credentials
- Manages verification tokens
- Tracks account status
- Maintains session information
