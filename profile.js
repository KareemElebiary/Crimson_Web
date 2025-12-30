let cropData = {
    selectedFile: null,
    imageElement: null,
    cropBox: null,
    isDragging: false,
    isResizing: false,
    resizeHandle: null,
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
    startWidth: 0,
    startHeight: 0,
    zoom: 1
};

document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in
    checkUserSession();

    // Initialize profile functionality
    initProfileTabs();
    initProfilePicture();
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

        // Load user profile data
        loadUserProfile(data.user);
        loadUserMessages();
    } catch (error) {
        console.error('Session check error:', error);
        window.location.href = 'index.html';
    }
}

function loadUserProfile(user) {
    // Update profile header
    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-email').textContent = user.email;

    // Update navbar user info
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-email').textContent = user.email;

    // Set initials
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    document.getElementById('profile-initials').textContent = initials;

    // Update navbar avatar
    const navAvatar = document.querySelector('.user-avatar');
    if (navAvatar) {
        navAvatar.textContent = initials;
    }

    // Set joined date if available
    if (user.created_at) {
        const joinDate = new Date(user.created_at);
        document.getElementById('profile-joined-date').textContent = joinDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Load profile picture if exists
    if (user.profile_picture) {
        const profilePic = document.getElementById('profile-picture-display');
        profilePic.src = user.profile_picture;
        profilePic.style.display = 'block';
        document.getElementById('profile-initials').style.display = 'none';

        // Update navbar avatar
        if (navAvatar) {
            navAvatar.style.backgroundImage = `url(${user.profile_picture})`;
            navAvatar.style.backgroundSize = 'cover';
            navAvatar.style.backgroundPosition = 'center';
            navAvatar.textContent = '';
        }
    }

    // Show user menu
    document.querySelector('.user-menu').classList.add('active');
}

async function loadUserMessages() {
    const messagesContainer = document.getElementById('messages-container');

    try {
        const response = await fetch('profile_process.php?action=get_messages');
        const data = await response.json();

        if (data.success && data.messages && data.messages.length > 0) {
            messagesContainer.innerHTML = '';

            data.messages.forEach(message => {
                const messageCard = createMessageCard(message);
                messagesContainer.appendChild(messageCard);
            });
        } else {
            messagesContainer.innerHTML = `
                <div class="no-messages">
                    <div class="no-messages-icon">📭</div>
                    <h3>No messages yet</h3>
                    <p>You haven't sent any messages through the contact form.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading messages:', error);
        messagesContainer.innerHTML = `
            <div class="no-messages">
                <div class="no-messages-icon">⚠️</div>
                <h3>Error loading messages</h3>
                <p>Please try again later.</p>
            </div>
        `;
    }
}

function createMessageCard(message) {
    const card = document.createElement('div');
    card.className = 'message-card';

    const date = new Date(message.created_at);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    card.innerHTML = `
        <div class="message-header">
            <span class="message-date">${formattedDate}</span>
            <span class="message-status sent">Sent</span>
        </div>
        <div class="message-content">
            ${escapeHtml(message.message)}
        </div>
    `;

    return card;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function initProfileTabs() {
    const tabs = document.querySelectorAll('.profile-tab');
    const tabContents = document.querySelectorAll('.profile-tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const targetTab = this.dataset.tab;

            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
    });
}

function initProfilePicture() {
    const changeAvatarBtn = document.getElementById('change-avatar-btn');
    const profilePictureInput = document.getElementById('profile-picture-input');

    changeAvatarBtn.addEventListener('click', () => {
        profilePictureInput.click();
    });

    profilePictureInput.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 10MB for initial upload, will be reduced after crop)
        if (file.size > 10 * 1024 * 1024) {
            alert('Image size must be less than 10MB');
            return;
        }

        // Store file and open crop modal
        cropData.selectedFile = file;
        openCropModal(file);
    });

    // Initialize crop modal controls
    initCropModal();
}

function openCropModal(file) {
    const modal = document.getElementById('crop-modal');
    const cropImage = document.getElementById('crop-image');
    const cropBox = document.getElementById('crop-box');

    // Read file and display
    const reader = new FileReader();
    reader.onload = function (e) {
        cropImage.src = e.target.result;
        cropData.imageElement = cropImage;

        // Wait for image to load
        cropImage.onload = function () {
            // Initialize crop box in center
            const container = cropImage.parentElement;
            const imgRect = cropImage.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            const size = Math.min(imgRect.width, imgRect.height) * 0.7;
            const left = (imgRect.width - size) / 2;
            const top = (imgRect.height - size) / 2;

            cropBox.style.width = size + 'px';
            cropBox.style.height = size + 'px';
            cropBox.style.left = left + 'px';
            cropBox.style.top = top + 'px';

            cropData.cropBox = cropBox;

            // Update preview
            updateCropPreview();
        };
    };
    reader.readAsDataURL(file);

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Reset zoom
    document.getElementById('zoom-slider').value = 100;
    cropData.zoom = 1;
}

function initCropModal() {
    const modal = document.getElementById('crop-modal');
    const closeBtn = document.getElementById('close-crop-modal');
    const cancelBtn = document.getElementById('cancel-crop-btn');
    const applyBtn = document.getElementById('apply-crop-btn');
    const zoomSlider = document.getElementById('zoom-slider');
    const cropBox = document.getElementById('crop-box');

    // Close modal
    const closeCropModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        document.getElementById('profile-picture-input').value = '';
        cropData = {
            selectedFile: null,
            imageElement: null,
            cropBox: null,
            isDragging: false,
            isResizing: false,
            resizeHandle: null,
            startX: 0,
            startY: 0,
            startLeft: 0,
            startTop: 0,
            startWidth: 0,
            startHeight: 0,
            zoom: 1
        };
    };

    closeBtn.addEventListener('click', closeCropModal);
    cancelBtn.addEventListener('click', closeCropModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeCropModal();
        }
    });

    // Zoom slider
    zoomSlider.addEventListener('input', function () {
        const zoomValue = this.value / 100;
        cropData.zoom = zoomValue;
        document.getElementById('zoom-value').textContent = this.value + '%';

        if (cropData.imageElement) {
            cropData.imageElement.style.transform = `scale(${zoomValue})`;
            updateCropPreview();
        }
    });

    // Crop box dragging
    cropBox.addEventListener('mousedown', function (e) {
        if (e.target.classList.contains('crop-handle')) {
            // Resizing
            cropData.isResizing = true;
            cropData.resizeHandle = e.target.classList[1]; // nw, ne, sw, se
        } else {
            // Dragging
            cropData.isDragging = true;
        }

        cropData.startX = e.clientX;
        cropData.startY = e.clientY;
        cropData.startLeft = parseInt(cropBox.style.left) || 0;
        cropData.startTop = parseInt(cropBox.style.top) || 0;
        cropData.startWidth = cropBox.offsetWidth;
        cropData.startHeight = cropBox.offsetHeight;

        e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
        if (!cropData.isDragging && !cropData.isResizing) return;

        const deltaX = e.clientX - cropData.startX;
        const deltaY = e.clientY - cropData.startY;

        if (cropData.isDragging) {
            // Move crop box
            const newLeft = cropData.startLeft + deltaX;
            const newTop = cropData.startTop + deltaY;

            // Constrain to image bounds
            const maxLeft = cropData.imageElement.offsetWidth - cropBox.offsetWidth;
            const maxTop = cropData.imageElement.offsetHeight - cropBox.offsetHeight;

            cropBox.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
            cropBox.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
        } else if (cropData.isResizing) {
            // Resize crop box (maintain square aspect ratio)
            const delta = Math.max(deltaX, deltaY);
            let newSize = cropData.startWidth + delta;

            // Minimum size
            newSize = Math.max(100, newSize);

            // Maximum size (constrained by image)
            const maxSize = Math.min(
                cropData.imageElement.offsetWidth - cropData.startLeft,
                cropData.imageElement.offsetHeight - cropData.startTop
            );
            newSize = Math.min(newSize, maxSize);

            cropBox.style.width = newSize + 'px';
            cropBox.style.height = newSize + 'px';
        }

        updateCropPreview();
    });

    document.addEventListener('mouseup', function () {
        cropData.isDragging = false;
        cropData.isResizing = false;
        cropData.resizeHandle = null;
    });

    // Apply crop and upload
    applyBtn.addEventListener('click', async function () {
        const croppedBlob = await getCroppedImage();
        if (croppedBlob) {
            uploadProfilePicture(croppedBlob);
            closeCropModal();
        }
    });
}

function updateCropPreview() {
    if (!cropData.imageElement || !cropData.cropBox) return;

    const canvas = document.getElementById('preview-canvas');
    const ctx = canvas.getContext('2d');

    const cropBox = cropData.cropBox;
    const img = cropData.imageElement;

    // Get crop box position relative to image
    const cropLeft = parseInt(cropBox.style.left) || 0;
    const cropTop = parseInt(cropBox.style.top) || 0;
    const cropWidth = cropBox.offsetWidth;
    const cropHeight = cropBox.offsetHeight;

    // Calculate source coordinates accounting for zoom
    const scale = cropData.zoom;
    const imgNaturalWidth = img.naturalWidth;
    const imgNaturalHeight = img.naturalHeight;
    const imgDisplayWidth = img.offsetWidth * scale;
    const imgDisplayHeight = img.offsetHeight * scale;

    const scaleX = imgNaturalWidth / imgDisplayWidth;
    const scaleY = imgNaturalHeight / imgDisplayHeight;

    const sourceX = cropLeft * scaleX;
    const sourceY = cropTop * scaleY;
    const sourceWidth = cropWidth * scaleX;
    const sourceHeight = cropHeight * scaleY;

    // Draw to canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
        img,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, canvas.width, canvas.height
    );
}

async function getCroppedImage() {
    return new Promise((resolve) => {
        const canvas = document.getElementById('preview-canvas');
        canvas.toBlob((blob) => {
            resolve(blob);
        }, 'image/jpeg', 0.9);
    });
}

async function uploadProfilePicture(blob) {
    const formData = new FormData();
    formData.append('profile_picture', blob, 'profile.jpg');
    formData.append('action', 'update_profile_picture');

    try {
        const response = await fetch('profile_process.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            // Update profile picture display
            const profilePic = document.getElementById('profile-picture-display');
            profilePic.src = data.profile_picture + '?t=' + new Date().getTime();
            profilePic.style.display = 'block';
            document.getElementById('profile-initials').style.display = 'none';

            // Update navbar avatar
            const navAvatar = document.querySelector('.user-avatar');
            if (navAvatar) {
                navAvatar.style.backgroundImage = `url(${data.profile_picture}?t=${new Date().getTime()})`;
                navAvatar.style.backgroundSize = 'cover';
                navAvatar.style.backgroundPosition = 'center';
                navAvatar.textContent = '';
            }

            alert('Profile picture updated successfully!');
        } else {
            alert(data.message || 'Failed to update profile picture');
        }
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('An error occurred. Please try again.');
    }
}
