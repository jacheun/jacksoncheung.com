(() => {
    'use strict';

    const viewer = document.querySelector('.image-viewer');
    if (!viewer) return;

    const enlargedImage = viewer.querySelector('img');
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let trigger = null;
    let thumbnail = null;
    let animation = null;
    let closing = false;

    function thumbnailTransform() {
        const small = thumbnail.getBoundingClientRect();
        const large = enlargedImage.getBoundingClientRect();
        return `translate(${small.left - large.left}px, ${small.top - large.top}px) scale(${small.width / large.width}, ${small.height / large.height})`;
    }

    function animateImage(from, to) {
        return enlargedImage.animate([{ transform: from }, { transform: to }], {
            duration: motionPreference.matches ? 0 : 300,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        });
    }

    document.querySelectorAll('.solution-image').forEach(button => {
        button.addEventListener('click', () => {
            trigger = button;
            thumbnail = button.querySelector('img');
            enlargedImage.src = thumbnail.currentSrc || thumbnail.src;
            enlargedImage.alt = thumbnail.alt;
            // Set the aspect ratio before the full-size image finishes decoding.
            enlargedImage.width = thumbnail.naturalWidth || thumbnail.width;
            enlargedImage.height = thumbnail.naturalHeight || thumbnail.height;
            viewer.showModal();
            const start = thumbnailTransform();
            thumbnail.style.visibility = 'hidden';
            animation = animateImage(start, 'none');
        });
    });

    async function closeViewer() {
        if (closing || !viewer.open) return;
        closing = true;
        animation?.cancel();
        const end = thumbnailTransform();
        viewer.classList.add('is-closing');
        animation = animateImage('none', end);
        await animation.finished.catch(() => {});
        viewer.close();
    }

    viewer.querySelector('button').addEventListener('click', closeViewer);
    viewer.addEventListener('click', event => {
        if (event.target === viewer) closeViewer();
    });
    viewer.addEventListener('cancel', event => {
        event.preventDefault();
        closeViewer();
    });
    viewer.addEventListener('close', () => {
        animation?.cancel();
        viewer.classList.remove('is-closing');
        thumbnail?.style.removeProperty('visibility');
        enlargedImage.removeAttribute('src');
        trigger?.focus({ preventScroll: true });
        closing = false;
    });
})();
