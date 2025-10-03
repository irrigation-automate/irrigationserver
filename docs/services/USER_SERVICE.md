# User Service

## Table of Contents

- [Overview](#overview)
- [Data Models](#data-models)
- [Endpoints](#endpoints)
  - [1. Get User Profile](#1-get-user-profile)
  - [2. Update User Information](#2-update-user-information)
  - [3. Change Password](#3-change-password)
  - [4. Update Address](#4-update-address)
  - [5. Deactivate Account](#5-deactivate-account)
- [Error Handling](#error-handling)

## Overview

The User Service manages user profiles, including personal information, authentication, and account settings. It handles user data across multiple related collections for better data organization and security.

## Data Models

### 1. User (IUserSchema)

```typescript
interface IUserSchema {
  _id: string;
  address?: Schema.Types.ObjectId | IUserAddressSchema['_id'];
  blocked: boolean; // Account status
  contact: Schema.Types.ObjectId | IUserContactSchema['_id'];
  creation_date: Date;
  password: Schema.Types.ObjectId | IUserPasswordSchema['_id'];
  weather?: Schema.Types.ObjectId | string; // Weather preferences
  reglage?: Schema.Types.ObjectId | string; // User settings
}
```

### 2. User Contact (IUserContactSchema)

```typescript
interface IUserContactSchema {
  _id: string;
  email: string; // Unique email address
  firstName: string; // User's first name
  lastName: string; // User's last name
  last_update: Date; // Last update timestamp
}
```

### 3. User Address (IUserAddressSchema)

```typescript
interface IUserAddressSchema {
  _id: string;
  city: string; // City of residence
  street: string; // Street address
  country: string; // Default: "Tunisia"
  codeZip: number; // Postal/ZIP code
  last_update: Date; // Last update timestamp
}
```

### 4. User Password (IUserPasswordSchema)

```typescript
interface IUserPasswordSchema {
  _id: string;
  password: string; // Hashed password
  last_update: Date; // Last password change
}
```

## Endpoints

### 1. Get User Profile

Retrieves the authenticated user's complete profile information.

```http
GET /api/v1/users/me
```

**Response**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "address": {
      "city": "Tunis",
      "street": "123 Main Street",
      "country": "Tunisia",
      "codeZip": 1001
    },
    "blocked": false,
    "creation_date": "2025-10-01T12:00:00Z"
  }
}
```

### 2. Update User Information

Updates the user's contact information.

```http
PATCH /api/v1/users/me
```

**Request Body**

```json
{
  "firstName": "John",
  "lastName": "Updated"
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Updated",
    "last_update": "2025-10-02T14:30:00Z"
  }
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Updated",
    "email": "user@example.com",
    "phone": "+1234567890",
    "avatar": "https://storage.example.com/avatars/507f1f77bcf86cd799439011.jpg"
  }
}
```

### 3. Update Password

```http
PATCH /api/v1/users/me/password
```

**Request Body**

```json
{
  "currentPassword": "OldSecurePass123!",
  "newPassword": "NewSecurePass456!"
}
```

**Response**

```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

### 4. Upload Profile Picture

```http
POST /api/v1/users/me/avatar
Content-Type: multipart/form-data
```

**Form Data**

```
avatar: [binary file]
```

**Response**

### 3. Change Password

Updates the user's password.

```http
PATCH /api/v1/users/me/password
```

**Request Body**

```json
{
  "currentPassword": "oldSecurePassword123",
  "newPassword": "newSecurePassword456"
}
```

**Response**

```json
{
  "success": true,
  "message": "Password updated successfully",
  "last_update": "2025-10-02T15:00:00Z"
}
```

### 4. Update Address

Updates the user's address information.

```http
PATCH /api/v1/users/me/address
```

**Request Body**

```json
{
  "street": "456 New Street",
  "city": "Sousse",
  "codeZip": 4000
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "city": "Sousse",
    "street": "456 New Street",
    "country": "Tunisia",
    "codeZip": 4000,
    "last_update": "2025-10-02T15:30:00Z"
  }
}
```

### 5. Deactivate Account

Deactivates the user's account.

```http
DELETE /api/v1/users/me
```

**Response**

```json
{
  "success": true,
  "message": "Account deactivated successfully"
}
```

## Error Handling

### Common Error Responses

#### 400 Bad Request

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": "Invalid email format"
    }
  }
}
```

#### 401 Unauthorized

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

#### 403 Forbidden

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions"
  }
}
```

#### 404 Not Found

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found"
  }
}
```

## Security Considerations

1. **Authentication**: All endpoints require a valid JWT token
2. **Authorization**: Users can only modify their own data
3. **Password Security**:
   - Passwords are hashed using bcrypt
   - Minimum length and complexity requirements
   - Password history check
4. **Rate Limiting**: Protection against brute force attacks
5. **Data Validation**: All inputs are validated before processing

````

### Change Password DTO
```typescript
interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
````

## Error Handling

### 400 Bad Request

```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Current password is incorrect"
  }
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found"
  }
}
```

### 413 Payload Too Large

```json
{
  "success": false,
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "Avatar must be less than 5MB"
  }
}
```

## Rate Limiting

- 10 requests per minute per endpoint
- Stricter limits for password-related endpoints
