# Khajuraho Roads

Production-ready full stack website for a tours and travels business serving Khajuraho and Panna, Madhya Pradesh.

## Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB
- Auth: JWT
- Admin Panel: Included
- AI Chatbot: OpenAI Responses API integration with travel business context

## Business Features

- Premium homepage with hero, services, quick booking, and Google Maps embed
- Car listings with filters by price, seating, and type
- Package listings with fixed-price tour cards and best-seller badges
- Car details page with gallery, driver profile, fare breakdown, and video-ready section
- End-to-end booking flow with distance estimate, package pricing calculation, confirmation page, and persisted booking status
- Gallery page for cars and destination visuals
- My Bookings page for logged-in users
- Floating WhatsApp, call, and map actions
- Admin dashboard to manage cars, packages, pricing, media, and bookings
- Admin-managed blog system with SEO fields and article sections
- JWT customer signup/login and admin login
- Upload-ready media management

## Project Structure

```text
client/   React frontend
server/   Express API and Mongo models
API.md    API reference
```

## Database Schema

### User

- `name`
- `email`
- `phone`
- `password`
- `role`

### Car

- `name`
- `slug`
- `brand`
- `type`
- `seatingCapacity`
- `ac`
- `pricePerKm`
- `minBookingKm`
- `luggage`
- `summary`
- `description`
- `highlights[]`
- `images[]`
- `driverProfile`
- `featured`

### Booking

- `bookingNumber`
- `customer`
- `userId`
- `car`
- `package`
- `pickupLocation`
- `dropLocation`
- `travelDate`
- `travelTime`
- `distanceKm`
- `billableKm`
- `pricePerKm`
- `totalPrice`
- `bookingType`
- `packageName`
- `includedKm`
- `extraKm`
- `tripType`
- `notes`
- `status`

### Package

- `name`
- `slug`
- `price`
- `duration`
- `includedKm`
- `extraPerKm`
- `description`
- `heroImage`
- `ogImage`
- `featured`
- `bestSeller`

### Blog

- `title`
- `slug`
- `excerpt`
- `description`
- `keywords[]`
- `heroImage`
- `ogImage`
- `status`
- `sections[]`
- `publishedAt`
- `featured`

## Local Run Guide

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Update `server/.env` with:

- MongoDB connection string
- secure `JWT_SECRET`
- OpenAI API key for the chatbot

Update `client/.env` with:

- `VITE_SITE_URL` for canonical URLs, Open Graph URLs, and structured data
- `VITE_GOOGLE_MAPS_API_KEY` for full Google Maps address autocomplete and live route-distance pricing
- `VITE_GA_MEASUREMENT_ID` for GA4 tracking
- `VITE_FB_PIXEL_ID` for Facebook Pixel tracking
- `VITE_GOOGLE_SITE_VERIFICATION` for Google Search Console meta verification
- `VITE_BING_SITE_VERIFICATION` for Bing Webmaster verification

Update `server/.env` with:

- `SITE_URL` for sitemap, robots, and IndexNow absolute URLs
- `INDEXNOW_KEY` to enable automatic IndexNow submissions

### 3. Start MongoDB

Run MongoDB locally or point `MONGO_URI` to MongoDB Atlas.

### 4. Seed admin, fleet, and package data

```bash
npm run seed
```

Default seeded admin:

- Email: `admin@khajurahoroads.com`
- Password: `Admin@123`

### 5. Start backend

```bash
npm run dev:server
```

### 6. Start frontend

```bash
npm run dev:client
```

### 7. Start backend container + ngrok tunnel

If your backend runs in Docker as `khajuraho-backend` on port `5050`, you can start the container, wait for `/api/health`, and open ngrok with one command:

```bash
npm run tunnel:start
```

Optional overrides:

```bash
CONTAINER_NAME=khajuraho-backend LOCAL_PORT=5050 npm run tunnel:start
```

Open:

- Frontend: `http://localhost:5173`
- API: `http://localhost:5050/api`

Customer flow:

1. Sign up or log in
2. Book a car or package
3. Open `/my-bookings` to view booking ID, route, date, price, and status

## Google Maps Distance Setup

To enable full automatic pricing for any typed address:

1. Create a Google Maps API key
2. Enable:
   - Maps JavaScript API
   - Places API
   - Distance Matrix API
3. Put the key in [`client/.env`](/Users/arvindpatel/Desktop/Codex/client/.env):

