document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        const elfsightLink = document.querySelector('.widget-container a[href*="elfsight.com"]');
        if (elfsightLink) {
            elfsightLink.style.display = 'none';
        }
    }, 1000); // Espera 2 segundos
});

$(document).ready(function () {
    $('.collapse').on('shown.bs.collapse', function () {
        $(this).parent().find(".fa-plus").removeClass("fa-plus").addClass("fa-minus");
    }).on('hidden.bs.collapse', function () {
        $(this).parent().find(".fa-minus").removeClass("fa-minus").addClass("fa-plus");
    });
});
