// Constants for local storage keys
const LOCAL_STORAGE = {
    USERS: 'teamtune_users',
    MOODS: 'teamtune_moods',
    NOTES: 'teamtune_notes',
    CURRENT_USER: 'teamtune_current_user'
};

// Initialize local data if needed
function initializeLocalData() {
    // Initialize users if not exist
    if (!localStorage.getItem(LOCAL_STORAGE.USERS)) {
        const dummyUsers = [
            { id: '1', name: 'Tim Naruto', email: 'tim@naruto.com', password: 'password123', role: 'user' },
            { id: '2', name: 'Admin Fasilitator', email: 'admin@teamtune.com', password: 'admin123', role: 'admin' }
        ];
        localStorage.setItem(LOCAL_STORAGE.USERS, JSON.stringify(dummyUsers));
    }

    // Initialize moods if not exist
    if (!localStorage.getItem(LOCAL_STORAGE.MOODS)) {
        localStorage.setItem(LOCAL_STORAGE.MOODS, JSON.stringify([]));
    }

    // Initialize notes if not exist
    if (!localStorage.getItem(LOCAL_STORAGE.NOTES)) {
        localStorage.setItem(LOCAL_STORAGE.NOTES, JSON.stringify([]));
    }
}

// Initialize data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeLocalData();
    
    // Check current page to avoid redirect loop
    const currentPage = window.location.pathname.split('/').pop();
    
    // Only check for existing login on login/register pages
    if (currentPage === 'login.html' || currentPage === 'register.html' || currentPage === '') {
        // Check if user is already logged in - if so, redirect to appropriate dashboard
        const currentUser = localStorage.getItem(LOCAL_STORAGE.CURRENT_USER);
        if (currentUser) {
            // User is already logged in, redirect based on role
            const user = JSON.parse(currentUser);
            if (user.role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'user-dashboard.html';
            }
            return;
        }
    }
    
    // Check which form is on the page and set up the appropriate handlers
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Get users from local storage
    const users = JSON.parse(localStorage.getItem(LOCAL_STORAGE.USERS)) || [];
    
    // Find user with matching email and password
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Store current user in local storage (without password)
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem(LOCAL_STORAGE.CURRENT_USER, JSON.stringify(userWithoutPassword));
        
        // Redirect to appropriate dashboard based on role
        if (user.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'user-dashboard.html';
        }
    } else {
        alert('Invalid email or password. Please try again.');
    }
}

// Handle registration form submission
function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    // Validate passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match. Please try again.');
        return;
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem(LOCAL_STORAGE.USERS)) || [];
    
    // Check if email is already in use
    if (users.some(user => user.email === email)) {
        alert('Email is already registered. Please use a different email or login.');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(), // Use timestamp as ID
        name,
        email,
        password,
        role: 'user' // Default role is user
    };
    
    // Add to users array
    users.push(newUser);
    
    // Save to local storage
    localStorage.setItem(LOCAL_STORAGE.USERS, JSON.stringify(users));
    
    // Save current user (without password)
    const { password: pwd, ...userWithoutPassword } = newUser;
    localStorage.setItem(LOCAL_STORAGE.CURRENT_USER, JSON.stringify(userWithoutPassword));
    
    alert('Registration successful! Redirecting to dashboard...');
    
    // Redirect to user dashboard
    window.location.href = 'user-dashboard.html';
}
