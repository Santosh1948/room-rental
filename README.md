# Room Rental

Room Rental is a full-stack property rental application. Renters can discover properties, save favorites, send rental requests, manage bookings and payments, and leave reviews. Property owners can manage listings and rental activity, while administrators have tools for platform-wide management.

## Tech stack

- **Frontend:** React, Vite, React Router, Redux Toolkit, Axios, and Tailwind CSS
- **Backend:** Node.js, Express, and Mongoose
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)

## Features

- Public property browsing and property detail pages
- Registration, login, and role-based access for renters, owners, and administrators
- Renter dashboards for requests, bookings, payments, favorites, profile, and notifications
- Owner dashboards for properties, requests, bookings, payments, and reviews
- Admin dashboards for users, properties, bookings, and payments
- REST API for authentication, users, properties, rooms, rental requests, bookings, payments, reviews, favorites, notifications, and administration

## Prerequisites

- Node.js and npm
- A MongoDB instance (local or hosted)

## Getting started

Clone the repository, then install the frontend and backend dependencies separately:

```bash
cd Backend
npm install
```

In a second terminal, from the repository root:

```bash
cd Frontend
npm install
```

### Configure the backend

Create `Backend/.env`:

```dotenv
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/room_rental
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d
```

Use a strong, private JWT secret and keep `.env` files out of version control.

### Configure the frontend

Create `Frontend/.env`:

```dotenv
VITE_API_BASE_URL=https://room-rental-backend-e89v.onrender.com/api
```

The frontend uses this base URL for API requests. The deployed Render API URL is also the frontend's default when this variable is unset. To use a local backend instead, set the value to `http://localhost:3000/api`.

### Start the application

Start the backend from the `Backend` directory:

```bash
npm run dev
```

Start the frontend from the `Frontend` directory in another terminal:

```bash
npm run dev
```

Vite prints the local frontend URL in the terminal (typically `http://localhost:5173`). The backend listens on port `3000` unless `PORT` is set to a different value. The backend connects to MongoDB before it starts listening.

## Available scripts

| Directory | Command | Description |
| --- | --- | --- |
| `Backend` | `npm run dev` | Start the API with Nodemon |
| `Backend` | `npm start` | Start the API with Node.js |
| `Frontend` | `npm run dev` | Start the Vite development server |
| `Frontend` | `npm run build` | Build the frontend for production |
| `Frontend` | `npm run preview` | Preview the production build locally |
| `Frontend` | `npm run lint` | Run ESLint |

## API routes

The Express API is mounted under `/api`:

| Prefix | Area |
| --- | --- |
| `/api/auth` | Authentication |
| `/api/users` | User accounts |
| `/api/properties` | Property listings |
| `/api/rooms` | Rooms |
| `/api/rental-requests` | Rental requests |
| `/api/bookings` | Bookings |
| `/api/payments` | Payments |
| `/api/reviews` | Reviews |
| `/api/favorites` | Saved properties |
| `/api/notifications` | Notifications |
| `/api/admin` | Administrative operations |

The backend also serves a simple response at `/`.

## Project structure

```text
Backend/
  server.js
  src/
    app.js
    controllers/
    db/
    middileware/
    models/
    routes/
    services/
Frontend/
  src/
    api/
    components/
    pages/
    routes/
    services/
    store/
```

## Notes

- Install dependencies and run commands from the corresponding `Backend` or `Frontend` directory.
- Do not commit database connection strings, JWT secrets, or other credentials.
- A test script is not currently defined in either package manifest.
