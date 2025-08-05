# Legal App

Proof of concept for a legal client management system.

## Project Structure

```
├── rest-version/          # REST API implementation
└── graphql-version/       # GraphQL implementation
```

## Tech Stack

### REST Version

**Backend:** .NET 9, Entity Framework, JWT, Swagger  
**Frontend:** React 19, TypeScript, Axios  
**Testing:** xUnit, Jest, FluentAssertions

### GraphQL Version

**Backend:** .NET 9, HotChocolate, Entity Framework, JWT  
**Frontend:** React 19, TypeScript, Apollo Client  
**Testing:** xUnit, Jest, FluentAssertions

## Setup

### REST Version

```bash
# Backend
cd rest-version/backend/LegalApp.API
dotnet run
# API: http://localhost:5275

# Frontend
cd rest-version/frontend/legal-app-ui
npm install && npm start
# UI: http://localhost:3000
```

### GraphQL Version

```bash
# Backend
cd graphql-version/backend/LegalApp.GraphQL
dotnet run
# GraphQL: http://localhost:5264/graphql
# Playground: http://localhost:5264/

# Frontend
cd graphql-version/frontend/legal-app-graphql-ui
npm install && npm start
# UI: http://localhost:3000
```

## Test Accounts

- **admin** / password123
- **lawyer** / lawyer123

## Features

- JWT Authentication
- Complete client CRUD
- Case viewing
- Responsive UI
- Unit tests

## Key Differences

| Feature            | REST                | GraphQL           |
| ------------------ | ------------------- | ----------------- |
| **Endpoints**      | Multiple (6 routes) | Single (/graphql) |
| **Data Fetching**  | Multiple requests   | Single query      |
| **Client Library** | Axios               | Apollo Client     |
| **API Explorer**   | Swagger             | Banana Cake Pop   |

## API Examples

### REST

```bash
GET  /api/clients              # List clients
POST /api/clients              # Create client
PUT  /api/clients/{id}         # Update client
DELETE /api/clients/{id}       # Delete client
GET  /api/clients/{id}/cases   # Client cases
```

### GraphQL

```graphql
query {
  clients {
    id
    name
    email
    cases {
      id
      title
      status
    }
  }
}

mutation {
  createClient(input: { name: "John", email: "john@example.com" }) {
    id
    name
  }
}
```

## Testing

```bash
# Backend (both versions)
dotnet test

# Frontend (both versions)
npm test
```

---

**Note:** Note: In-memory database – data is lost on restart.