```bash
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

If the key is not configured, the site falls back to saved Khajuraho/Panna locations.

## Cookie Consent and Tracking Setup

The frontend now includes a GDPR-style cookie consent system with:

- Necessary cookies always enabled
- Optional analytics cookies
- Optional marketing cookies
- Footer link to reopen cookie settings

Tracking scripts only load after consent.

Example [`client/.env`](/Users/arvindpatel/Desktop/Codex/client/.env):

```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_FB_PIXEL_ID=123456789012345
```

Tracked events:

- GA4:
  - page views
  - package clicks
  - booking started
  - booking completed
- Facebook Pixel:
  - PageView
  - ViewContent
  - InitiateCheckout
- Purchase

## SEO and Search Console Setup

The website now includes:

- dynamic page-level SEO tags with canonical URLs
- Open Graph tags for WhatsApp and Facebook sharing
- LocalBusiness, Product, Breadcrumb, and Article schema
- dynamic package detail routes: `/packages/:slug`
- blog routes: `/blog/:slug`
- admin blog CRUD via dashboard
- rich blog editor with live article preview
- draft and published blog workflow
- package-specific and blog-specific OG image support
- automatic OG image generation endpoints for blogs and packages
- dynamic backend sitemap at `/sitemap.xml`
- dynamic backend robots file at `/robots.txt`
- IndexNow integration for package create and update events
- IndexNow integration for blog create and update events
- deployment SEO sync command

Example `client/.env`:

```bash
VITE_SITE_URL=https://www.yourdomain.com
VITE_GOOGLE_SITE_VERIFICATION=google-verification-code
VITE_BING_SITE_VERIFICATION=bing-verification-code
```

Example `server/.env`:

```bash
SITE_URL=https://www.yourdomain.com
INDEXNOW_KEY=your-indexnow-key
```

To finish production indexing:

1. Add your real production domain to `VITE_SITE_URL`, `CLIENT_URL`, and `SITE_URL`
2. Put the Google verification code into `VITE_GOOGLE_SITE_VERIFICATION`
3. Put the Bing verification code into `VITE_BING_SITE_VERIFICATION`
4. Add `https://yourdomain.com/sitemap.xml` in Google Search Console
5. Add the same sitemap to Bing Webmaster Tools
6. Configure `INDEXNOW_KEY` to enable automatic URL pings when packages change
7. Run `npm run seo:sync` after deployment if you want to resubmit all major URLs to IndexNow

IndexNow behavior:

- new package create: pings package page + packages listing
- package update: pings package page + packages listing
- new blog create: pings blog page + blog listing
- blog update: pings blog page + blog listing
- manual submission endpoint: `POST /api/seo/indexnow`
- deployment sync endpoint: `POST /api/seo/sync`

Important Google note:

- Google completed deprecation of the public sitemap ping endpoint on June 26, 2023
- for Google, keep `/sitemap.xml` live, reference it in `/robots.txt`, and submit it in Search Console
- this project therefore automates IndexNow and sitemap generation, rather than attempting an unsupported Google ping

## Start Commands

First-time setup:

```bash
npm install
cp client/.env.example client/.env
cp server/.env.example server/.env
```

If you want fresh seeded cars, packages, blogs, and admin login:

```bash
npm run seed
```

Start backend:

```bash
npm run dev:server
```

Start frontend in another terminal:

```bash
npm run dev:client
```

Optional SEO deployment sync:

```bash
npm run seo:sync
```

Open:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5050/api`
- Sitemap: `http://localhost:5050/sitemap.xml`

Default admin after seed:

- Email: `admin@khajurahoroads.com`
- Password: `Admin@123`

## Deployment Notes

- Build frontend with `npm run build`
- Serve `client/dist` via Nginx, Hostinger Node app setup, or S3 + CloudFront
- Run backend with PM2, Docker, systemd, or your VPS process manager
- Use MongoDB Atlas or managed Mongo for production
- Set `CLIENT_URL`, `MONGO_URI`, `JWT_SECRET`, and `OPENAI_API_KEY` in production
- Put uploaded media behind a persistent volume or object storage service in production

## OpenAI Chatbot Notes

The chatbot route is implemented in [`server/src/services/chatbotService.js`](/Users/arvindpatel/Desktop/Codex/server/src/services/chatbotService.js). It uses the OpenAI Responses API when `OPENAI_API_KEY` is present, and falls back to a rule-based travel assistant if the key is missing. I defaulted the model to `gpt-5.4-mini` because OpenAI’s current official model docs list it as a strong lower-latency option available through the Responses API: https://developers.openai.com/api/docs/models and https://developers.openai.com/api/docs/models/compare
