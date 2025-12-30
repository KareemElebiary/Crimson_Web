// Settings Page JavaScript

$(document).ready(function () {
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
    $('#user-name').text(user.name);
    $('#user-email').text(user.email);

    // Set initials or profile picture
    const $userAvatar = $('.user-avatar');
    if ($userAvatar.length) {
        if (user.profile_picture) {
            $userAvatar.css({
                'background-image': `url(${user.profile_picture}?t=${new Date().getTime()})`,
                'background-size': 'cover',
                'background-position': 'center'
            }).text('');
        } else {
            const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
            $userAvatar.css('background-image', '').text(initials);
        }
    }

    // Populate update form
    $('#update-name').val(user.name);
    $('#update-email').val(user.email);

    // Show user menu
    $('.user-menu').addClass('active');
}

function initSettingsNavigation() {
    const $navItems = $('.settings-nav-item');
    const $contentSections = $('.settings-content');

    $navItems.on('click', function () {
        const targetSection = $(this).data('section');

        // Remove active class from all nav items and sections
        $navItems.removeClass('active');
        $contentSections.removeClass('active');

        // Add active class to clicked nav item and corresponding section
        $(this).addClass('active');
        $(`#${targetSection}-section`).addClass('active');
    });
}

function initUpdateProfile() {
    const $form = $('#update-profile-form');
    const $messageDiv = $('#update-profile-message');

    $form.on('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        formData.append('action', 'update_profile');

        $messageDiv.text('').removeClass('success error form-message').addClass('form-message');

        try {
            const response = await fetch('profile_process.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                $messageDiv.text(data.message).addClass('success');

                // Update displayed info in navbar
                $('#user-name').text(formData.get('name'));
                $('#user-email').text(formData.get('email'));

                // Update avatar initials if no profile picture
                const $userAvatar = $('.user-avatar');
                if ($userAvatar.length && !$userAvatar.css('background-image') || $userAvatar.css('background-image') === 'none') {
                    const initials = formData.get('name').split(' ').map(n => n[0]).join('').toUpperCase();
                    $userAvatar.text(initials);
                }
            } else {
                $messageDiv.text(data.message).addClass('error');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            $messageDiv.text('An error occurred. Please try again.').addClass('error');
        }
    });
}

function initResetPassword() {
    const $form = $('#reset-password-form');
    const $messageDiv = $('#reset-password-message');

    $form.on('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const newPassword = formData.get('new_password');
        const confirmPassword = formData.get('confirm_password');

        // Validate passwords match
        if (newPassword !== confirmPassword) {
            $messageDiv.text('New passwords do not match!');
            $messageDiv.removeClass('success error').addClass('form-message error');
            return;
        }

        // Validate password length
        if (newPassword.length < 6) {
            $messageDiv.text('New password must be at least 6 characters long!');
            $messageDiv.removeClass('success error').addClass('form-message error');
            return;
        }

        formData.append('action', 'reset_password');

        $messageDiv.text('').removeClass('success error').addClass('form-message');

        try {
            const response = await fetch('profile_process.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                $messageDiv.text(data.message).addClass('success');
                this.reset();
            } else {
                $messageDiv.text(data.message).addClass('error');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            $messageDiv.text('An error occurred. Please try again.').addClass('error');
        }
    });
}

function initDeleteAccount() {
    const $deleteBtn = $('#delete-account-btn');
    const $modal = $('#delete-modal');
    const $closeModal = $('#close-delete-modal');
    const $cancelBtn = $('#cancel-delete-btn');
    const $form = $('#confirm-delete-form');
    const $messageDiv = $('#delete-message');

    $deleteBtn.on('click', () => {
        $modal.addClass('active');
        $('body').css('overflow', 'hidden');
    });

    const closeDeleteModal = () => {
        $modal.removeClass('active');
        $('body').css('overflow', '');
        $form[0].reset();
        $messageDiv.text('').removeClass('success error').addClass('form-message');
    };

    $closeModal.on('click', closeDeleteModal);
    $cancelBtn.on('click', closeDeleteModal);

    $modal.on('click', (e) => {
        if ($(e.target).is($modal)) {
            closeDeleteModal();
        }
    });

    $form.on('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        formData.append('action', 'delete_account');

        $messageDiv.text('').removeClass('success error').addClass('form-message');

        try {
            const response = await fetch('profile_process.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                $messageDiv.text('Account deleted. Redirecting...').addClass('success');

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                $messageDiv.text(data.message).addClass('error');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            $messageDiv.text('An error occurred. Please try again.').addClass('error');
        }
    });
}
