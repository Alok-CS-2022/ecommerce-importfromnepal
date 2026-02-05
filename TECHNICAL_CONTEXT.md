# Import From Nepal - Complete Technical Context

## Project Overview
**Import From Nepal** is an e-commerce web application for selling authentic handcrafted Nepalese products (singing bowls, thangka paintings, statues, jewelry, etc.). The project is built with a modern serverless architecture using Vercel and Supabase.

---

## Architecture Stack

### Frontend
- **HTML/CSS/JavaScript** (vanilla, no framework)
- **Tailwind CSS** - Utility-first styling framework
- **Owl Carousel** - For image sliders (jQuery-based)
- **jQuery 3.6.0** - For carousel functionality

### Backend
- **Vercel** - Serverless hosting and API routes
- **Node.js** - Runtime for API endpoints
- **Supabase** - PostgreSQL database with real-time API

### Libraries & Dependencies
- `@supabase/supabase-js@^2.45.0` - Supabase client
- `zod@^4.3.5` - Schema validation
- **Analytics**: Umami Analytics, Google Analytics (GTM)

### Database
- **Supabase** (PostgreSQL-based)
- URL: `https://tpvqolkzcbbzlqlzchwc.supabase.co`
- Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (in `api/lib/supabase.js`)

---

## Project Structure

```
c:\htmlwork/
├── api/                           # Vercel API routes (serverless functions)
│   ├── admin/
│   │   ├── auth.js               # Admin authentication (email: admin@importfromnepal.com, password: admin123)
│   │   ├── content.js            # Homepage content management (hero, stats, testimonials, SEO)
│   │   ├── products.js           # Admin product CRUD
│   │   └── orders.js             # Admin order management
│   ├── lib/
│   │   └── supabase.js           # Supabase client initialization
│   ├── products.js               # Public product listing API
│   ├── featured-products.js      # Featured products API
│   ├── categories.js             # Categories API (full CRUD)
│   ├── slider.js                 # Slider items API (full CRUD)
│   ├── blog.js                   # Blog stories API
│   ├── inquiry.js                # Contact form inquiry submission
│   ├── my-orders.js              # User order history
│   └── test.js                   # Test endpoint
│
├── public/                        # Frontend files (served by Vercel)
│   ├── admin/                     # Admin dashboard pages
│   │   ├── login.html            # Admin login
│   │   ├── dashboard.html        # Main admin dashboard
│   │   ├── products.html         # Manage products
│   │   ├── categories.html       # Manage product categories
│   │   ├── blog.html             # Manage blog stories
│   │   ├── content.html          # Manage homepage content
│   │   ├── testimonials.html     # Manage testimonials
│   │   └── order.html            # Manage customer orders
│   │
│   ├── index.html                # Home page (main landing page)
│   ├── products.html             # Product catalog
│   ├── product-detail.html       # Individual product details
│   ├── contact.html              # Contact form
│   ├── blog.html                 # Blog listing
│   ├── profile.html              # User profile/orders
│   ├── login.html                # Customer login
│   ├── register.html             # Customer registration
│   ├── debug.html                # Debug/test page
│   │
│   ├── css/
│   │   └── custom.css            # Custom styles (extends Tailwind)
│   │
│   ├── js/
│   │   ├── app.js                # Main app logic, auth, product loading
│   │   ├── home.js               # Homepage-specific logic (sliders, categories)
│   │   ├── catalog.js            # Product catalog filtering
│   │   ├── product-detail.js     # Single product page logic
│   │   ├── contact.js            # Contact form handler
│   │   ├── content-loader.js     # Dynamic content loader from DB
│   │   ├── ui.js                 # UI utilities (toasts, modals)
│   │   ├── countries.js          # Country codes list
│   │   └── lib/supabase.js       # Supabase client (frontend)
│   │
│   └── lib/
│       └── supabase.js           # Alternative Supabase import
│
├── lib/
│   └── supabase.js               # Shared Supabase client
│
├── scripts/
│   ├── content-guide.js          # Guide for content structure
│   └── populate-content.js       # Script to populate DB with initial content
│
├── Database SQL Files
│   ├── database_setup.sql        # Main DB schema setup
│   ├── create_blog.sql           # Blog table
│   ├── create_categories.sql     # Categories table
│   ├── create_slider.sql         # Slider items table
│   ├── create_tables_only.sql    # Minimal tables schema
│   ├── supabase_setup.sql        # Supabase-specific setup
│   ├── fix_content_schema.sql    # Content table fixes
│   └── disable_auth.sql          # Disable auth for testing
│
├── Configuration
│   ├── package.json              # NPM dependencies
│   ├── vercel.json               # Vercel deployment config
│   │
├── Documentation
│   ├── plan.md                   # Project planning
│   ├── PHASE2.md                 # Phase 2 completion status
│   ├── agents.md                 # AI agent instructions
│   └── TECHNICAL_CONTEXT.md      # This file
```

