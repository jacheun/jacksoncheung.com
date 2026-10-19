(() => {
    'use strict';

    const button = document.getElementById('contact');
    if (!button) return;

    const email = 'jacksongcheung@gmail.com';
    const originalLabel = button.textContent;
    let resetTimeout;

    button.addEventListener('click', async () => {
        window.clearTimeout(resetTimeout);

        try {
            await navigator.clipboard.writeText(email);
            button.textContent = 'Email copied';
        } catch {
            // Keep the address accessible when clipboard permission is denied.
            window.location.href = `mailto:${email}`;
            button.textContent = originalLabel;
            return;
        }

        resetTimeout = window.setTimeout(() => {
            button.textContent = originalLabel;
        }, 1500);
    });
})();
