# DevConnect Database ER Diagram


erDiagram
    USER ||--o{ PROJECT : creates
    USER ||--o{ BLOG_POST : publishes
    USER ||--o{ SKILL : possesses

    USER ||--o{ ENDORSEMENT : gives
    USER ||--o{ ENDORSEMENT : receives
    SKILL ||--o{ ENDORSEMENT : receives

    USER ||--o{ CONNECTION : requests
    USER ||--o{ CONNECTION : receives

    USER ||--o{ ACTIVITY : owns
    USER ||--o{ ACTIVITY : performs

    USER {
        string id PK
        string name
        string email UK
        string password
        string bio
        string location
        string avatar
        datetime createdAt
        datetime updatedAt
    }

    PROJECT {
        string id PK
        string title
        string description
        string[] techStack
        string liveUrl
        string repositoryUrl
        string userId FK
        datetime createdAt
        datetime updatedAt
    }

    BLOG_POST {
        string id PK
        string title
        string slug UK
        string content
        string excerpt
        string coverImage
        boolean published
        string userId FK
        datetime createdAt
        datetime updatedAt
    }

    SKILL {
        string id PK
        string name
        string level
        string userId FK
        datetime createdAt
    }

    ENDORSEMENT {
        string id PK
        string message
        string fromUserId FK
        string toUserId FK
        string skillId FK
        datetime createdAt
    }

    CONNECTION {
        string id PK
        string requesterId FK
        string receiverId FK
        ConnectionStatus status
        datetime createdAt
        datetime updatedAt
    }

    ACTIVITY {
        string id PK
        string userId FK
        string actorId FK
        string type
        string message
        string entityId
        datetime createdAt
    }


## Connection Status

The `ConnectionStatus` enum supports three states:

- `PENDING`
- `ACCEPTED`
- `REJECTED`

## Database Technology

- PostgreSQL
- Prisma ORM
- Neon PostgreSQL