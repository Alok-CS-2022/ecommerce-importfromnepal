// ============================================
// PRODUCTS PAGE SCRIPT - products.js
// ============================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Supabase Configuration
const SUPABASE_URL = 'https://tpvqolkzcbbzlqlzchwc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwdnFvbGt6Y2JiemxxbHpjaHdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjA0MjgsImV4cCI6MjA4MTkzNjQyOH0.AU6ieHN1TSUHgSu7qfvkekvmMySDPJb2zOId4Oy7CeY';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Global State
let allProducts = [];
let allCategories = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let filteredProducts = [];

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Products page initializing...');
    
    initMobileMenu();
    await loadCategories();
    await loadProducts();
    applyFilters();
    updateCartCount();
    setupEventListeners();
});

// ==================== MOBILE MENU ====================
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    
    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
        
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.add('hidden');
            });
        });
    }
}

// ==================== DATA LOADING ====================
async function loadCategories() {
    try {
        console.log('Loading categories...');
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true });
        
        if (error) throw error;
        
        allCategories = data || [];
        renderCategoryFilters();
        console.log(`✓ Loaded ${allCategories.length} categories`);
        
    } catch (error) {
        console.error('❌ Error loading categories:', error);
    }
}

function renderCategoryFilters() {
    const container = document.getElementById('category-filters');
    if (!container) return;
    
    const html = `
        <div class="flex items-center">
            <input type="radio" id="cat-all" name="category" value="" checked onchange="window.applyFilters()">
            <label for="cat-all" class="ml-2 text-gray-700 cursor-pointer">All Categories</label>
        </div>
        ${allCategories.map(cat => `
            <div class="flex items-center">
                <input type="radio" id="cat-${cat.id}" name="category" value="${cat.id}" onchange="window.applyFilters()">
                <label for="cat-${cat.id}" class="ml-2 text-gray-700 cursor-pointer">${escapeHtml(cat.name)}</label>
            </div>
        `).join('')}
    `;
    
    container.innerHTML = html;
}

async function loadProducts() {
    try {
        console.log('Loading products...');
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });
        
        if (error) throw error;
        
        allProducts = data || [];
        console.log(`✓ Loaded ${allProducts.length} products`);
        
    } catch (error) {
        console.error('❌ Error loading products:', error);
    }
}

// ==================== FILTERING & SORTING ====================
window.applyFilters = function() {
    const searchTerm = document.getElementById('search-filter').value.toLowerCase();
    const categoryId = document.querySelector('input[name="category"]:checked').value;
    const maxPrice = parseInt(document.getElementById('price-filter').value);
    const sortBy = document.getElementById('sort-filter').value;
    
    // Update price display
    document.getElementById('price-value').textContent = maxPrice;
    
    // Apply filters
    filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                             (product.description && product.description.toLowerCase().includes(searchTerm));
        const matchesCategory = !categoryId || product.category === categoryId;
        const matchesPrice = product.price <= maxPrice;
        
        return matchesSearch && matchesCategory && matchesPrice;
    });
    
    // Apply sorting
    switch (sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'popular':
            filteredProducts.sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0));
            break;
        case 'newest':
        default:
            filteredProducts.sort((a, b) => b.display_order - a.display_order);
    }
    
    renderProducts();
};

