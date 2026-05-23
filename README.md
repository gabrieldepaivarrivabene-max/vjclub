# VJ CLUB - Premium Sports Gear E-commerce

A complete, production-ready e-commerce solution for VJ CLUB with a black/gold theme, full inventory management, Mercado Pago payments, real-time chat, and admin panel.

## Features

- **Black/Gold Minimalist Theme** - Fully responsive, mobile-first design
- **Product Catalog** - Category tabs (Sneakers, Shirts, Cleats)
- **Size Stock Logic** - Out-of-stock sizes have strikethrough and are disabled
- **Shopping Cart** - Persistent cart with Zustand state management
- **Mercado Pago Integration** - Checkout Bricks for credit card and PIX payments
- **Real-time Chat** - Customer support chat with email notifications
- **Admin Panel** - Manage orders, products, and stock levels
- **Supabase Backend** - Database, auth, and realtime features

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Payments**: Mercado Pago Checkout Bricks
- **Email**: Resend
- **State Management**: Zustand
- **Authentication**: bcrypt

## Prerequisites

- Node.js 18+ installed
- Supabase account
- Mercado Pago account
- Resend account

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/gabrieldepaivarrivabene-max/vjclub.git
cd vjclub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Mercado Pago Configuration
NEXT_PUBLIC_MP_PUBLIC_KEY=your_mercado_pago_public_key
MP_ACCESS_TOKEN=your_mercado_pago_access_token

# Resend Configuration
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=admin@vjclub.com

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Set Up Supabase Database

1. Go to your Supabase project's SQL Editor
2. Run the SQL commands from `database/schema.sql`
3. Enable Realtime for the `chat_messages` table in Supabase dashboard
4. Generate a password hash for the admin user using bcrypt

### 5. Generate Admin Password Hash

Run this in a Node.js environment:

```javascript
const bcrypt = require('bcrypt');
const hash = bcrypt.hash('your_password', 10);
console.log(hash);
```

Update the admin user in the database with your hashed password.

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
vj-club/
├── app/
│   ├── layout.tsx                # Root layout (black/gold theme)
│   ├── page.tsx                  # Homepage – product catalog
│   ├── products/[id]/page.tsx    # Product detail with size stock logic
│   ├── cart/page.tsx             # Shopping cart page
│   ├── checkout/page.tsx         # Mercado Pago checkout
│   ├── admin/
│   │   ├── layout.tsx            # Admin auth guard
│   │   ├── page.tsx              # Admin dashboard
│   │   └── login/page.tsx        # Admin login
│   ├── api/
│   │   ├── auth/admin/route.ts   # Admin login verification
│   │   ├── mercadopago/          # Create payment preference
│   │   ├── chat/send/route.ts    # Send message + email to admin
│   │   ├── chat/reply/route.ts   # Admin reply to customer
│   │   └── orders/route.ts       # Save order to database
│   └── globals.css               # Tailwind + gold theme
├── components/
│   ├── Header.tsx                # Nav tabs: Sneakers, Shirts, Cleats
│   ├── ChatWidget.tsx            # Real-time chat (bottom right)
│   ├── ProductCard.tsx
│   ├── SizeSelector.tsx          # Disables out-of-stock sizes
│   ├── ProductDetails.tsx        # Product detail component
│   └── CartProvider.tsx          # Zustand cart state
├── lib/
│   ├── supabaseClient.ts         # Supabase client (browser)
│   └── supabaseServer.ts         # Server client
├── types/
│   └── index.ts                  # TypeScript interfaces
├── middleware.ts                 # Protect /admin route
├── database/
│   └── schema.sql                # Database schema
└── .env.local.example            # Environment variables template
```

## Admin Panel

Access the admin panel at `/admin/login` with your admin credentials.

Features:
- View and manage orders
- Update product stock levels
- Monitor payment status

## Payment Integration

The project uses Mercado Pago Checkout Bricks for transparent checkout:

- **Credit Card** - With installment options
- **PIX** - Instant payment with QR code

Test mode is automatically used if your MP_ACCESS_TOKEN starts with `TEST-`.

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repo to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Update `NEXT_PUBLIC_BASE_URL` to your production domain.

## Security Notes

- `NEXT_PUBLIC_MP_PUBLIC_KEY` is safe to expose (used only for frontend SDK)
- `MP_ACCESS_TOKEN` is never exposed (server-side only)
- Admin passwords are hashed with bcrypt
- Admin routes are protected by middleware

## License

This project is proprietary software for VJ CLUB.

## Support

For support, contact admin@vjclub.com
