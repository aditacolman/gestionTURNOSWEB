document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        const elfsightLink = document.querySelector('.widget-container a[href*="elfsight.com"]');
        if (elfsightLink) {
            elfsightLink.style.display = 'none';
        }
    }, 1000); // Espera 2 segundos
});

function toggleIcon(button) {
    const icon = button.querySelector('i');
    if (icon.classList.contains('bi-plus-lg')) {
        icon.classList.remove('bi-plus-lg');
        icon.classList.add('bi-dash-lg');
    } else {
        icon.classList.remove('bi-dash-lg');
        icon.classList.add('bi-plus-lg');
    }
}
