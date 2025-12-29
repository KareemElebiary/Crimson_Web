// Contact Form Handler
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.querySelector('.contact-form');
    const formMessage = document.getElementById('form-message');

    // Flag to prevent multiple simultaneous submissions
    let isSubmitting = false;

    if (contactForm) {
        // Remove any existing listeners to prevent duplicates
        const newForm = contactForm.cloneNode(true);
        contactForm.parentNode.replaceChild(newForm, contactForm);

        // Get the new form reference
        const form = document.querySelector('.contact-form');
        const message = document.getElementById('form-message');

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            e.stopPropagation();

            // Prevent multiple submissions
            if (isSubmitting) {
                console.log('Form already submitting, ignoring duplicate submission');
                return false;
            }

            isSubmitting = true;

            // Get form data
            const formData = new FormData(form);

            // Disable submit button to prevent double submission
            const submitBtn = form.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            // Clear previous messages
            message.textContent = '';
            message.className = 'form-message';

            console.log('Sending contact form...');

            // Send AJAX request
            fetch('process.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Response received:', data);

                    // Show message
                    message.textContent = data.message;

                    if (data.success) {
                        message.classList.add('success');
                        // Reset form on success
                        form.reset();

                        // Auto-hide success message after 5 seconds
                        setTimeout(() => {
                            message.textContent = '';
                            message.className = 'form-message';
                        }, 5000);
                    } else {
                        message.classList.add('error');
                    }

                    // Re-enable submit button
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                    isSubmitting = false;
                })
                .catch(error => {
                    console.error('Error:', error);
                    message.textContent = 'An error occurred. Please try again.';
                    message.classList.add('error');

                    // Re-enable submit button
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                    isSubmitting = false;
                });

            return false;
        });
    }
});
