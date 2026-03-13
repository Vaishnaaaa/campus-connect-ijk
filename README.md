# CampusConnect — Christ College, Irinjalakuda
### Full-Stack Student Platform · Node.js + Express + MongoDB + Firebase Auth + React

---

## 📁 Project Structure

```
campusconnect/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── firebase.js        # Firebase Admin SDK init
│   ├── controllers/
│   │   ├── authController.js  # Sync Firebase user → MongoDB
│   │   ├── hostelController.js
│   │   ├── bookingController.js
│   │   ├── dealController.js
│   │   └── eventController.js
│   ├── middleware/
│   │   ├── auth.js            # Firebase token verification
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Hostel.js
│   │   ├── Booking.js
│   │   ├── Deal.js
│   │   └── Event.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── hostels.js
│   │   ├── bookings.js
│   │   ├── deals.js
│   │   └── events.js
│   ├── server.js              # Express entry point
│   ├── seed.js                # Sample data seeder
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── config/
    │   │   └── firebase.js    # Firebase client SDK
    │   ├── context/
    │   │   └── AuthContext.js # Global auth state
    │   ├── hooks/
    │   │   └── useFetch.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── HostelHub.js   # Live from MongoDB
    │   │   ├── CampusDeals.js # Post + browse deals
    │   │   ├── Events.js      # Register for events
    │   │   ├── MapPage.js
    │   │   ├── About.js
    │   │   ├── Reviews.js
    │   │   └── Profile.js     # Bookings + deals dashboard
    │   ├── services/
    │   │   └── api.js         # Axios + auto Firebase token
    │   ├── styles/
    │   │   └── globals.css
    │   ├── components/
    │   │   ├── Nav.js         # With auth modal
    │   │   └── Footer.js
    │   └── App.js
    ├── .env.example
    └── package.json
```

---

## ⚙️ Prerequisites

- **Node.js** v18+
- **MongoDB** (local) or a free **MongoDB Atlas** cluster
- A **Firebase project** (free Spark plan is enough)

---

## 🔥 Step 1 — Firebase Setup

### 1a. Create Firebase Project
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → name it `campusconnect-ijk` → Create

### 1b. Enable Authentication
1. In the Firebase console → **Authentication** → **Get started**
2. Enable **Email/Password** provider
3. Enable **Google** provider (add your support email)

### 1c. Get Web App Config (for frontend)
1. **Project Settings** (gear icon) → **Your apps** → **Add app** → Web (`</>`)
2. Register app name → Copy the `firebaseConfig` object values

### 1d. Get Service Account Key (for backend)
1. **Project Settings** → **Service accounts** tab
2. Click **Generate new private key** → download the JSON file
3. Copy the `project_id`, `client_email`, and `private_key` values

---

## 🗄️ Step 2 — Backend Setup

```bash
cd campusconnect/backend
npm install

# Copy the example env file
cp .env.example .env
```

Edit `.env`:
```env
MONGO_URI=mongodb://localhost:27017/campusconnect
PORT=5000
NODE_ENV=development

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"

CLIENT_URL=http://localhost:3000
```

> ⚠️ The `FIREBASE_PRIVATE_KEY` must be wrapped in double quotes and have literal `\n` (not real newlines).

### Seed the database with sample data
```bash
node seed.js
```

### Start the backend
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

API will be running at: `http://localhost:5000`
Health check: `GET http://localhost:5000/api/health`

---

## 🎨 Step 3 — Frontend Setup

```bash
cd campusconnect/frontend
npm install

cp .env.example .env
```

Edit `.env` with your Firebase web config:
```env
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123

REACT_APP_API_URL=http://localhost:5000/api
```

### Start the frontend
```bash
npm start
```

App will open at: `http://localhost:3000`

---

## 🔌 API Endpoints

### Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/sync` | 🔒 | Sync Firebase user to MongoDB |
| GET | `/api/auth/me` | 🔒 | Get current user profile |
| PUT | `/api/auth/me` | 🔒 | Update profile |

### Hostels
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/hostels` | Optional | List hostels (filter: type, rent, search) |
| GET | `/api/hostels/:id` | Optional | Get single hostel |
| POST | `/api/hostels` | 🔒 | Create hostel listing |
| PUT | `/api/hostels/:id` | 🔒 Owner | Update hostel |
| DELETE | `/api/hostels/:id` | 🔒 Owner | Delete hostel |
| POST | `/api/hostels/:id/reviews` | 🔒 | Add review |

### Bookings
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/bookings` | 🔒 | Create booking |
| GET | `/api/bookings/mine` | 🔒 | My bookings |
| GET | `/api/bookings/hostel/:id` | 🔒 Owner | Bookings for a hostel |
| PUT | `/api/bookings/:id/status` | 🔒 | Confirm/reject/cancel |

### Deals
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/deals` | Optional | List deals (filter: category, price, search) |
| GET | `/api/deals/mine` | 🔒 | My listings |
| GET | `/api/deals/:id` | Optional | Single deal |
| POST | `/api/deals` | 🔒 | Post new deal |
| PUT | `/api/deals/:id` | 🔒 Owner | Update deal |
| DELETE | `/api/deals/:id` | 🔒 Owner | Delete deal |

### Events
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/events` | Optional | List events (filter: type, upcoming) |
| GET | `/api/events/:id` | Optional | Single event |
| POST | `/api/events` | 🔒 | Create event |
| PUT | `/api/events/:id` | 🔒 Owner | Update event |
| DELETE | `/api/events/:id` | 🔒 Owner | Delete event |
| POST | `/api/events/:id/register` | 🔒 | Register for event |

---

## 🔐 How Auth Works

1. User signs in via Firebase (email/password or Google) in the browser
2. Firebase returns an **ID token** (JWT)
3. The frontend `api.js` interceptor attaches this token as `Authorization: Bearer <token>` on every request
4. The backend `middleware/auth.js` verifies the token using Firebase Admin SDK
5. On successful verification, `req.user` is set with `{ uid, email, name, ... }`
6. On first login, `POST /api/auth/sync` creates a MongoDB `User` document linked to the Firebase UID

---

## 🚀 Deployment

### Backend (e.g. Railway / Render / Fly.io)
1. Push `backend/` to a repo
2. Set all environment variables in the platform dashboard
3. Set start command: `node server.js`

### Frontend (e.g. Vercel / Netlify)
1. Push `frontend/` to a repo
2. Set all `REACT_APP_*` environment variables
3. Update `REACT_APP_API_URL` to your deployed backend URL
4. Build command: `npm run build`

### MongoDB Atlas (recommended for production)
1. Create free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Get connection string and replace `MONGO_URI` in backend `.env`

---

## 🧑‍💻 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Auth | Firebase Authentication (Email + Google) |
| API Client | Axios (auto-token injection) |
| Backend | Node.js, Express 4 |
| Database | MongoDB with Mongoose |
| Auth Verification | Firebase Admin SDK |
| Security | Helmet, CORS |

---

*Built for Christ College, Irinjalakuda · Affiliated to the University of Calicut*
