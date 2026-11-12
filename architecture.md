# System Architecture

## High-level architecture

The client communicates with the REST API over HTTPS. The API validates requests, applies authentication and authorization, runs business logic, and reads/writes data through the data-access layer.

```mermaid
flowchart TD
    A[Web or Mobile Client] -->|HTTPS / JSON| B[REST API]
    B --> C[Authentication & Authorization]
    C --> D[Users Controller]
    C --> E[Tasks Controller]
    D --> F[User Service]
    E --> G[Task Service]
    F --> H[Data Access Layer]
    G --> H
    H --> I[(Database)]
```

## Resource relationship

```mermaid
erDiagram
    USERS ||--o{ TASKS : owns
    USERS {
        int id PK
        string name
        string email UK
        string passwordHash
        datetime createdAt
    }
    TASKS {
        int id PK
        int userId FK
        string title
        string description
        string status
        datetime dueDate
        datetime createdAt
        datetime updatedAt
    }
```

## Component responsibilities

- **Client:** Sends HTTP requests and displays API responses.
- **REST API:** Exposes versioned endpoints under `/api/v1`.
- **Authentication & Authorization:** Validates bearer tokens and checks resource ownership/roles.
- **Users Controller / Service:** Handles user registration, profile retrieval, updates, and deletion.
- **Tasks Controller / Service:** Handles task creation, listing, retrieval, updates, and deletion.
- **Data Access Layer:** Encapsulates database queries.
- **Database:** Persists users and tasks; each task references its owner through `userId`.

## Design decisions

- REST-style resource URLs use plural nouns: `/users` and `/tasks`.
- API versioning is included in the URL: `/api/v1`.
- Tasks belong to one user through the `userId` foreign key.
- Authentication is required for private user and task operations.
