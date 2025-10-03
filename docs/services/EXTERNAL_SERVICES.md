# External Services Integration

## Table of Contents

- [Overview](#overview)
- [Weather Service](#weather-service)
- [Water Management](#water-management)
- [Geolocation](#geolocation)
- [Billing & Payments](#billing--payments)
- [Error Handling](#error-handling)

## Overview

This document outlines the integration with external services used by the irrigation system.

## Weather Service

### Weather Data Integration

```http
GET /api/v1/weather/current?lat={latitude}&lon={longitude}
```

**Response**

```json
{
  "success": true,
  "data": {
    "temperature": 22.5,
    "condition": "Clear",
    "humidity": 45,
    "windSpeed": 12.3,
    "windDirection": 180,
    "precipitation": 0,
    "solarRadiation": 850,
    "evapotranspiration": 4.2,
    "forecast": [
      {
        "date": "2025-10-03",
        "high": 24,
        "low": 18,
        "precipitationChance": 10,
        "condition": "Partly Cloudy"
      }
    ],
    "lastUpdated": "2025-10-02T14:30:00Z"
  }
}
```

### Weather-Based Adjustments

```http
GET /api/v1/irrigation/weather-adjustment?zoneId=zone-1
```

**Response**

```json
{
  "success": true,
  "data": {
    "zoneId": "zone-1",
    "recommendedDuration": 25,
    "adjustment": -5,
    "reason": "Recent rainfall detected",
    "nextWatering": "2025-10-03T06:00:00Z"
  }
}
```

## Water Management

### Water Usage Statistics

```http
GET /api/v1/water/usage?period=month&year=2025&month=10
```

**Response**

```json
{
  "success": true,
  "data": {
    "totalUsage": 1250.75,
    "byZone": [
      {
        "zoneId": "zone-1",
        "zoneName": "Front Lawn",
        "usage": 450.25,
        "percentage": 36
      },
      {
        "zoneId": "zone-2",
        "zoneName": "Back Garden",
        "usage": 800.5,
        "percentage": 64
      }
    ],
    "dailyAverage": 41.69,
    "comparison": {
      "previousPeriod": 1380.25,
      "change": -9.4
    },
    "waterSavings": {
      "amount": 129.5,
      "percentage": 9.4,
      "equivalent": 865 // Shower minutes saved
    }
  }
}
```

### Water Restrictions

```http
GET /api/v1/water/restrictions?lat=37.7749&lng=-122.4194
```

**Response**

```json
{
  "success": true,
  "data": {
    "restrictions": [
      {
        "type": "day",
        "description": "Watering only allowed on Tue, Thu, Sat",
        "active": true
      },
      {
        "type": "time",
        "description": "No watering between 10 AM - 6 PM",
        "active": true
      }
    ],
    "source": "Local Water District",
    "lastUpdated": "2025-10-01T00:00:00Z"
  }
}
```

## Geolocation

### Address to Coordinates

```http
GET /api/v1/geocode?address=1600+Amphitheatre+Parkway
```

**Response**

```json
{
  "success": true,
  "data": {
    "latitude": 37.4224764,
    "longitude": -122.0842499,
    "formattedAddress": "1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA",
    "components": {
      "streetNumber": "1600",
      "route": "Amphitheatre Parkway",
      "locality": "Mountain View",
      "administrativeArea": "CA",
      "postalCode": "94043",
      "country": "United States"
    }
  }
}
```

### Time Zone Information

```http
GET /api/v1/timezone?lat=37.7749&lng=-122.4194
```

**Response**

```json
{
  "success": true,
  "data": {
    "timeZoneId": "America/Los_Angeles",
    "timeZoneName": "Pacific Daylight Time",
    "gmtOffset": -25200,
    "isDst": true,
    "currentLocalTime": "2025-10-02T10:30:00-07:00"
  }
}
```

## Billing & Payments

### Get Water Bill

```http
GET /api/v1/billing/water
```

**Response**

```json
{
  "success": true,
  "data": {
    "currentBill": {
      "period": "October 2025",
      "dueDate": "2025-11-01",
      "amountDue": 85.75,
      "usage": 1250.75,
      "rate": 0.0686,
      "previousBalance": 0,
      "payments": 0,
      "newCharges": 85.75,
      "status": "unpaid"
    },
    "paymentHistory": [
      {
        "date": "2025-09-01",
        "amount": 78.5,
        "status": "paid",
        "method": "Credit Card"
      }
    ]
  }
}
```

## Error Handling

### 429 Too Many Requests

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "API rate limit exceeded. Please try again in 60 seconds.",
    "retryAfter": 60
  }
}
```

### 503 Service Unavailable

```json
{
  "success": false,
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "Weather service is currently unavailable",
    "retryable": true
  }
}
```

## Rate Limits

- 100 requests per hour per user for external API calls
- Caching is implemented to reduce external API calls
- Retry mechanism with exponential backoff for failed requests
