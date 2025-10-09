document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for user's preferred theme from system settings
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
        body.classList.remove('light-theme');
    } else {
        body.classList.add('light-theme');
    }

    // Toggle theme on button click
    toggleButton.addEventListener('click', () => {
        body.classList.toggle('light-theme');
    });
});