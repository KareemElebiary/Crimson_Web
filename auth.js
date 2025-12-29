// Authentication System JavaScript

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is already logged in
        this.checkSession();

        // Set up event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Modal controls
        const signInBtn = document.getElementById('signin-btn');
        const signUpBtn = document.getElementById('signup-btn');
        const authModal = document.getElementById('auth-modal');
        const closeModal = document.querySelector('.auth-close');

        if (signInBtn) {
            signInBtn.addEventListener('click', () => this.openModal('signin'));
        }

        if (signUpBtn) {
            signUpBtn.addEventListener('click', () => this.openModal('signup'));
        }

        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }

        // Close modal on outside click
        if (authModal) {
            authModal.addEventListener('click', (e) => {
                if (e.target === authModal) {
                    this.closeModal();
                }
            });
        }

        // Tab switching
        const authTabs = document.querySelectorAll('.auth-tab');
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });

        // Password toggle
        const passwordToggles = document.querySelectorAll('.toggle-password');
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', () => this.togglePassword(toggle));
        });

        // Form submissions
        const signInForm = document.getElementById('signin-form');
        const signUpForm = document.getElementById('signup-form');

        if (signInForm) {
            signInForm.addEventListener('submit', (e) => this.handleSignIn(e));
        }

        if (signUpForm) {
            signUpForm.addEventListener('submit', (e) => this.handleSignUp(e));
        }

        // User menu
        const userAvatar = document.querySelector('.user-avatar');
        const logoutBtn = document.getElementById('logout-btn');
        const profileBtn = document.getElementById('profile-btn');
        const settingsBtn = document.getElementById('settings-btn');

        if (userAvatar) {
            userAvatar.addEventListener('click', () => this.toggleUserMenu());
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        if (profileBtn) {
            profileBtn.addEventListener('click', () => {
                window.location.href = 'profile.html';
            });
        }

        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                window.location.href = 'settings.html';
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const userMenu = document.querySelector('.user-menu');
            const dropdown = document.querySelector('.user-dropdown');
            if (userMenu && dropdown && !userMenu.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }

    openModal(tab = 'signin') {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.add('active');
            this.switchTab(tab);
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            this.clearMessages();
        }
    }

    switchTab(tab) {
        // Update tab buttons
        const tabs = document.querySelectorAll('.auth-tab');
        tabs.forEach(t => {
            if (t.dataset.tab === tab) {
                t.classList.add('active');
            } else {
                t.classList.remove('active');
            }
        });

        // Update forms
        const forms = document.querySelectorAll('.auth-form');
        forms.forEach(f => {
            if (f.id === `${tab}-form`) {
                f.classList.add('active');
            } else {
                f.classList.remove('active');
            }
        });

        this.clearMessages();
    }

    togglePassword(button) {
        const input = button.previousElementSibling;
        if (input.type === 'password') {
            input.type = 'text';
            button.textContent = '👁️';
        } else {
            input.type = 'password';
            button.textContent = '👁️‍🗨️';
        }
    }

    async handleSignIn(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('.auth-submit');

        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing in...';

        try {
            const response = await fetch('auth_process.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                this.showMessage('signin-form', 'success', data.message);
                this.currentUser = data.user;

                // Check if user is admin and redirect to admin dashboard
                if (data.is_admin && data.redirect) {
                    setTimeout(() => {
                        window.location.href = data.redirect;
                    }, 1000);
                } else {
                    // Update UI for regular users
                    setTimeout(() => {
                        this.updateUIForLoggedInUser(data.user);
                        this.closeModal();
                        form.reset();
                    }, 1000);
                }
            } else {
                this.showMessage('signin-form', 'error', data.message);
            }
        } catch (error) {
            console.error('Sign in error:', error);
            this.showMessage('signin-form', 'error', 'An error occurred. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign In';
        }
    }

    async handleSignUp(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('.auth-submit');

        // Validate passwords match
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm_password');

        if (password !== confirmPassword) {
            this.showMessage('signup-form', 'error', 'Passwords do not match!');
            return;
        }

        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating account...';

        try {
            const response = await fetch('auth_process.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                this.showMessage('signup-form', 'success', data.message);

                // Switch to sign in after successful registration
                setTimeout(() => {
                    this.switchTab('signin');
                    form.reset();
                }, 2000);
            } else {
                this.showMessage('signup-form', 'error', data.message);
            }
        } catch (error) {
            console.error('Sign up error:', error);
            this.showMessage('signup-form', 'error', 'An error occurred. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Account';
        }
    }

    async handleLogout() {
        try {
            const response = await fetch('auth_process.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'action=logout'
            });

            const data = await response.json();

            if (data.success) {
                this.currentUser = null;
                this.updateUIForLoggedOutUser();
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    async checkSession() {
        try {
            const response = await fetch('auth_process.php?action=check_session');
            const data = await response.json();

            if (data.success && data.user) {
                this.currentUser = data.user;
                this.updateUIForLoggedInUser(data.user);
            }
        } catch (error) {
            console.error('Session check error:', error);
        }
    }

    updateUIForLoggedInUser(user) {
        const authButtons = document.querySelector('.auth-buttons');
        const userMenu = document.querySelector('.user-menu');
        const userName = document.getElementById('user-name');
        const userEmail = document.getElementById('user-email');
        const userAvatar = document.querySelector('.user-avatar');

        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) userMenu.classList.add('active');

        if (userName) userName.textContent = user.name;
        if (userEmail) userEmail.textContent = user.email;

        if (userAvatar) {
            // Check if user has a profile picture
            if (user.profile_picture) {
                // Display profile picture
                userAvatar.style.backgroundImage = `url(${user.profile_picture}?t=${new Date().getTime()})`;
                userAvatar.style.backgroundSize = 'cover';
                userAvatar.style.backgroundPosition = 'center';
                userAvatar.textContent = '';
            } else {
                // Display initials if no profile picture
                const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
                userAvatar.textContent = initials;
                userAvatar.style.backgroundImage = '';
            }
        }
    }

    updateUIForLoggedOutUser() {
        const authButtons = document.querySelector('.auth-buttons');
        const userMenu = document.querySelector('.user-menu');
        const dropdown = document.querySelector('.user-dropdown');

        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.classList.remove('active');
        if (dropdown) dropdown.classList.remove('active');
    }

    toggleUserMenu() {
        const dropdown = document.querySelector('.user-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }

    showMessage(formId, type, message) {
        const form = document.getElementById(formId);
        if (!form) return;

        let messageDiv = form.querySelector('.auth-message');
        if (!messageDiv) {
            messageDiv = document.createElement('div');
            messageDiv.className = 'auth-message';
            form.insertBefore(messageDiv, form.firstChild);
        }

        messageDiv.className = `auth-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.display = 'block';
    }

    clearMessages() {
        const messages = document.querySelectorAll('.auth-message');
        messages.forEach(msg => {
            msg.style.display = 'none';
            msg.textContent = '';
        });
    }
}

// Initialize authentication system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});
