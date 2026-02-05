// ============================================
// HOME PAGE SCRIPT - home.js
// ============================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Supabase Configuration
const SUPABASE_URL = 'https://tpvqolkzcbbzlqlzchwc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwdnFvbGt6Y2JiemxxbHpjaHdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjA0MjgsImV4cCI6MjA4MTkzNjQyOH0.AU6ieHN1TSUHgSu7qfvkekvmMySDPJb2zOId4Oy7CeY';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Global State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = [];
let allCategories = [];

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Home page initializing...');
    
    initMobileMenu();
    await loadProducts();
    await loadCategories();
    await loadFeaturedProducts();
    await loadTopSellers();
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
async function loadProducts() {
    try {
        console.log('Loading all products...');
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

async function loadCategories() {
    try {
        console.log('Loading categories...');
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true });
        
        if (error) throw error;
        
        allCategories = data || [];
        displayCategories();
        console.log(`✓ Loaded ${allCategories.length} categories`);
        
    } catch (error) {
        console.error('❌ Error loading categories:', error);
    }
}

function displayCategories() {
    const container = document.getElementById('categories-grid');
    if (!container) return;
    
    if (allCategories.length === 0) {
        container.innerHTML = '<p class="col-span-full text-center text-gray-500">No categories available</p>';
        return;
    }
    
    container.innerHTML = allCategories.map(cat => `
        <a href="products.html?category=${encodeURIComponent(cat.id)}" class="group">
            <div class="bg-gradient-to-br from-blue-100 to-orange-100 rounded-lg h-24 flex items-center justify-center group-hover:shadow-lg transition transform group-hover:-translate-y-1">
                <div class="text-center">
                    <div class="text-2xl mb-2">📦</div>
                    <p class="font-semibold text-gray-900 text-sm">${escapeHtml(cat.name)}</p>
                </div>
            </div>
        </a>
    `).join('');
}

async function loadFeaturedProducts() {
    try {
        console.log('Loading featured products...');
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .eq('is_featured', true)
            .limit(8)
            .order('display_order', { ascending: true });
        
        if (error) throw error;
        
        const featured = data || [];
        displayProductGrid(featured, 'featured-products-grid');
        console.log(`✓ Loaded ${featured.length} featured products`);
        
    } catch (error) {
        console.error('❌ Error loading featured products:', error);
    }
}

async function loadTopSellers() {
    try {
        console.log('Loading top sellers...');
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .gte('sales_count', 5) // Products with at least 5 sales
            .limit(8)
            .order('sales_count', { ascending: false });
        
        if (error) throw error;
        
        const topSellers = data || [];
        displayProductGrid(topSellers, 'top-sellers-grid');
        console.log(`✓ Loaded ${topSellers.length} top seller products`);
        
    } catch (error) {
        console.error('❌ Error loading top sellers:', error);
    }
}

function displayProductGrid(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (products.length === 0) {
        container.innerHTML = '<p class="col-span-full text-center text-gray-500">No products available</p>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group">
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
                
                <div class="flex items-center justify-between mt-4">
                    <div>
                        ${product.price ? `<p class="text-lg font-bold text-blue-600">$${parseFloat(product.price).toFixed(2)}</p>` : '<p class="text-sm text-gray-500">Contact for price</p>'}
                    </div>
                </div>
                
                <div class="flex gap-2 mt-4">
                    <button onclick="addToCart('${product.id}', '${escapeHtml(product.name)}', ${product.price || 0}, '${product.image_url}')" 
                            class="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                        Add
                    </button>
                    <button onclick="buyNow('${product.id}', '${escapeHtml(product.name)}', ${product.price || 0}, '${product.image_url}')" 
                            class="flex-1 bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ==================== CART FUNCTIONS ====================
function addToCart(productId, productName, price, imageUrl) {
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
    
    if (window.innerWidth < 768) {
        openCart();
    }
}

function buyNow(productId, productName, price, imageUrl) {
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
}

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
                        <h4 class="font-semibold text-gray-900">${escapeHtml(item.name)}</h4>
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

// ==================== SEARCH FUNCTIONS ====================
window.toggleSearch = function() {
    const modal = document.getElementById('search-modal');
    if (modal) {
        modal.classList.toggle('hidden');
        if (!modal.classList.contains('hidden')) {
            document.getElementById('search-input').focus();
        }
    }
};

window.searchProducts = function(query) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;
    
    if (!query.trim()) {
        resultsContainer.innerHTML = '<p class="text-gray-500 text-center py-8">Start typing to search...</p>';
        return;
    }
    
    const searchTerm = query.toLowerCase();
    const results = allProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        (p.description && p.description.toLowerCase().includes(searchTerm))
    ).slice(0, 8);
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p class="text-gray-500 text-center py-8">No products found</p>';
        return;
    }
    
    resultsContainer.innerHTML = results.map(product => `
        <div class="flex gap-4 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition" onclick="window.location.href='products.html?search=${encodeURIComponent(query)}'">
            <img src="${product.image_url}" alt="${escapeHtml(product.name)}" class="w-12 h-12 object-cover rounded">
            <div class="flex-1">
                <p class="font-semibold text-gray-900">${escapeHtml(product.name)}</p>
                <p class="text-blue-600 font-bold text-sm">$${parseFloat(product.price).toFixed(2)}</p>
            </div>
        </div>
    `).join('');
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
    if (type === 'info') toast.style.borderLeftColor = '#F97316';
    
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
    // Add global exports for external use
    window.addToCart = addToCart;
    window.buyNow = buyNow;
    window.showToast = showToast;
    window.escapeHtml = escapeHtml;
}

console.log('✓ Home page script loaded');
