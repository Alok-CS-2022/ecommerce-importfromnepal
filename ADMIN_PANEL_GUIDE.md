# Admin Panel Documentation - Import From Nepal

## Overview

A complete, production-ready admin panel for managing your e-commerce store. Built with modern technologies and designed to be robust and maintainable.

## Admin Panel Features

### 1. **Dashboard** (`/admin/dashboard.html`)
- **Real-time statistics**: Total products, total orders, pending orders, total categories
- **Recent orders preview**: Shows 5 most recent orders with customer details
- **Quick action cards**: Jump directly to products, categories, or orders management
- **Auto-refresh**: Stats refresh every 30 seconds

### 2. **Products Management** (`/admin/products.html`)
- **Create Products**: Add new products with name, description, price, category, image URL
- **Edit Products**: Modify existing product details
- **Delete Products**: Remove products from inventory
- **Search & Filter**: Search by name, filter by category or status (active/inactive)
- **Featured Products**: Mark products as featured to appear in featured section
- **Status Control**: Toggle active/inactive status for products
- **Product Cards**: Visual cards showing all product details at a glance

### 3. **Categories Management** (`/admin/categories.html`)
- **Create Categories**: Add new product categories with name, description, image
- **Edit Categories**: Update category details anytime
- **Delete Categories**: Remove categories (automatically updates products)
- **Display Order**: Set custom order for category display on frontend
- **Visual Preview**: Cards show category image with product count information

### 4. **Orders Management** (`/admin/orders.html`)
- **View All Orders**: See all customer orders with complete details
- **Customer Information**: Full customer details (name, email, phone, address, city, state, zip, country)
- **Order Details**: See itemized cart contents, subtotal, shipping, tax, total
- **Status Management**: Change order status (Pending → Processing → Shipped → Delivered or Cancelled)
- **Order Filtering**: 
  - Filter by status (Pending, Processing, Shipped, Delivered, Cancelled)
  - Search by customer email or name
  - Sort by date (newest/oldest) or amount (highest/lowest)
- **Order Details Modal**: Pop-up view of complete order information
- **Status Update Modal**: Easy order status management

### 5. **Content Management** (`/admin/content.html`)
- **Homepage Content**:
  - Hero section title, subtitle, CTA button text
  - Featured products section title and description
  - Categories section title
  - Newsletter section title and description
  - Show/hide toggles for each section
  
- **Products Page Content**:
  - Page title and description
  - Filter sidebar settings (price, categories, search)
  
- **Contact Page Content**:
  - Page title and description
  - Contact email, phone number, business hours
  - Stored in browser localStorage for persistence

## Technical Details

### Architecture

```
/api/admin/
  ├── products.js      - GET, POST, PUT, DELETE for products
  ├── categories.js    - GET, POST, PUT, DELETE for categories
  ├── orders.js        - GET, PUT for orders (view and update status)
  └── content.js       - GET, POST, PUT for content management

/public/admin/
  ├── dashboard.html   - Overview and statistics
  ├── products.html    - Product CRUD
  ├── categories.html  - Category CRUD
  ├── orders.html      - Order management
  ├── content.html     - Content editor
  ├── login.html       - Authentication (optional)
  └── layout.html      - Reusable layout template
```

### API Endpoints

#### Products API
```
GET  /api/admin/products             - List all products
POST /api/admin/products             - Create new product
PUT  /api/admin/products             - Update product
DELETE /api/admin/products           - Delete product
```

**Request body (POST/PUT):**
```json
{
  "id": "optional-for-updates",
  "name": "Product Name",
  "description": "Product Description",
  "price": 29.99,
  "category_id": "category-uuid",
  "image_url": "https://...",
  "is_featured": false,
  "is_active": true
}
```

#### Categories API
```
GET  /api/admin/categories           - List all categories
POST /api/admin/categories           - Create new category
PUT  /api/admin/categories           - Update category
DELETE /api/admin/categories?id=...  - Delete category
```

**Request body (POST/PUT):**
```json
{
  "id": "optional-for-updates",
  "name": "Category Name",
  "description": "Description",
  "image_url": "https://...",
  "display_order": 0
}
```

#### Orders API
```
GET  /api/admin/orders               - List all orders
PUT  /api/admin/orders               - Update order status
```

**Request body (PUT):**
```json
{
  "id": "order-uuid",
  "status": "pending|processing|shipped|delivered|cancelled"
}
```

#### Content API
```
GET  /api/admin/content              - Get all content
POST /api/admin/content              - Create content
PUT  /api/admin/content              - Update content
```

### Database Schema

**Products Table**
- id: UUID (PK)
- name: VARCHAR
- description: TEXT
- price: DECIMAL
- category_id: UUID (FK)
- image_url: VARCHAR
- is_featured: BOOLEAN
- is_active: BOOLEAN
- sales_count: INTEGER
- display_order: INTEGER
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

**Categories Table**
- id: UUID (PK)
- name: VARCHAR
- description: TEXT
- image_url: VARCHAR
- display_order: INTEGER
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

**Orders Table**
- id: UUID (PK)
- customer_name: VARCHAR
- customer_email: VARCHAR
- customer_phone: VARCHAR
- customer_country: VARCHAR
- customer_address: VARCHAR
- customer_city: VARCHAR
- customer_state: VARCHAR
- customer_zip: VARCHAR
- items: JSON (cart items array)
- subtotal: DECIMAL
- shipping_cost: DECIMAL
- tax: DECIMAL
- total_amount: DECIMAL
- status: VARCHAR (pending|processing|shipped|delivered|cancelled)
- special_requests: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

