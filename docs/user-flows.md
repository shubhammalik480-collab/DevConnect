# DevConnect – User Flow Diagrams

## 1. User Registration and Login Flow

This flow describes how users register, log in, and access the DevConnect platform.

```mermaid
flowchart TD
    A([Start]) --> B[Open DevConnect]
    B --> C{Existing User?}
    C -->|No| D[Open Registration Page]
    D --> E[Enter Name, Email and Password]
    E --> F[Submit Registration]
    F --> G{Valid Details?}
    G -->|No| E
    G -->|Yes| H[Create User Account]
    H --> I[Set Authentication Cookie]
    C -->|Yes| J[Open Login Page]
    J --> K[Enter Email and Password]
    K --> L[Submit Login]
    L --> M{Credentials Valid?}
    M -->|No| K
    M -->|Yes| I
    I --> N[Access Dashboard]
    N --> O([End])
```

## 2. GitHub OAuth Login Flow

This flow describes authentication through GitHub.

```mermaid
flowchart TD
    A([Start]) --> B[Click Login with GitHub]
    B --> C[Redirect to GitHub OAuth]
    C --> D[User Authorizes Application]
    D --> E[GitHub OAuth Callback]
    E --> F{Authentication Successful?}
    F -->|No| G[Redirect to Login Page]
    F -->|Yes| H[Set Authentication Cookie]
    H --> I[Redirect to DevConnect Homepage]
    G --> J([End])
    I --> J
```

## 3. Developer Profile and Project Management Flow

This flow describes how an authenticated developer manages their profile and projects.

```mermaid
flowchart TD
    A([Start]) --> B[Login]
    B --> C[Open Developer Dashboard]
    C --> D{Select Action}
    D -->|Profile| E[View Profile]
    E --> F[Update Profile Details]
    F --> G[Save Profile]
    D -->|Image| H[Upload Profile Image]
    H --> I[Validate Image]
    I --> J[Upload Image to Cloudinary]
    J --> K[Update Profile Avatar]
    D -->|Projects| L[Open Projects]
    L --> M{Select Project Action}
    M -->|Create| N[Enter Project Details]
    N --> O[Save Project]
    M -->|View| P[View Project Details]
    M -->|Update| Q[Edit Project]
    Q --> R[Save Changes]
    M -->|Delete| S[Delete Project]
    G --> T([End])
    K --> T
    O --> T
    P --> T
    R --> T
    S --> T
```

## 4. Blog Management Flow

This flow describes creating, viewing, and updating blog posts.

```mermaid
flowchart TD
    A([Start]) --> B[Login]
    B --> C[Open Blog Section]
    C --> D{Select Action}
    D -->|Create Blog| E[Enter Title and Content]
    E --> F[Add Optional Excerpt and Cover Image]
    F --> G{Publish Blog?}
    G -->|Yes| H[Save as Published]
    G -->|No| I[Save as Draft]
    H --> J[Generate Blog Slug]
    I --> J
    J --> K[Store Blog in Database]
    D -->|View Blogs| L[Fetch Published and Own Blogs]
    L --> M[Open Blog]
    D -->|Update Blog| N[Edit Existing Blog]
    N --> O[Save Updated Blog]
    K --> P([End])
    M --> P
    O --> P
```

## 5. Developer Connection Flow

This flow describes sending, accepting, and rejecting connection requests.

```mermaid
flowchart TD
    A([Start]) --> B[Login]
    B --> C[Search Developers]
    C --> D[Open Developer Profile]
    D --> E[Send Connection Request]
    E --> F{Request Valid?}
    F -->|No| G[Display Error]
    F -->|Yes| H[Create Pending Request]
    H --> I[Notify Receiver]
    I --> J[Receiver Opens Pending Requests]
    J --> K{Accept Request?}
    K -->|Yes| L[Update Status to Accepted]
    K -->|No| M[Update Status to Rejected]
    L --> N[Notify Original Requester]
    G --> O([End])
    N --> O
    M --> O
```

## 6. Skill Endorsement Flow

This flow describes how developers endorse another developer's skills.

```mermaid
flowchart TD
    A([Start]) --> B[Login]
    B --> C[Search or Open Developer Profile]
    C --> D[View Developer Skills]
    D --> E[Select a Skill]
    E --> F[Submit Endorsement]
    F --> G{Own Skill?}
    G -->|Yes| H[Display Validation Error]
    G -->|No| I{Already Endorsed?}
    I -->|Yes| J[Display Duplicate Error]
    I -->|No| K[Create Endorsement]
    K --> L[Create Activity]
    L --> M[Send Real-Time Notification]
    M --> N([End])
    H --> N
    J --> N
```

## 7. Dashboard and Activity Flow

This flow describes how users view dashboard statistics and recent activities.

```mermaid
flowchart TD
    A([Start]) --> B[Login]
    B --> C[Open Dashboard]
    C --> D[Fetch Dashboard Statistics]
    D --> E[Display Projects Count]
    D --> F[Display Skills Count]
    D --> G[Display Blogs Count]
    D --> H[Display Connections Count]
    D --> I[Display Pending Requests]
    C --> J[Open Activity Feed]
    J --> K[Fetch Latest 20 Activities]
    K --> L[Display Activity Information]
    E --> M([End])
    F --> M
    G --> M
    H --> M
    I --> M
    L --> M
```

## Conclusion

The user flow diagrams represent the major workflows of DevConnect, including account authentication, GitHub OAuth, profile management, project management, blogging, developer connections, skill endorsements, and dashboard activities.