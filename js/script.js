
//Esconde widget de elfsight en la página principal
document.addEventListener('DOMContentLoaded', function () {
  setTimeout(() => {
      const elfsightLink = document.querySelector('.widget-container a[href*="elfsight.com"]');
      if (elfsightLink) {
          elfsightLink.style.display = 'none';
      }
  }, 1000); // Espera 2 segundos
});

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

//Reiniciar zoom al cerrar el modal
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
  contrasena= document.getElementById("contrasena2").value;
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
        console.log("datos: ", xhttp.responseText)
        let datos =  JSON.parse(xhttp.responseText);
        sessionStorage.setItem("id_sesion", JSON.stringify(datos["ID"]));
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

//xhttp.open("POST", "https://gestionturnos.pythonanywhere.com", true);
//xhttp.send();

function cargarServicios() {
    let xhttp = new XMLHttpRequest();

    // Configuramos la solicitud GET
    xhttp.open("GET", "https://gestionturnos.pythonanywhere.com/verServicios", true);

    // Configuramos la función a ejecutar cuando la respuesta esté lista
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                // Parseamos la respuesta JSON
                let servicios = JSON.parse(this.responseText);

                // Agrupar los servicios por su nombre
                const serviciosAgrupados = servicios.reduce((acc, servicio) => {
                    if (!acc[servicio.Nombre]) {
                        acc[servicio.Nombre] = [];
                    }
                    acc[servicio.Nombre].push(servicio);
                    return acc;
                }, {});

                // Seleccionamos el contenedor donde vamos a insertar los servicios
                const contenedorServicios = document.getElementById("contenedor_servicios");

                contenedorServicios.innerHTML = "";  // Limpiamos el contenedor

                // Iteramos sobre los servicios agrupados
                for (let nombre in serviciosAgrupados) {
                    // Crear el grupo de servicios para ese nombre
                    const grupoDiv = document.createElement("div");
                    grupoDiv.classList.add("card");

                    // Crear la cabecera del grupo (nombre del servicio)
                    const cardHeader = document.createElement("div");
                    cardHeader.classList.add("card-header");

                    const h2 = document.createElement("h2");
                    h2.classList.add("mb-0");

                    const button = document.createElement("button");
                    button.classList.add("btn", "btn-link");
                    button.setAttribute("type", "button");
                    button.setAttribute("data-toggle", "collapse");
                    button.setAttribute("data-target", `#collapse-${nombre}`);
                    button.setAttribute("aria-expanded", "true");
                    button.setAttribute("aria-controls", `collapse-${nombre}`);
                    button.innerText = nombre;

                    h2.appendChild(button);
                    cardHeader.appendChild(h2);
                    grupoDiv.appendChild(cardHeader);

                    // Crear el cuerpo del grupo (tipos de servicio)
                    const cardBody = document.createElement("div");
                    cardBody.id = `collapse-${nombre}`;
                    cardBody.classList.add("collapse");

                    // Iteramos sobre los servicios del mismo nombre (por ejemplo, diferentes tipos de "Esculpidas en gel")
                    serviciosAgrupados[nombre].forEach((servicio, index) => {
                        const tipoServicioDiv = document.createElement("div");

                        // Crear el tipo de servicio
                        const tipoLabel = document.createElement("label");
                        tipoLabel.innerHTML = `${servicio.Tipo_servicio} - $${servicio.Precio}`;

                        // Crear el checkbox para este servicio
                        const checkbox = document.createElement("input");
                        checkbox.type = "checkbox";
                        checkbox.id = `checkbox-${nombre}-${index}`;
                        checkbox.name = `option-${nombre}-${index}`;

                        tipoServicioDiv.appendChild(checkbox);
                        tipoServicioDiv.appendChild(tipoLabel);
                        cardBody.appendChild(tipoServicioDiv);
                    });

                    grupoDiv.appendChild(cardBody);
                    contenedorServicios.appendChild(grupoDiv);
                }
            } else {
                console.error("Error en la solicitud. Estado:", this.status);
            }
        }
    };

    // Enviamos la solicitud
    xhttp.send();
}

document.addEventListener("DOMContentLoaded", function() {
    cargarServicios();
});


