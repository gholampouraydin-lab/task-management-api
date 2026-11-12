# Initial API Contract

**Project:** Task Management API  
**Version:** 1.0.0  
**Base URL:** `/api/v1`  
**Format:** JSON  
**Authentication:** Bearer token (required for protected endpoints)

## 1. Resources

### User
| Field | Type | Required | Description |
|---|---|---:|---|
| id | integer | generated | Unique user identifier |
| name | string | yes | User's full name |
| email | string | yes | Unique email address |
| password | string | yes on creation | Hashed password; never returned |
| createdAt | string (ISO 8601) | generated | Creation timestamp |

### Task
| Field | Type | Required | Description |
|---|---|---:|---|
| id | integer | generated | Unique task identifier |
| userId | integer | yes | Owner user ID |
| title | string | yes | Short task title |
| description | string | no | Task details |
| status | string | generated/default | `todo`, `in_progress`, or `done` |
| dueDate | string (ISO 8601) | no | Optional deadline |
| createdAt | string (ISO 8601) | generated | Creation timestamp |
| updatedAt | string (ISO 8601) | generated | Last update timestamp |

## 2. Users Endpoints

| Method | Endpoint | Purpose | Success | Common error codes |
|---|---|---|---:|---|
| POST | `/users` | Register a user | 201 Created | 400, 409, 422 |
| GET | `/users` | List users (admin only) | 200 OK | 401, 403 |
| GET | `/users/{userId}` | Get one user | 200 OK | 401, 404 |
| PATCH | `/users/{userId}` | Update user profile | 200 OK | 400, 401, 403, 404, 422 |
| DELETE | `/users/{userId}` | Delete a user | 204 No Content | 401, 403, 404 |

## 3. Tasks Endpoints

| Method | Endpoint | Purpose | Success | Common error codes |
|---|---|---|---:|---|
| POST | `/tasks` | Create a task for the authenticated user | 201 Created | 400, 401, 422 |
| GET | `/tasks` | List the authenticated user's tasks | 200 OK | 401 |
| GET | `/tasks/{taskId}` | Get one task | 200 OK | 401, 404 |
| PATCH | `/tasks/{taskId}` | Update task fields/status | 200 OK | 400, 401, 404, 422 |
| DELETE | `/tasks/{taskId}` | Delete a task | 204 No Content | 401, 404 |

## 4. HTTP Status Code Definitions

- **200 OK:** Request completed successfully and returns a response body.
- **201 Created:** A resource was created successfully.
- **204 No Content:** Request succeeded; no response body is returned.
- **400 Bad Request:** Request syntax or parameters are invalid.
- **401 Unauthorized:** Authentication is missing or invalid.
- **403 Forbidden:** Authenticated user is not allowed to perform the action.
- **404 Not Found:** Requested resource does not exist or is not accessible.
- **409 Conflict:** Resource conflicts with existing data (for example, duplicate email).
- **422 Unprocessable Entity:** Request body failed validation.

## 5. Endpoint Method Details

- **GET** retrieves resources and must not modify server state.
- **POST** creates a new resource.
- **PATCH** partially updates an existing resource.
- **DELETE** removes a resource.

## 6. Example Requests and Responses

### Create user
```http
POST /api/v1/users
Content-Type: application/json

{
  "name": "Sara Ahmadi",
  "email": "sara@example.com",
  "password": "StrongPassword123"
}
```

**201 Created**
```json
{
  "id": 1,
  "name": "Sara Ahmadi",
  "email": "sara@example.com",
  "createdAt": "2026-11-12T10:00:00Z"
}
```

### Create task
```http
POST /api/v1/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete API assignment",
  "description": "Document Users and Tasks endpoints",
  "status": "todo"
}
```

**201 Created**
```json
{
  "id": 101,
  "userId": 1,
  "title": "Complete API assignment",
  "description": "Document Users and Tasks endpoints",
  "status": "todo",
  "createdAt": "2026-11-12T10:05:00Z",
  "updatedAt": "2026-11-12T10:05:00Z"
}
```

## 7. General Rules

1. All responses use JSON except responses with status `204`.
2. Passwords are stored as secure hashes and are never included in API responses.
3. A user can access only their own tasks; administrative access is required to list all users.
4. Task status must be one of `todo`, `in_progress`, or `done`.
5. All timestamps use ISO 8601 format in UTC.
6. This document is the initial contract; implementation details may be refined while preserving the documented API behavior.
