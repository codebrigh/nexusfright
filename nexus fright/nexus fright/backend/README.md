# Nexus Fright Backend

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the backend folder with:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_gmail_address@gmail.com
   EMAIL_PASS=your_gmail_app_password
   FRONTEND_URL=http://localhost:3000
   ```
   - For Gmail, create an App Password if 2FA is enabled.

3. Start the server:
   ```
   npm start
   ```

## Endpoints
- `POST /api/auth/register` — Register a new user (sends verification email)
- `GET /api/auth/verify?token=...` — Verify user email
- `POST /api/auth/login` — Login (only if verified) 