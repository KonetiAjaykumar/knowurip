# Authentication System Setup Guide

This project now includes a secure, production-ready authentication system featuring:
- **Email Registration** with 6-digit OTP verification.
- **Password Strength Analysis** with a live requirements meter.
- **JWT-Based HTTP-Only Sessions** with "Remember Me" capabilities.
- **SMTP Mail Dispatch** via Nodemailer for OTPs, password reset links, and functional Contact form feedback routing.
- **Prisma ORM & PostgreSQL** database schema.
- **Next.js Middleware** route guards protecting `/profile` and `/settings`.

---

## 🛠️ Step 1: Environment Variables

Create or update the `.env.local` file in your root directory with the following variables:

```env
# PostgreSQL connection string (Supabase, Neon, etc.)
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# JWT configuration (use a secure random string)
JWT_SECRET="glowing_cyberpunk_jwt_secret_token_key_here"

# SMTP Mail Server configurations
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-gmail-app-password"
SMTP_FROM='"KnowUrIP" <your-email@gmail.com>'

# Public application domain (for password reset links)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

*Note: For Gmail SMTP, configure a 16-character **App Password** from your Google Account settings, rather than your standard email password.*

---

## 💾 Step 2: Database Initialization

Once your `DATABASE_URL` is set, synchronize your PostgreSQL database schema with Prisma:

```bash
# Push schema structure directly to your database
npx prisma db push

# (Optional) Generate the Prisma Client
npx prisma generate
```

---

## 🚀 Step 3: Run Development Server

Start Next.js in development mode:

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** to view the live dashboard and onboarding controls.
