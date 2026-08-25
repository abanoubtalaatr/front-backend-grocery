# Grocery Plus

Full-stack grocery platform: a React storefront with a built-in admin dashboard,
and the Laravel API behind it.

| Folder | What it is | Stack |
|---|---|---|
| [`frontend/`](frontend) | Storefront **and** admin dashboard in one app (`/dashboard`) | React 19, Vite 8, TypeScript, Tailwind 4, TanStack Query, React Router 7 |
| [`backend/`](backend) | REST API, Filament admin, Stripe, AI chatbot | Laravel 12, PHP 8.3, Sanctum, MySQL |

Specification: **Grocery SRS** (SRS-01 → SRS-22).
Design: [Figma — Grocery Plus](https://www.figma.com/design/6aWJCBf6AdJgokjVQAJpwk/Grocery-Plus).

---

## Getting started

### 1. Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve --port=8000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

To develop against the local API, set this in `frontend/.env.local`:

```
VITE_API_BASE_URL=
VITE_API_PROXY_TARGET=http://127.0.0.1:8000
```

Leaving `VITE_API_BASE_URL` empty makes the browser call `/api` on its own
origin; the Vite dev server proxies that to `VITE_API_PROXY_TARGET`.

---

## The dashboard

`/dashboard` is an admin-only area inside the same React app. It is lazy-loaded,
so shoppers never download it.

| Route | Screen |
|---|---|
| `/dashboard` | Revenue, orders, best sellers, low stock, recent orders |
| `/dashboard/products` | Product CRUD, image upload, availability/featured toggles |
| `/dashboard/categories` | Categories + subcategories |
| `/dashboard/orders` | Order list, detail, status transitions |
| `/dashboard/offers` | Promo codes |
| `/dashboard/customers` | Accounts, suspend/promote, loyalty balances |
| `/dashboard/reviews` | Approve or reject customer reviews |
| `/dashboard/inbox` | Contact messages and in-app problem reports |
| `/dashboard/content` | FAQs and static pages |
| `/dashboard/settings` | Store identity, contact details, commerce defaults |

**Access.** Every screen sits behind `RequireAdmin`, which confirms `is_admin`
against `GET /api/auth/me`. That is a convenience only — the real gate is
server-side: every `/api/admin/*` route runs `auth:sanctum` plus the `admin.api`
middleware and answers `401`/`403` in JSON.

The Laravel side also still ships the Filament panel at `/admin`; the two are
independent.

---

## Admin API

All routes are prefixed `/api/admin` and answer `{ success, message, data }`,
with a `meta` block on paginated lists. Defined in
[`backend/routes/api.php`](backend/routes/api.php), implemented in
`backend/app/Http/Controllers/Api/Admin/`.

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/stats` | Dashboard totals, revenue series, top products, low stock |
| `GET POST PUT DELETE` | `/products`, `/products/{id}` | Product CRUD (multipart for images) |
| `POST` | `/products/{id}/toggle` | Flip `is_available` / `is_featured` / `is_hot` |
| `GET POST PUT DELETE` | `/categories`, `/subcategories` | Catalog structure |
| `GET` | `/orders`, `/orders/{id}` | Orders with items, address, timeline |
| `PUT` | `/orders/{id}/status` | Advance an order and stamp its timestamp |
| `GET PUT DELETE` | `/users`, `/users/{id}` | Accounts, flags, loyalty |
| `GET POST PUT DELETE` | `/offers` | Promo codes |
| `GET PUT DELETE` | `/reviews`, `/reviews/{id}/approval` | Review moderation |
| `GET PUT DELETE` | `/messages`, `/reports` | Customer inbox |
| `GET POST PUT DELETE` | `/faqs`, `/pages` | Editorial content |
| `GET PUT` | `/settings` | Store settings (single row) |

List endpoints accept `?page=`, `?per_page=` (max 100), `?search=`, `?sort=`
(allow-listed columns only) and `?direction=`, plus per-resource filters.

---

## Brand

Colour and typography live in one file:
[`frontend/src/styles/brand.css`](frontend/src/styles/brand.css). It is the only
place a brand colour is defined — re-syncing with Figma means editing those
tokens and nothing else.

Primary navy `#003b5c`, deep teal `#0a4b66`, typeface **Poppins**.

---

## Conventions

- Never commit `.env`. Both apps ship a `.env.example`.
- Admin list queries restrict `?sort=` to an allow-list; do not bypass it.
- Money is formatted from `settings.currency_symbol`, never hard-coded.
- Destructive actions in the dashboard always go through a confirm dialog.