function renderProducts() {
    const container = document.getElementById('products-grid');
    if (!container) return;
    
    document.getElementById('products-count').textContent = filteredProducts.length;
    
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-16">
                <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
                <p class="text-gray-500 text-lg">No products found matching your criteria</p>
                <button onclick="window.clearFilters()" class="mt-4 text-blue-600 font-semibold hover:text-blue-700">Clear filters and try again</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredProducts.map(product => `
        <div class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group">
            <div class="aspect-square bg-gray-200 overflow-hidden relative">
                <img src="${product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80'}" 
                     alt="${escapeHtml(product.name)}" 
                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                     onerror="this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80'">
                ${product.is_featured ? '<div class="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Featured</div>' : ''}
            </div>
            
            <div class="p-4">
                <p class="text-xs text-gray-500 font-semibold uppercase tracking-wide">${product.category || 'Product'}</p>
                <h3 class="font-semibold text-gray-900 mt-2 line-clamp-2">${escapeHtml(product.name)}</h3>
                
                ${product.description ? `<p class="text-sm text-gray-600 mt-2 line-clamp-2">${escapeHtml(product.description)}</p>` : ''}
                
                <div class="flex items-center justify-between mt-4">
                    <div>
                        ${product.price ? `<p class="text-lg font-bold text-blue-600">$${parseFloat(product.price).toFixed(2)}</p>` : '<p class="text-sm text-gray-500">Contact for price</p>'}
                    </div>
                </div>
                
                <div class="flex gap-2 mt-4">
                    <button onclick="window.addToCart('${product.id}', '${escapeHtml(product.name)}', ${product.price || 0}, '${product.image_url}')" 
                            class="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                        Add
                    </button>
                    <button onclick="window.buyNow('${product.id}', '${escapeHtml(product.name)}', ${product.price || 0}, '${product.image_url}')" 
                            class="flex-1 bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ==================== CLEAR FILTERS ====================
window.clearFilters = function() {
    document.getElementById('search-filter').value = '';
    document.getElementById('price-filter').value = '1000';
    document.getElementById('price-value').textContent = '1000';
    document.getElementById('sort-filter').value = 'newest';
    document.getElementById('cat-all').checked = true;
    window.applyFilters();
};

// ==================== CART FUNCTIONS ====================
window.addToCart = function(productId, productName, price, imageUrl) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            image: imageUrl,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast(`${productName} added to cart`, 'success');
};

window.buyNow = function(productId, productName, price, imageUrl) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            image: imageUrl,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'order.html';
};

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    document.querySelectorAll('#cart-count').forEach(el => {
        if (count > 0) {
            el.textContent = count;
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    });
}

window.openCart = function() {
    const modal = document.getElementById('cart-modal');
    if (!modal) return;
    
    const itemsContainer = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('cart-subtotal');
    
    if (itemsContainer) {
        if (cart.length === 0) {
            itemsContainer.innerHTML = '<p class="text-center text-gray-500 py-8">Your cart is empty</p>';
        } else {
            itemsContainer.innerHTML = cart.map(item => `
                <div class="flex gap-4 p-4 bg-gray-50 rounded-lg mb-2 border border-gray-200">
                    <img src="${item.image}" alt="${escapeHtml(item.name)}" class="w-16 h-16 object-cover rounded">
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-900 text-sm">${escapeHtml(item.name)}</h4>
                        <p class="text-blue-600 font-bold text-sm">$${item.price} × ${item.quantity}</p>
                        <div class="flex items-center gap-2 mt-2">
                            <button onclick="window.updateCartQuantity('${item.id}', ${item.quantity - 1})" class="w-6 h-6 flex items-center justify-center border rounded text-sm">−</button>
                            <span class="w-6 text-center text-sm">${item.quantity}</span>
                            <button onclick="window.updateCartQuantity('${item.id}', ${item.quantity + 1})" class="w-6 h-6 flex items-center justify-center border rounded text-sm">+</button>
                            <button onclick="window.removeFromCart('${item.id}')" class="ml-2 text-xs text-red-600 hover:text-red-800">Remove</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
    
    if (subtotalEl) {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    }
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
};

window.closeCart = function() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
};

window.updateCartQuantity = function(productId, newQuantity) {
    if (newQuantity < 1) {
        window.removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        window.openCart();
    }
};

window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    window.openCart();
};

// ==================== UTILITY FUNCTIONS ====================
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container fixed bottom-4 right-4 z-50';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type} bg-white border-l-4 px-4 py-3 rounded shadow-lg mb-2 transform translate-x-full transition-transform duration-300`;
    
    if (type === 'success') toast.style.borderLeftColor = '#2563EB';
    if (type === 'error') toast.style.borderLeftColor = '#EF4444';
    
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function setupEventListeners() {
    window.toggleSearch = function() {
        // Implement search modal if needed
        console.log('Search clicked');
    };
}

console.log('✓ Products page script loaded');