---

## Database Schema

### Core Tables

#### `products`
- `id` (UUID, PK) - Product ID
- `name` (TEXT) - Product name
- `description` (TEXT) - Product description
- `price` (NUMERIC) - Product price
- `category` (TEXT) - Product category
- `image_url` (TEXT) - Product image URL
- `is_featured` (BOOLEAN) - Featured product flag
- `display_order` (INTEGER) - Display order for sorting
- `created_at` (TIMESTAMP) - Creation timestamp

#### `categories`
- `id` (UUID, PK)
- `name` (TEXT) - Category name
- `image_url` (TEXT) - Category image
- `display_order` (INTEGER) - Display order
- `is_active` (BOOLEAN) - Active status
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `slider_items`
- `id` (UUID, PK)
- `title` (TEXT) - Slider item title
- `description` (TEXT) - Description/caption
- `image_url` (TEXT) - Carousel image URL
- `button_text` (TEXT) - CTA button text
- `button_link` (TEXT) - CTA button link
- `accent_pill` (TEXT) - Badge/label (e.g., "Featured", "Ancient Craft")
- `display_order` (INTEGER)
- `is_active` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `blog_stories`
- `id` (UUID, PK)
- `title` (TEXT) - Blog title
- `description` (TEXT) - Blog description/excerpt
- `image_url` (TEXT) - Blog featured image
- `category` (TEXT) - Blog category (e.g., "Tradition", "Artisans")
- `is_featured` (BOOLEAN) - Featured blog flag
- `display_order` (INTEGER)
- `is_active` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `site_content`
- `id` (UUID, PK)
- `content` (JSONB) - Flexible JSON storage for:
  - `hero` - Hero section content
  - `whyChooseUs` - USP section
  - `stats` - Statistics section
  - `testimonials` - Customer testimonials
  - `seo` - SEO metadata
  - `social` - Social media links
  - `footer` - Footer content
  - `branding` - Logo and branding
- `updated_at` (TIMESTAMP)

#### `inquiries` (Contact Form)
- `id` (UUID, PK)
- `name` (TEXT)
- `email` (TEXT)
- `phone` (TEXT)
- `country_code` (TEXT)
- `message` (TEXT)
- `created_at` (TIMESTAMP)

---

## API Endpoints

### Public APIs (No Authentication)

#### Products
- **GET** `/api/products` - Fetch all products
  - Returns: Array of product objects
  - Fallback: Mock data if API unavailable

#### Featured Products
- **GET** `/api/featured-products` - Fetch featured products only
  - Filters: `is_featured = true`, ordered by display_order

#### Categories
- **GET** `/api/categories` - Fetch all product categories
  - Ordered by: `display_order`

#### Slider
- **GET** `/api/slider` - Fetch carousel items
  - Filters: `is_active = true`

#### Blog
- **GET** `/api/blog` - Fetch blog stories
  - Filters: `is_active = true`

#### Content (Homepage)
- **GET** `/api/admin/content` - Fetch all site content
  - Returns: Site content JSON + slider items + blog stories

#### Inquiries
- **POST** `/api/inquiry` - Submit contact form
  - Body: `{ name, email, phone, country_code, message }`

#### Orders
- **GET** `/api/my-orders?email=user@example.com` - Fetch user orders

