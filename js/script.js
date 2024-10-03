//Esconde widget de elfsight en la página principal
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        const elfsightLink = document.querySelector('.widget-container a[href*="elfsight.com"]');
        if (elfsightLink) {
            elfsightLink.style.display = 'none';
        }
    }, 1000); // Espera 2 segundos
});

//Cambiar icono en las preguntas frecuentes
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

//Ampliar imagen de servicios
let scale = 1;

function ampliarImagen(imagen) {
    const modal = document.getElementById("modal");
    const imagenAmpliada = document.getElementById("imagen-ampliada");

    modal.style.display = "block";
    imagenAmpliada.src = imagen.src;
    scale = 1; // Reiniciar el zoom al abrir la imagen
    imagenAmpliada.style.transform = `scale(${scale})`; // Aplicar el zoom inicial

    // Agregar el evento de rueda del mouse para zoom
    imagenAmpliada.onwheel = (event) => {
        event.preventDefault(); // Prevenir el desplazamiento de la página
        if (event.deltaY < 0) {
            scale += 0.1; // Acercar
        } else {
            scale = Math.max(1, scale - 0.1); // Alejar, pero no menos de 1
        }
        imagenAmpliada.style.transform = `scale(${scale})`; // Aplicar el zoom
    };
}

function cerrarModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
    scale = 1; // Reiniciar el zoom al cerrar el modal
}