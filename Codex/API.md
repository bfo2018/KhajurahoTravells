# API Documentation

Base URL: `http://localhost:5050/api`

## Authentication

### `POST /auth/signup`

Create a customer account.

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "+91 9988776655",
  "password": "Secret@123"
}
```

### `POST /auth/login`

Login as admin or customer.

```json
{
  "email": "admin@khajurahoroads.com",
  "password": "Admin@123"
}
```

Returns JWT token and user payload.

## Cars

### `GET /cars`

Query params:

- `maxPrice`
- `seating`
- `type`

### `GET /cars/featured`

Returns homepage fleet.

### `GET /cars/:slug`

Returns a single car, gallery, pricing, and driver details.

### `POST /cars`

Admin only. Create car.

### `PUT /cars/:id`

Admin only. Update car fields, driver details, pricing, media links.

### `DELETE /cars/:id`

Admin only. Remove car.

## Bookings

### `GET /bookings/estimate-distance`

Auto-fills common route distances.

Query params:

- `pickup`
- `drop`

### `POST /bookings`

Protected. Create car or package booking.

```json
{
  "bookingType": "CAR",
  "carId": "car_object_id",
  "pickupLocation": "Khajuraho Airport",
  "dropLocation": "Western Temple Group",
  "travelDate": "2026-04-12",
  "travelTime": "10:30",
  "distanceKm": 8,
  "tripType": "airport",
  "notes": "Need hotel drop after temple visit",
  "customer": {
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "phone": "+91 9988776655"
  }
}
```

Response includes booking number, price, and status.

Package booking example:

```json
{
  "bookingType": "PACKAGE",
  "packageId": "package_object_id",
  "pickupLocation": "Khajuraho",
  "dropLocation": "Panna",
  "travelDate": "2026-04-12",
  "travelTime": "08:00",
  "tripType": "outstation",
  "extraKm": 20,
  "notes": "Need early morning pickup",
  "customer": {
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "phone": "+91 9988776655"
  }
}
```

### `GET /bookings`

Protected.

- Admin sees all bookings
- Customer sees bookings linked to their logged-in user ID

### `GET /bookings/user/:userId`

Protected.

- Customer can fetch only their own bookings
- Admin can fetch any user bookings

### `GET /bookings/:id`

Booking confirmation detail.

### `PATCH /bookings/:id/status`

Admin only.

```json
{
  "status": "Confirmed"
}
```

## Packages

### `GET /packages`

Returns all packages.

### `GET /packages/slug/:slug`

Returns a single package by SEO slug.

### `POST /packages`

Admin only. Create package.

```json
{
  "name": "Khajuraho Local Tour",
  "price": 2000,
  "duration": "1 Day",
  "includedKm": 80,
  "extraPerKm": 12,
  "description": "Local sightseeing package",
  "heroImage": "/media/travel-khajuraho.svg",
  "ogImage": "/media/travel-khajuraho.svg",
  "featured": true,
  "bestSeller": true
}
```

### `PUT /packages/:id`

Admin only. Update package fields.

### `DELETE /packages/:id`

Admin only. Delete package.

## Blogs

### `GET /blogs`

Returns all blog articles.

### `GET /blogs/slug/:slug`

Returns a single blog article by SEO slug.

### `POST /blogs`

Admin only. Create a blog article.

```json
{
  "title": "Top places to visit in Khajuraho",
  "excerpt": "A practical sightseeing overview for first-time visitors.",
  "description": "Explore the top places to visit in Khajuraho with taxi-friendly route planning and local travel advice.",
  "keywords": ["top places to visit in Khajuraho", "Khajuraho taxi service"],
  "heroImage": "/media/travel-khajuraho.svg",
  "ogImage": "/media/travel-khajuraho.svg",
  "publishedAt": "2026-04-05",
  "status": "published",
  "featured": true,
  "sections": [
    {
      "heading": "Start with the Western Group",
      "body": "Morning temple visits are ideal for comfort and photography."
    }
  ]
}
```

### `PUT /blogs/:id`

Admin only. Update a blog article.

### `DELETE /blogs/:id`

Admin only. Delete a blog article.

### `GET /blogs/admin/all`

Admin only. Returns published and draft blog articles for the dashboard.

## SEO

### `GET /sitemap.xml`

Dynamic XML sitemap containing:

- homepage
- SEO homepage alias
- cars page
- packages page
- booking page
- gallery page
- blog pages
- individual car pages
- individual package pages

### `GET /robots.txt`

Search crawler rules with sitemap reference.

### `GET /:INDEXNOW_KEY.txt`

IndexNow key file served from backend when `INDEXNOW_KEY` is configured.

### `POST /seo/indexnow`

Admin only. Submit one or more URLs to IndexNow manually.

```json
{
  "urls": [
    "https://example.com/packages/khajuraho-panna-tour",
    "https://example.com/blog/top-places-to-visit-in-khajuraho"
  ]
}
```

### `POST /seo/sync`

Admin only. Deployment-ready SEO sync for all major URLs.

Returns:

- full URL list submitted
- IndexNow submission status
- note about Google sitemap ping deprecation

### `GET /seo/og/blog/:slug.svg`

Generated OG image for a blog article.

### `GET /seo/og/package/:slug.svg`

Generated OG image for a package page.

### `GET /seo/og/preview.svg`

Live OG preview generator for admin usage.

Query params:

- `type=blog|package`
- `title`
- `subtitle`

## Chat

### `POST /chat`

OpenAI-backed chatbot with fleet and pricing context.

```json
{
  "message": "Which car is best for 6 people going from Khajuraho to Panna?"
}
```

## Uploads

### `POST /uploads`

Admin only. Multipart upload for images or video files.

Form-data:

- `file`