---

### Admin APIs (Protected)

#### Authentication
- **POST** `/api/admin/auth` - Admin login
  - Credentials: `admin@importfromnepal.com` / `admin123`
  - Returns: `{ success, token, user }`

#### Admin Content
- **GET** `/api/admin/content` - Fetch all content
- **PUT** `/api/admin/content` - Update site content
  - Body: `{ content: { hero: {...}, stats: {...}, etc } }`

#### Admin Products
- **GET** `/api/admin/products` - List all products
- **POST** `/api/admin/products` - Create product
- **PUT** `/api/admin/products` - Update product
- **DELETE** `/api/admin/products?id=UUID` - Delete product

#### Admin Categories
- **GET** `/api/categories` - List categories
- **POST** `/api/categories` - Create category
- **PUT** `/api/categories` - Update category
- **DELETE** `/api/categories?id=UUID` - Delete category

#### Admin Slider
- **GET** `/api/slider` - List slider items
- **POST** `/api/slider` - Create slider item
- **PUT** `/api/slider` - Update slider item
- **DELETE** `/api/slider?id=UUID` - Delete slider item

#### Admin Blog
- **GET** `/api/blog` - List blog stories
- **POST** `/api/blog` - Create blog story
- **PUT** `/api/blog` - Update blog story
- **DELETE** `/api/blog?id=UUID` - Delete blog story

#### Admin Orders
- **GET** `/api/admin/orders` - Fetch all orders/inquiries
- **PUT** `/api/admin/orders` - Update order status

---

## Frontend Architecture

### Application Flow

1. **Page Load** (`index.html`)
   - Load Tailwind CSS + Owl Carousel
   - Load jQuery for carousel
   - Load custom CSS

2. **DOM Content Loaded**
   - `app.js` initializes
   - `content-loader.js` loads homepage content from `/api/admin/content`
   - `home.js` initializes sliders, categories, testimonials
   - Products load from `/api/products`
   - Authentication state checked

3. **Dynamic Content Loading**
   - Slider items loaded from DB (via content-loader)
   - Blog stories loaded from DB
   - Featured products displayed
   - Categories showcase rendered

4. **User Interactions**
   - Product filtering in catalog
   - Add to cart/wishlist
   - Contact form submission
   - Admin login/logout

### Key JavaScript Modules

#### `app.js` (Main App Logic)
- Global state: `currentUser`, `allProducts`, `allCategories`
- Mobile menu toggle
- Product loading and filtering
- Category button building
- Cart/wishlist management
- Authentication UI updates
- Mock data fallback for products

#### `home.js` (Homepage)
- Loads featured products
- Initializes heritage slider (Owl Carousel)
- Loads category showcase
- Loads featured testimonials
- Stats counter animation

#### `content-loader.js` (Content Management)
- Fetches content from Supabase `site_content` table
- Fallback to localStorage if DB fails
- Updates DOM elements dynamically:
  - Hero section
  - Why Choose Us section
  - Stats section
  - Testimonials section
  - Blog stories section
  - SEO meta tags
  - Footer
  - Logo/Branding

#### `catalog.js` (Product Filtering)
- Filter products by category
- Search/sort functionality
- Display product cards

#### `product-detail.js` (Single Product)
- Load product by ID from query params
- Display product images, details, price
- Add to cart/wishlist
- Related products

#### `contact.js` (Contact Form)
- Form validation
- Submit inquiry to `/api/inquiry`
- Country code selection

#### `ui.js` (UI Utilities)
- Toast notifications
- Modal dialogs
- Loading states

#### `countries.js` (Data)
- List of countries with flags and phone codes

---

## Admin Dashboard

### Admin Login
- **URL**: `/admin/login.html`
- **Credentials**: 
  - Email: `admin@importfromnepal.com`
  - Password: `admin123` ⚠️ Change in production!
- **Authentication**: Token-based (stored in localStorage)

### Admin Dashboard Pages

#### Dashboard (`dashboard.html`)
- Overview of admin functions
- Quick stats
- Navigation to admin modules

