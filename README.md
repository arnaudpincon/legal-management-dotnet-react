# Legal App

Proof of concept for a legal client management system built with .NET Core and React.

## Tech Stack

**Backend:** .NET 9, Entity Framework, JWT, Swagger  
**Frontend:** React 19, TypeScript, Axios  
**Testing:** xUnit, Jest, FluentAssertions

## Setup

### Backend
```bash
cd backend/LegalApp.API
dotnet run
```
API available at `http://localhost:5275`

### Frontend
```bash
cd frontend/legal-app-ui
npm install && npm start
```
UI available at `http://localhost:3000`

## Test Accounts
- **admin** / password123
- **lawyer** / lawyer123

## Features

- ✅ JWT Authentication
- ✅ Complete client CRUD
- ✅ Case viewing
- ✅ Responsive UI
- ✅ Unit tests

## API Endpoints

```
POST /api/auth/login           # Login
GET  /api/clients              # List clients
POST /api/clients              # Create client
PUT  /api/clients/{id}         # Update client
DELETE /api/clients/{id}       # Delete client
GET  /api/clients/{id}/cases   # Client cases
```

## Testing

```bash
# Backend
cd backend/LegalApp.Tests && dotnet test

# Frontend  
cd frontend/legal-app-ui && npm test
```

## Structure

```
├── backend/LegalApp.API/      # .NET API
├── backend/LegalApp.Tests/    # Backend tests
└── frontend/legal-app-ui/     # React app
```

---

**Note:** Uses in-memory database - data is lost on restart.