//window.addEventListener("load", ()=>{
//    obtenerDia("2024-10-21")
//})
//dice el dia actual
function obtenerDia(fecha){
  const fechaObj = new Date(fecha);

// Obtener el día de la semana
const diaDeLaSemana = fechaObj.getDay();

// Crear un arreglo para los nombres de los días
const dias =  new Array()//, Lunes[""], Martes[""], Miércoles[""], Jueves[""], Viernes[""], Sábado[""]];
console.log("numindex",diaDeLaSemana)
domingo=[""]
lunes=["11:00", "12:00"]
martes=["11:00", "12:00"]
miercoles=["11:00", "12:00"]
jueves=["11:00", "12:00"]
viernes=["11:00", "12:00"]
sabado=["11:00", "12:00"]

dias.push(lunes,martes,miercoles,jueves,viernes,sabado,domingo);

  //console.log(diaDeLaSemana)
  console.log("domingo",dias[0])
  return dias[diaDeLaSemana]
}

function crearListaHorarios(dia) {
  let listaHtml = document.getElementById("lista_horas");

  listaHtml.innerHTML = ""; // Esto elimina todos los elementos anteriores

  dia.forEach(e => {
    let check = document.createElement("input");
    check.setAttribute("type", "radio");
    check.setAttribute("name", "horario");  // Asegúrate de que todos tengan el mismo nombre
    check.setAttribute("id", "horario_" + e); // Asignar ID único
    check.setAttribute("class", "checkBoxStyle");
    check.setAttribute("value", e); // Asignamos el valor del horario

    let item = document.createElement("label");
    item.setAttribute("for", check.id); // Esto asocia el label con el input
    item.appendChild(check);
    item.append(e); // Agrega el valor (hora) como texto al label

    listaHtml.appendChild(item);

  });
}

function formatear_fecha(dia, mes_year) {
console.log("ingreso a formatear fecha:")
let lista = mes_year.split(" ")
let meses= [
    {mes: "Enero", valor: "01"},
    {mes: "Febrero", valor: "02"},
    {mes: "Marzo", valor: "03"},
    {mes: "Abril", valor: "04"},
    {mes: "Mayo", valor: "05"},
    {mes: "Junio", valor: "06"},
    {mes: "Julio", valor: "07"},
    {mes: "Agosto", valor: "08"},
    {mes: "Septiembre", valor: "09"},
    {mes: "Octubre", valor: "10"},
    {mes: "Noviembre", valor: "11"},
    {mes: "Diciembre", valor: "12"}
];
let numMes= meses.find(item => item.mes === lista[0]);
console.log("numeroDeMes",numMes);
let diaFormateado = String(dia).padStart(2, '0');
let fecha = lista[1] + "-" + numMes.valor + "-" + diaFormateado;
console.log("fecha formateada",fecha);
return fecha;

}

//turnos disponibles, cargar los horarios disponibles dependiendo del dia y retarle la duraion de los turnos seleccionados
function mostrarTurnosDisponibles(fechaSeleccionada){//agregar como variable el dia
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function(e) {
if (this.readyState == 4 && this.status == 200) {
    //console.log(JSON.parse(xhttp.response))
    let turnos = JSON.parse(xhttp.response)
    let horas = new Array;
    fecha = new Array;
    turnos.forEach(turno => {
       //localStorage.setItem("fecha", turno["Fecha"])
        horas.push(turno["Hora"]) 
    });
   // Typical action to be performed when the document is ready:
   //document.getElementById("demo").innerHTML = xhttp.responseText;
   
   localStorage.setItem("horas", JSON.stringify(horas)); 
   let diaSeleccionado = obtenerDia(fechaSeleccionada);
   let imagenSinTurnos= document.getElementById("imagenDeSinTurnos");
   let listaHoras = document.getElementById("lista_horas");
   let textoTurnos = document.getElementById("textoSinTurnos");
   console.log("diasquequierover",diaSeleccionado)
   //si hay turnos en el dia seleccionado me los muestra sino me muestra que no hay
    if (diaSeleccionado.some(elemento => /\d/.test(elemento))) {
        imagenSinTurnos.style.display = 'none';
        textoTurnos.style.display = 'none';
        listaHoras.style.display = 'block';
    }else{
        imagenSinTurnos.style.display = 'block';
        textoTurnos.style.display = 'block';
        listaHoras.style.display = 'none';
    }
    
   crearListaHorarios(diaSeleccionado)
}
};
xhttp.open("GET", "https://gestionturnos.pythonanywhere.com/verTurnos", true);
xhttp.send();
}
//