#### Products Management (`products.html`)
- View all products
- Add new product (with image upload)
- Edit product details, price, featured status
- Delete products
- Reorder products by drag-and-drop
- Manage `is_featured` and `display_order`

#### Categories Management (`categories.html`)
- View all categories
- Add new category with image
- Edit category name and image
- Delete categories
- Reorder categories

#### Content Management (`content.html`)
- Edit homepage content:
  - Hero section (title, subtitle, image)
  - Why Choose Us (description, benefits)
  - Stats (numbers, labels)
  - SEO metadata (title, description, keywords)
  - Social media links
  - Footer content
  - Branding (logo URL)
- Manage slider items (carousel content)
- Manage blog stories (content for blog section)

#### Blog Management (`blog.html`)
- Create/edit blog stories
- Manage featured blogs
- Reorder blog display
- Upload blog images

#### Orders Management (`order.html`)
- View all customer inquiries/orders
- Update order status
- View customer details (name, email, phone, country)
- Message/notes

#### Testimonials (`testimonials.html`)
- Manage customer testimonials
- Add/edit/delete testimonials
- Feature testimonials

---

## Development & Deployment

### Local Development
```bash
npm install
npm run dev        # Starts Vercel dev server on localhost:3000
```

### Vercel Deployment
- Configured via `vercel.json`
- Rewrites configured:
  - `/admin/*` → `/public/admin/*`
  - `/*` → `/public/*`

### Environment Configuration
- Supabase URL and keys are hardcoded in `api/lib/supabase.js` (anon key is public)
- Admin credentials hardcoded in `api/admin/auth.js`

### CORS Configuration
- Allowed origins:
  - `https://importfromnepal.com`
  - `https://www.importfromnepal.com`
  - Vercel URL (auto-detected from env)
  - `http://localhost:3000` (for development)

---

## Project Phases & Status

### ✅ Phase 1: Initial Setup
- Database schema creation
- Basic API endpoints
- Frontend scaffolding

### ✅ Phase 2: Frontend Stabilization & Admin UX
- Admin products, orders, content management
- Public catalog parity
- Secure authentication
- Error handling & loading states

### 🔄 Phase 3: Full Integration (In Progress)
- ✅ Database schema & API setup
- ✅ Admin panel categories & featured products
- ✅ Admin slider & blog management
- ✅ Frontend dynamic loading
- 🔄 Testing & content migration

### Next: Phase 4
- Production hardening
- User acceptance testing
- Performance optimization

---

## Key Features

### For Customers
✅ Browse products by category
✅ View product details
✅ Add to wishlist
✅ Contact form
✅ User profiles (mock)
✅ Responsive design (mobile-first)

### For Admin
✅ Complete product management (CRUD)
✅ Category management
✅ Homepage content editing (no code needed)
✅ Slider/banner management
✅ Blog stories management
✅ Order/inquiry tracking
✅ Testimonials management
✅ SEO metadata editing

---

## Important Notes

### Security ⚠️
- Admin credentials are hardcoded (change in production!)
- Supabase anon key is public (row-level security should be configured)
- No HTTPS enforcement currently
- Authentication is token-based but not validated server-side

### Performance
- Mock data fallback ensures graceful degradation
- Carousel uses jQuery (could migrate to vanilla JS)
- Images loaded from Unsplash CDN
- No image optimization implemented yet

### Known Limitations
- No payment processing integrated
- No user registration/authentication for customers
- Contact form only collects inquiries, doesn't send emails
- No email notifications
- Limited error handling on frontend

---

## Technologies & Skills Used

- **Frontend**: Vanilla JavaScript, HTML5, CSS3, Tailwind CSS
- **Backend**: Node.js, Serverless (Vercel)
- **Database**: PostgreSQL (Supabase)
- **Tools**: Git, Vercel CLI
- **APIs**: RESTful
- **Version Control**: Git/GitHub
- **Analytics**: Umami, Google Analytics
- **Libraries**: Zod (validation), Supabase.js, jQuery, Owl Carousel

---

## Contact & Support
Admin credentials for testing provided above.
For production deployment, update credentials in `/api/admin/auth.js` and `/api/admin/content.js`.
