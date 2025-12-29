// Settings Page JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in
    checkUserSession();

    // Initialize settings functionality
    initSettingsNavigation();
    initUpdateProfile();
    initResetPassword();
    initDeleteAccount();
});

async function checkUserSession() {
    try {
        const response = await fetch('auth_process.php?action=check_session');
        const data = await response.json();

        if (!data.success || !data.user) {
            // Redirect to home if not logged in
            window.location.href = 'index.html';
            return;
        }

        // Load user data
        loadUserData(data.user);
    } catch (error) {
        console.error('Session check error:', error);
        window.location.href = 'index.html';
    }
}

function loadUserData(user) {
    // Update navbar user info
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-email').textContent = user.email;

    // Set initials or profile picture
    const userAvatar = document.querySelector('.user-avatar');
    if (userAvatar) {
        if (user.profile_picture) {
            userAvatar.style.backgroundImage = `url(${user.profile_picture}?t=${new Date().getTime()})`;
            userAvatar.style.backgroundSize = 'cover';
            userAvatar.style.backgroundPosition = 'center';
            userAvatar.textContent = '';
        } else {
            const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
            userAvatar.textContent = initials;
        }
    }

    // Populate update form
    document.getElementById('update-name').value = user.name;
    document.getElementById('update-email').value = user.email;

    // Show user menu
    document.querySelector('.user-menu').classList.add('active');
}

function initSettingsNavigation() {
    const navItems = document.querySelectorAll('.settings-nav-item');
    const contentSections = document.querySelectorAll('.settings-content');

    navItems.forEach(item => {
        item.addEventListener('click', function () {
            const targetSection = this.dataset.section;

            // Remove active class from all nav items and sections
            navItems.forEach(nav => nav.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));

            // Add active class to clicked nav item and corresponding section
            this.classList.add('active');
            document.getElementById(`${targetSection}-section`).classList.add('active');
        });
    });
}

function initUpdateProfile() {
    const form = document.getElementById('update-profile-form');
    const messageDiv = document.getElementById('update-profile-message');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        formData.append('action', 'update_profile');

        messageDiv.textContent = '';
        messageDiv.className = 'form-message';

        try {
            const response = await fetch('profile_process.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                messageDiv.textContent = data.message;
                messageDiv.classList.add('success');

                // Update displayed info in navbar
                document.getElementById('user-name').textContent = formData.get('name');
                document.getElementById('user-email').textContent = formData.get('email');

                // Update avatar initials if no profile picture
                const userAvatar = document.querySelector('.user-avatar');
                if (userAvatar && !userAvatar.style.backgroundImage) {
                    const initials = formData.get('name').split(' ').map(n => n[0]).join('').toUpperCase();
                    userAvatar.textContent = initials;
                }
            } else {
                messageDiv.textContent = data.message;
                messageDiv.classList.add('error');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            messageDiv.textContent = 'An error occurred. Please try again.';
            messageDiv.classList.add('error');
        }
    });
}

function initResetPassword() {
    const form = document.getElementById('reset-password-form');
    const messageDiv = document.getElementById('reset-password-message');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(this);

        // Validate passwords match
        if (formData.get('new_password') !== formData.get('confirm_password')) {
            messageDiv.textContent = 'New passwords do not match!';
            messageDiv.className = 'form-message error';
            return;
        }

        // Validate password length
        if (formData.get('new_password').length < 6) {
            messageDiv.textContent = 'New password must be at least 6 characters long!';
            messageDiv.className = 'form-message error';
            return;
        }

        formData.append('action', 'reset_password');

        messageDiv.textContent = '';
        messageDiv.className = 'form-message';

        try {
            const response = await fetch('profile_process.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                messageDiv.textContent = data.message;
                messageDiv.classList.add('success');
                form.reset();
            } else {
                messageDiv.textContent = data.message;
                messageDiv.classList.add('error');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            messageDiv.textContent = 'An error occurred. Please try again.';
            messageDiv.classList.add('error');
        }
    });
}

function initDeleteAccount() {
    const deleteBtn = document.getElementById('delete-account-btn');
    const modal = document.getElementById('delete-modal');
    const closeModal = document.getElementById('close-delete-modal');
    const cancelBtn = document.getElementById('cancel-delete-btn');
    const form = document.getElementById('confirm-delete-form');
    const messageDiv = document.getElementById('delete-message');

    deleteBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeModal.addEventListener('click', closeDeleteModal);
    cancelBtn.addEventListener('click', closeDeleteModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDeleteModal();
        }
    });

    function closeDeleteModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        form.reset();
        messageDiv.textContent = '';
        messageDiv.className = 'form-message';
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        formData.append('action', 'delete_account');

        messageDiv.textContent = '';
        messageDiv.className = 'form-message';

        try {
            const response = await fetch('profile_process.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                messageDiv.textContent = 'Account deleted. Redirecting...';
                messageDiv.classList.add('success');

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                messageDiv.textContent = data.message;
                messageDiv.classList.add('error');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            messageDiv.textContent = 'An error occurred. Please try again.';
            messageDiv.classList.add('error');
        }
    });
}
