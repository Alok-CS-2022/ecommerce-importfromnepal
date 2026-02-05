// Admin API Configuration
// This determines where API calls are sent from admin pages

// Detect if we're on localhost and adjust API endpoint accordingly
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const currentPort = window.location.port;

// If running on a different port (like 5500 from Live Server),
// redirect API calls to the actual server on 3006
let API_BASE_URL = '';

if (isDevelopment && currentPort !== '3006' && currentPort !== '') {
    // Running on Live Server or other dev server, use explicit port 3006
    API_BASE_URL = 'http://localhost:3006';
} else {
    // Use relative paths (works when on correct port or production)
    API_BASE_URL = '';
}

// Helper function to construct full API URLs
function apiUrl(path) {
    return API_BASE_URL + path;
}
