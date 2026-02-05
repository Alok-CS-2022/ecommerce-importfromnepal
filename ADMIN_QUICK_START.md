# Admin Panel - Quick Start Guide

## What You Have Now

✅ **Complete Admin Dashboard** - Access at `/admin/dashboard.html`
✅ **Product Management** - Create, edit, delete products
✅ **Category Management** - Organize products by category
✅ **Order Management** - View orders and update status
✅ **Content Management** - Edit homepage, products, and contact page content
✅ **API Endpoints** - Fully functional backend APIs
✅ **Modern UI/UX** - Beautiful, responsive interface

## Getting Started (5 minutes)

### Step 1: Access Admin Panel
```
Go to: /admin/dashboard.html
```
You're in! (No authentication required currently)

### Step 2: Create First Category
1. Click "Categories" in sidebar (📂)
2. Click "+ Add New Category"
3. Enter category name (e.g., "Handicrafts")
4. (Optional) Add description and image
5. Click "Save Category"

### Step 3: Add First Product
1. Click "Products" in sidebar (📦)
2. Click "+ Add New Product"
3. Fill in:
   - **Name**: e.g., "Wooden Mask"
   - **Description**: e.g., "Beautiful handcrafted wooden mask..."
   - **Price**: e.g., 29.99
   - **Category**: Select the category you just created
   - **Image URL**: (optional) Paste image URL or leave blank
   - Check "Featured" to show on homepage
4. Click "Save Product"

### Step 4: Check Dashboard
1. Click "Dashboard" in sidebar (📊)
2. See your new stats:
   - Total Products: 1
   - Total Categories: 1
   - Orders, etc.

### Step 5: View on Website
1. Go to homepage (`/`)
2. See your new product in:
   - Featured Products section
   - Categories section
   - Products page

## Common Tasks

### Create Multiple Products
Repeat Step 3 for each product. The interface will:
- Search/filter as you type
- Show status (Active/Inactive)
- Allow quick edit/delete

### Mark Products as Featured
1. Go to Products
2. Click "Edit" on any product
3. Check "Featured Product" checkbox
4. Save

**Note:** Featured products automatically appear in:
- Homepage featured section (limit 8)
- Product cards with "Featured" badge

### Update Order Status
1. Go to Orders page (🛒)
2. Find customer order
3. Click "Update" button
4. Change status: Pending → Processing → Shipped → Delivered
5. Customer info shows name, email, full address, ordered items, total

### Manage Content
1. Go to Content (✏️)
2. Edit any section:
   - **Homepage**: Hero text, featured products section, categories section
   - **Products Page**: Page title, filter settings
   - **Contact Page**: Contact info, business hours
3. Click Save

**Note:** Content is stored in your browser's localStorage

## Important Features

### Filtering & Search
- **Products**: Search by name, filter by category/status
- **Orders**: Filter by status, search by email, sort by date/amount
- **Categories**: See all with images and product count

### Order Management
```
Order Status Flow:
Pending → Processing → Shipped → Delivered (or Cancelled)
```

Each status shows with color:
- 🟠 Orange = Pending
- 🔵 Blue = Processing  
- 🟣 Purple = Shipped
- 🟢 Green = Delivered

### Product Features
- **Featured**: Shows on homepage featured section
- **Active/Inactive**: Control visibility without deleting
- **Sales Count**: Tracks top sellers (editable)
- **Display Order**: Controls product ordering

## What's Under the Hood

### APIs (Automatic)
All endpoints at `/api/admin/`:
- `products` - Create, read, update, delete products
- `categories` - Manage categories
- `orders` - View and update orders
- `content` - Store page content

### Database
- **Supabase** (PostgreSQL)
- Tables: products, categories, orders, content
- Indexes on common queries for speed
- RLS (Row Level Security) policies

### Frontend
- **No build required** - Pure HTML/CSS/JavaScript
- **Tailwind CSS** - Modern styling
- **localStorage** - Browser-based content storage
- **Responsive** - Works on all devices

## Next Steps

### For Your E-commerce:
1. ✅ Create categories
2. ✅ Add products with prices and images
3. ✅ Mark some as featured
4. ✅ Edit homepage content to match your brand
5. ✅ Test full checkout flow
6. ✅ Update contact information

### Optional Enhancements:
- Add authentication to admin panel
- Implement image upload (currently URL-based)
- Add inventory tracking
- Set up email notifications for orders
- Create discount codes
- Add analytics

## File Locations

```
/admin/dashboard.html        ← You are here
/admin/products.html         ← Manage products
/admin/categories.html       ← Manage categories  
/admin/orders.html           ← View orders
/admin/content.html          ← Edit content

/api/admin/products.js       ← Product API
/api/admin/categories.js     ← Category API
/api/admin/orders.js         ← Orders API
```

## Troubleshooting

### Can't see products?
1. Check if category exists (need category first)
2. Refresh the page (F5)
3. Check browser console (F12)

### Orders not showing?
1. Verify customers placed orders
2. Check if orders table exists in Supabase
3. Refresh page

### Can't save changes?
1. Check internet connection
2. Verify Supabase credentials
3. Check for error messages in console

## Key Information to Keep

**Branding**: "Import From Nepal"
**Colors**: Blue (#2563EB) + Orange (#F97316)
**Database**: Supabase PostgreSQL

## Support Resources

1. **ADMIN_PANEL_GUIDE.md** - Detailed documentation
2. **API endpoints** - See `/api/admin/` folder
3. **Browser DevTools** - F12 for debugging
4. **Error messages** - Toast notifications show what went wrong

---

**You're all set!** 🚀 Start managing your e-commerce store from the admin panel.

Questions? Check ADMIN_PANEL_GUIDE.md for detailed documentation.
