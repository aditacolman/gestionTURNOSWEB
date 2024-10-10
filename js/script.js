var fechas = new Array();

//Esconde widget de elfsight en la página principal
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        const elfsightLink = document.querySelector('.widget-container a[href*="elfsight.com"]');
        if (elfsightLink) {
            elfsightLink.style.display = 'none';
        }
    }, 1000); // Espera 2 segundos
});

window.addEventListener("load", function(){
    this.localStorage.clear();
    console.log("pagina cargada")
    mostrarTurnosDisponibles()

})



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

//Función para registrar usuario WEB en la base de datos
function registrarse(event) {
    event.preventDefault()

    let nombre = document.getElementById("nombre").value;
    apellido =  document.getElementById("apellido").value;
    correo= document.getElementById("correo").value;
    telefono= document.getElementById("telefono").value;
    contrasena= document.getElementById("contrasena").value;
    let datos = {
        "Nombre": nombre,
        "Apellido": apellido,
        "Correo": correo,
        "Telefono": telefono,
        "Contrasena": contrasena
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("datos: ", datos)
        }
    }
    xhttp.open("POST", "https://gestionturnos.pythonanywhere.com/agregarClientes");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify(datos));
}

//Función para iniciar sesión en la WEB
function iniciar_sesion(event) {
    event.preventDefault()

    let correo_telefono= document.getElementById("valor").value;
    contrasena= document.getElementById("contrasena").value;
    let datos = {
        "Correo": correo_telefono,
        "Contrasena": contrasena
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(e) {
        if (this.readyState == 4 && this.status == 200) {
            console.log("datos: ", e.target.responseText)
            let datos =  JSON.parse(e.target.responseText);
            sessionStorage.setItem("id_sesion", datos[0]);
            if (sessionStorage.getItem("id_sesion")!=null){
                let btnRegistrarse =  document.getElementById("btnRegistrarse")
                btnRegistrarse.style.setProperty("visibility", "hidden")
            }
            //console.log(sessionStorage.getItem("id_sesion"))
        }
    }
    xhttp.open("POST", "https://gestionturnos.pythonanywhere.com/login_web");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify(datos));
}


//Calendario
const daysTag = document.querySelector(".days"),
currentDate = document.querySelector(".current-date"),
prevNextIcon = document.querySelectorAll(".icons span");

// getting new date, current year and month
let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();

// storing full name of all months in array
const months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];

const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // getting first day of month
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // getting last day of month
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month
    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) { // creating li of previous month last days
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) { // creating li of all days of current month
        // adding active class to li if the current day, month, and year matched
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
                     && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) { // creating li of next month first days
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`; // passing current mon and yr as currentDate text
    daysTag.innerHTML = liTag;
}
renderCalendar();

prevNextIcon.forEach(icon => { // getting prev and next icons
    icon.addEventListener("click", () => { // adding click event on both icons
        // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if(currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
            // creating a new date of current year & month and pass it as date value
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear(); // updating current year with new date year
            currMonth = date.getMonth(); // updating current month with new date month
        } else {
            date = new Date(); // pass the current date as date value
        }
        renderCalendar(); // calling renderCalendar function
    });
});

function registrarse() {
    let nombre = document.getElementById("nombre").value;
    apellido =  document.getElementById("apellido").value;
    dni= document.getElementById("dni").value;
    correo= document.getElementById("correo").value;
    console.log(nombre)
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

    }
};

//xhttp.open("POST", "https://gestionturnos.pythonanywhere.com", true);
//xhttp.send();
}

function crearListaHoras(horas){

    let listaHtml = document.getElementById("lista_horas")
    
    horas.forEach(e => {
        console.log(e)
        let check = document.createElement("input")
        check.setAttribute("type", "radio")
        check.setAttribute("name", "horario")
        check.setAttribute("class", "checkBoxStyle")
        let item = document.createElement("label")
        let valor = e
        //item.setAttribute("value", e)
        item.appendChild(check)
        item.append(valor)
        //console.log(item)
        listaHtml.appendChild(item)

    });

}


//turnos disponibles, cargar los horarios disponibles dependiendo del dia y retarle la duraion de los tunos seleccionados
function mostrarTurnosDisponibles(){//agregar como variable el dia
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function(e) {
    if (this.readyState == 4 && this.status == 200) {
        console.log(JSON.parse(xhttp.response))
        let turnos = JSON.parse(xhttp.response)
        let horas = new Array;
        turnos.forEach(turno => {
            console.log(turno)
           //localStorage.setItem("fecha", turno["Fecha"])
            horas.push(turno["Hora"]) 
        });
       // Typical action to be performed when the document is ready:
       //document.getElementById("demo").innerHTML = xhttp.responseText;
       
       localStorage.setItem("horas", JSON.stringify(horas))

       crearListaHoras(horas)
    }
};
xhttp.open("GET", "https://gestionturnos.pythonanywhere.com/verTurnos", true);
xhttp.send();
}
//
