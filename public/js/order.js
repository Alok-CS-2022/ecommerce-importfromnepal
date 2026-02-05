// ============================================
// ORDER PAGE SCRIPT - order.js
// ============================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Supabase Configuration
const SUPABASE_URL = 'https://tpvqolkzcbbzlqlzchwc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwdnFvbGt6Y2JiemxxbHpjaHdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjA0MjgsImV4cCI6MjA4MTkzNjQyOH0.AU6ieHN1TSUHgSu7qfvkekvmMySDPJb2zOId4Oy7CeY';

// Initialize Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Global State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const SHIPPING_COST = 15; // Flat shipping cost
const TAX_RATE = 0.08; // 8% tax

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Order page initializing...');
    
    // Initialize mobile menu
    initMobileMenu();

    // Load cart items
    loadCartItems();

    // Calculate totals
    calculateTotals();

    // Auto-fill user info if logged in
    await autofillUserInfo();

    // Setup form submission
    setupOrderForm();

    // Update cart from app.js
    updateCartDisplay();
// ==================== AUTO-FILL USER INFO ====================
async function autofillUserInfo() {
    const userToken = localStorage.getItem('user_token');
    if (!userToken) return;

    // Try to get user info from Supabase session
    try {
        // Use Supabase client to get session
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
            const user = session.user;
            // Try to get user metadata (name, phone)
            const name = user.user_metadata?.full_name || '';
            const email = user.email || '';
            const phone = user.user_metadata?.phone || '';

            // Fill form fields if present
            const nameInput = document.querySelector('input[name="customer_name"]');
            const emailInput = document.querySelector('input[name="customer_email"]');
            const phoneInput = document.querySelector('input[name="customer_phone"]');
            if (nameInput && name) nameInput.value = name;
            if (emailInput && email) emailInput.value = email;
            if (phoneInput && phone) phoneInput.value = phone;
        }
    } catch (err) {
        console.warn('Could not auto-fill user info:', err.message);
    }
}
});

// ==================== MOBILE MENU ====================
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

// ==================== CART FUNCTIONS ====================
function loadCartItems() {
    const summary = document.getElementById('order-items-summary');
    
    if (!summary) return;
    
    if (cart.length === 0) {
        summary.innerHTML = `
            <div class="text-center py-8">
                <p class="text-gray-500 mb-4">Your cart is empty</p>
                <a href="products.html" class="text-amber-700 font-semibold hover:text-amber-800">
                    Continue Shopping
                </a>
            </div>
        `;
        return;
    }
    
    summary.innerHTML = cart.map(item => `
        <div class="flex gap-3 pb-3 border-b">
            <img src="${item.image}" alt="${escapeHtml(item.name)}" class="w-16 h-16 object-cover rounded">
            <div class="flex-1">
                <p class="font-medium text-gray-900 text-sm">${escapeHtml(item.name)}</p>
                <p class="text-xs text-gray-600">Qty: ${item.quantity}</p>
                <p class="text-amber-700 font-semibold text-sm">$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
        </div>
    `).join('');
}

function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? SHIPPING_COST : 0;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + shipping + tax;
    
    // Update display
    document.getElementById('subtotal-price').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping-price').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('tax-price').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total-price').textContent = `$${total.toFixed(2)}`;
}

function updateCartDisplay() {
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

// Cart modal functions (from app.js)
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
                <div class="flex gap-4 p-4 bg-white rounded-lg border">
                    <img src="${item.image}" alt="${escapeHtml(item.name)}" class="w-20 h-20 object-cover rounded">
                    <div class="flex-1">
                        <h4 class="font-medium">${escapeHtml(item.name)}</h4>
                        <p class="text-amber-700 font-bold">$${item.price} × ${item.quantity}</p>
                        <div class="flex items-center gap-2 mt-2">
                            <button onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})" class="w-8 h-8 flex items-center justify-center border rounded">−</button>
                            <span class="w-8 text-center">${item.quantity}</span>
                            <button onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})" class="w-8 h-8 flex items-center justify-center border rounded">+</button>
                            <button onclick="removeFromCart('${item.id}')" class="ml-4 text-sm text-red-600 hover:text-red-800">Remove</button>
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
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        loadCartItems();
        calculateTotals();
        window.openCart();
    }
};

window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    loadCartItems();
    calculateTotals();
    window.openCart();
};

// ==================== ORDER FORM SUBMISSION ====================
function setupOrderForm() {
    const form = document.getElementById('order-form');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Require user login
        const userToken = localStorage.getItem('user_token');
        if (!userToken) {
            showToast('Please log in to place an order.', 'error');
            setTimeout(() => { window.location.href = '/login.html?redirect=order.html'; }, 1200);
            return;
        }

        // Validate cart
        if (cart.length === 0) {
            showToast('Your cart is empty. Please add items before placing an order.', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(form);

            // Calculate order totals
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shipping = SHIPPING_COST;
            const tax = subtotal * TAX_RATE;
            const total = subtotal + shipping + tax;

            // Prepare order data
            const orderData = {
                customer_name: formData.get('customer_name'),
                customer_email: formData.get('customer_email'),
                customer_phone: formData.get('customer_phone'),
                customer_country: formData.get('customer_country'),
                customer_address: formData.get('customer_address'),
                customer_city: formData.get('customer_city'),
                customer_state: formData.get('customer_state'),
                customer_zip: formData.get('customer_zip'),
                special_requests: formData.get('special_requests'),
                items: JSON.stringify(cart),
                subtotal: subtotal,
                shipping_cost: shipping,
                tax: tax,
                total_amount: total,
                status: 'pending',
                created_at: new Date().toISOString(),
                user_token: userToken
            };

            console.log('Submitting order:', orderData);

            try {
                // Try API endpoint first (with server-side validation)
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderData)
                });
                
                console.log('API Response status:', response.status);
                const responseText = await response.text();
                console.log('API Response text:', responseText);
                
                if (!response.ok) {
                    throw new Error(`API Error: ${response.status} - ${responseText}`);
                }
                
                if (!responseText) {
                    throw new Error('Empty response from API');
                }
                
                const result = JSON.parse(responseText);
                console.log('Order saved via API:', result);
                
            } catch (apiError) {
                console.warn('API endpoint error, saving directly to Supabase:', apiError.message);
                
                // Fallback: Save directly to Supabase
                const { data, error } = await supabase
                    .from('orders')
                    .insert([orderData]);
                
                if (error) throw error;
                
                console.log('Order saved directly to Supabase:', data);
            }
            
            // Clear cart
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Show success message
            showToast('Order placed successfully! We will contact you soon.', 'success');
            
            // Reset form
            form.reset();
            
            // Reload page after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            
        } catch (error) {
            console.error('Order submission error:', error);
            showToast('Failed to place order: ' + error.message, 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

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
    
    if (type === 'success') toast.style.borderLeftColor = '#10B981';
    if (type === 'error') toast.style.borderLeftColor = '#EF4444';
    if (type === 'warning') toast.style.borderLeftColor = '#F59E0B';
    
    toast.textContent = message;
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

console.log('✓ Order page script loaded');
