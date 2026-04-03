# SavoryCircle

A full-stack recipe sharing and community platform built with Next.js App Router, MongoDB, and Tailwind CSS.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- JavaScript (ES Modules)
- MongoDB (`mongodb` Node driver)
- Tailwind CSS 4
- Nodemailer (SMTP email for OTP)

## Features

- Secure authentication with hashed passwords (`scrypt`) and session cookies
- OTP-based email verification during signup
- Login, logout, and change-password flows
- Recipe listing with search, filters, sorting, and seeded default recipes
- Create recipe with image upload support (`data:image/...`)
- Save and unsave recipes
- Recipe rating system (1-5) with aggregate rating updates
- Recipe comments
- Community stories feed and posting
- MongoDB index management for core collections

## Project Structure

```text
app/
  api/
    auth/
    recipes/
    stories/
  login/
  signup/
  recipes/
  stories/
features/
  auth/
  recipes/
  stories/
  homepage/
shared/
  lib/
  components/
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment file

Create `.env.local` in the project root:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
MONGODB_DB=t10

# Optional MongoDB tuning
# MONGODB_TLS=true
# MONGODB_TLS_ALLOW_INVALID_CERTIFICATES=false
# MONGODB_TLS_ALLOW_INVALID_HOSTNAMES=false
# MONGODB_IP_FAMILY=4
# MONGODB_SERVER_SELECTION_TIMEOUT_MS=10000
# MONGODB_CONNECT_TIMEOUT_MS=10000
# MONGODB_SOCKET_TIMEOUT_MS=30000

# SMTP (required for OTP email verification)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=no-reply@example.com
# SMTP_SECURE=false
```

### 3. Run development server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` - Start local development server
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run lint` - Run ESLint

## Authentication Notes

- Session cookie name: `auth_session`
- Session duration: 7 days
- Signup OTP expiry: 10 minutes
- Maximum OTP attempts: 5
- Password policy: 8-64 chars, uppercase, lowercase, number, special character

## API Routes

### Auth

- `POST /api/auth/signup`
  - `action: "request_otp"` to send OTP
  - `action: "verify_otp"` to verify OTP and create session
  - fallback signup flow also supported in route
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/change-password`

### Recipes

- `GET /api/recipes` (supports query/filter/sort params)
- `POST /api/recipes`
- `GET /api/recipes/[id]`
- `POST /api/recipes/[id]/save`
- `POST /api/recipes/[id]/rating`
- `GET /api/recipes/[id]/comments`
- `POST /api/recipes/[id]/comments`

### Stories

- `GET /api/stories`
- `POST /api/stories`

## Data Collections

- `users`
- `sessions`
- `signupOtps`
- `recipes`
- `savedRecipes`
- `recipeRatings`
- `recipeComments`
- `stories`

## Deployment

This app can be deployed on platforms like Vercel. Ensure all required environment variables are configured in your deployment settings.
