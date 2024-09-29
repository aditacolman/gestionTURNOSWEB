document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        const elfsightLink = document.querySelector('.widget-container a[href*="elfsight.com"]');
        if (elfsightLink) {
            elfsightLink.style.display = 'none';
        }
    }, 2000); // Espera 2 segundos
});