//creo la lista de horarios disponibles



//Calendario
const daysTag = document.querySelector(".days");
currentDate = document.querySelector(".current-date");
prevNextIcon = document.querySelectorAll(".icons span");

// getting new date, current year and month
let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();

// storing full name of all months in array
const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
            "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

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
    liTag += `<li id="dia_${i}" onmousedown="cambia_dia(${i})" class="${isToday}">${i}</li>`;
}

for (let i = lastDayofMonth; i < 6; i++) { // creating li of next month first days
    liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
}
currentDate.innerText = `${months[currMonth]} ${currYear}`; // passing current mon and yr as currentDate text
daysTag.innerHTML = liTag;
}
renderCalendar();


/*acciones de los dias del calendario*/
function cambia_dia(fecha) {

currentDate = document.querySelector(".current-date");
console.log(currentDate.innerText)
// Primero, deseleccionamos cualquier día que esté actualmente seleccionado
let dias = document.querySelectorAll("li.seleccionado");
dias.forEach(function(li) {
    li.setAttribute("class", ""); // Limpiamos la clase de los días seleccionados
});

// Luego, seleccionamos el nuevo día
let li = document.getElementById("dia_" + fecha);
console.log(fecha)
li.setAttribute("class", "seleccionado");
let fechaSeleccionada= formatear_fecha(fecha, currentDate.innerText);
mostrarTurnosDisponibles(fechaSeleccionada);
ObtenerDatosTurno(fechaSeleccionada)
}


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

//confirmar boton
document.addEventListener('DOMContentLoaded', function() {
  const confirmarTurnoBtn = document.getElementById('confirmar-turno-btn');
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  let diaSeleccionado = false;
  let horarioSeleccionado = false;

  // Función para verificar si se cumplen las condiciones para habilitar el botón
  function verificarCondiciones() {
    const servicioSeleccionado = Array.from(checkboxes).some(checkbox => checkbox.checked);
    if (servicioSeleccionado && diaSeleccionado && horarioSeleccionado) {
      confirmarTurnoBtn.disabled = false;
    } else {
      confirmarTurnoBtn.disabled = true;
    }
  }

  // Simulación de selección de día y horario (implementa la lógica real en tu código)
  document.querySelector('.calendar').addEventListener('click', function() {
    diaSeleccionado = true;
    verificarCondiciones();
  });

  document.getElementById('lista_horas').addEventListener('click', function() {
    horarioSeleccionado = true;
    verificarCondiciones();
  });

  // Evento para activar el modal de confirmación
  confirmarTurnoBtn.addEventListener('click', function() {
    $('#confirmacionModal').modal('show');
  });

  // Evento para actualizar el estado del botón al seleccionar un servicio
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', verificarCondiciones);
  });
});
///


//obtener datos de los checkbox 
function ObtenerDatosTurno(fecha) {
  let listaHoras = document.getElementById("lista_horas");  // Contenedor de los checkboxes
  let checkboxes = listaHoras.querySelectorAll("input[type='radio']");  // Selecciona todos los checkboxes
  let horario = "";
  IDcliente= JSON.parse(sessionStorage.getItem("id_sesion"));

  // Agregar el evento para capturar el valor cuando se selecciona un checkbox
  checkboxes.forEach(function(checkbox) {
    checkbox.addEventListener("change", function() {
      // Verifica si el checkbox está seleccionado
      if (checkbox.checked) {
        hora = checkbox.value  // Imprime el valor del checkbox seleccionado
      }
    });
  });
  let datos= {
    "ID_Trabajador": 1,
    "ID_Cliente" : IDcliente,
    "ID_Servicio" : 8,
    "Fecha": fecha,
    "Hora" : hora,
    "Confirmado":"Confirmado",

  }
  return datos
}


function registrarTurno(event) {
  event.preventDefault()

  let nombre = document.getElementById("nombre").value;
  apellido =  document.getElementById("apellido").value;
  correo= document.getElementById("correo").value;
  telefono= document.getElementById("telefono").value;
  contrasena= document.getElementById("contrasena2").value;
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
  xhttp.open("POST", "https://gestionturnos.pythonanywhere.com/agregarTurno");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify(datos));
}