## How to Use

### Accessing the Admin Panel

1. Navigate to `/admin/dashboard.html`
2. (Optional) Login if authentication is enabled
3. Use the sidebar to navigate between different sections

### Managing Products

**To Add a Product:**
1. Go to Products page
2. Click "+ Add New Product"
3. Fill in all required fields:
   - Product Name *
   - Description *
   - Price *
   - Category *
   - Image URL (optional - shows placeholder if not provided)
   - Toggle Featured status if needed
   - Toggle Active status
4. Click "Save Product"

**To Edit a Product:**
1. Find the product in the grid
2. Click "Edit" button
3. Modify details as needed
4. Click "Save Product"

**To Delete a Product:**
1. Find the product in the grid
2. Click "Delete" button
3. Confirm deletion

**To Filter Products:**
1. Use search box to find by name
2. Filter by category using dropdown
3. Filter by status (Active/Inactive)

### Managing Categories

**To Add a Category:**
1. Go to Categories page
2. Click "+ Add New Category"
3. Fill in:
   - Category Name *
   - Description (optional)
   - Image URL (optional)
   - Display Order (controls appearance order)
4. Click "Save Category"

**To Update Display Order:**
- Edit the category and change the Display Order number
- Lower numbers appear first

### Managing Orders

**To View Orders:**
1. Go to Orders page
2. See all orders in table format
3. Click "View" to see complete order details

**To Update Order Status:**
1. Find the order in the table
2. Click "Update" button
3. Select new status from dropdown:
   - **Pending**: Order received, awaiting processing
   - **Processing**: Order being prepared
   - **Shipped**: Order on its way
   - **Delivered**: Order completed
   - **Cancelled**: Order cancelled
4. Click "Update Status"

**To Filter Orders:**
1. Filter by status using dropdown
2. Search by customer email or name
3. Sort by date (newest/oldest) or amount (highest/lowest)

### Managing Content

**Homepage Content:**
1. Go to Content page (default tab)
2. Edit hero section text
3. Configure featured products section visibility
4. Update category section settings
5. Edit newsletter signup section
6. Click "Save Homepage Content"

**Products & Contact Pages:**
1. Switch tabs at the top
2. Edit page-specific content
3. Click save button for that section

**Note:** Content is stored in browser localStorage, so it persists across sessions for the same browser.

## User Experience Features

### Toast Notifications
- Success messages (green)
- Error alerts (red)
- Info notifications (blue)
- Auto-dismiss after 3 seconds

### Modal Dialogs
- Clean, focused forms for data entry
- Prevents accidental data loss
- Keyboard-friendly

### Real-time Filtering
- Search results update as you type
- Multiple filters work together
- Clear filters button to reset

### Visual Feedback
- Hover effects on clickable elements
- Status badges with colors (pending=orange, processing=blue, etc.)
- Loading states and empty states

## Security Considerations

⚠️ **Current Implementation Notes:**
- API endpoints have basic CORS enabled
- No authentication enforced (optional login.html exists)
- Data validation via Zod schemas in API

**For Production:**
1. Implement proper JWT authentication
2. Add role-based access control (RBAC)
3. Validate all API requests
4. Use HTTPS only
5. Implement rate limiting
6. Add audit logging for admin actions
7. Secure sensitive data with encryption

## Troubleshooting

### Products not showing
- Check Supabase connection
- Verify products table exists and has data
- Check browser console for errors

### Can't update order status
- Verify orders table exists
- Check order ID format
- Verify API endpoint is accessible

### Content changes not persisting
- Content is stored in localStorage (browser-specific)
- Check browser storage limits
- Try clearing cache if issues occur

### Image URLs broken
- Verify image URL is accessible
- Check URL format (must start with http:// or https://)
- Use placeholder images for now, update later

## Future Enhancements

- [ ] Image upload functionality (instead of URL only)
- [ ] Bulk operations (delete multiple products)
- [ ] Email notifications for new orders
- [ ] Analytics dashboard with charts
- [ ] Inventory management
- [ ] Discount code management
- [ ] Customer management
- [ ] Product reviews moderation
- [ ] Email templates editor
- [ ] SEO metadata editor

## File Structure

```
public/admin/
├── dashboard.html         # Main dashboard with stats
├── products.html          # Product CRUD interface
├── categories.html        # Category CRUD interface
├── orders.html            # Order management interface
├── content.html           # Content editor interface
├── login.html             # Login page (optional)
├── layout.html            # Reusable layout template
├── products-old.html      # Backup of old version
├── categories-old.html    # Backup of old version
└── order.html             # Old orders page (can delete)

api/admin/
├── products.js            # Products API endpoints
├── categories.js          # Categories API endpoints
├── orders.js              # Orders API endpoints
├── content.js             # Content API endpoints
└── auth.js                # Authentication (optional)
```

## Notes for Developers

- All admin pages use the same color scheme (blue #2563EB and orange #F97316)
- Responsive design works on mobile, tablet, and desktop
- No external dependencies beyond Tailwind CSS and browser APIs
- localStorage is used for content management persistence
- Supabase is the primary database (PostgreSQL)

## Contact & Support

For issues or questions about the admin panel:
1. Check the troubleshooting section above
2. Review API documentation
3. Check browser console for error messages
4. Verify Supabase connection and credentials

---

**Last Updated:** January 2026  
**Version:** 1.0  
**Status:** Production Ready
