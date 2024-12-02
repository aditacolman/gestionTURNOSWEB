var fecha_seleccion = ["1", "1"];

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
  apellido = document.getElementById("apellido").value;
  correo = document.getElementById("correo").value;
  telefono = document.getElementById("telefono").value;
  contrasena = document.getElementById("contrasena2").value;
  let datos = {
    "Nombre": nombre,
    "Apellido": apellido,
    "Correo": correo,
    "Telefono": telefono,
    "Contrasena": contrasena
  }

  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      cerrarModalesActivos()
      let modalRegistroExitoso = document.getElementById("ModalRegistroCorrecto");
      new bootstrap.Modal(modalRegistroExitoso).show();
      console.log("datos: ", datos)
    }
    else if(this.status==500){
      let modalRegistroFallido = document.getElementById("errorModalServidor");
      new bootstrap.Modal(modalRegistroFallido).show();
    }
  }
  xhttp.open("POST", "https://gestionturnos.pythonanywhere.com/agregarClientes");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify(datos));
}

function cerrarModalesActivos(){
  const modalActivos = document.querySelectorAll('.modal.show');
  modalActivos.forEach(modal => {
    let bootstrapModal = bootstrap.Modal.getInstance(modal); // Obtén la instancia del modal
    bootstrapModal.hide(); // Cierra el modal
  });
}


// Función para iniciar sesión en la WEB
function iniciar_sesion(event) {
  event.preventDefault();
  
  let modal = new bootstrap.Modal(document.getElementById('errorCorreoModal'));//inicializo el modal por si la contra o el correo esta mal
  let correo_telefono = document.getElementById("valor").value;
  let contrasena = document.getElementById("contrasena").value;
  let datos = {
    "Correo": correo_telefono,
    "Contrasena": contrasena
  };

  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function (e) {
    if (this.readyState == 4 && this.status == 200) {
      console.log("datos: ", xhttp.responseText);
      let datos = JSON.parse(xhttp.responseText);

      // Verificar si la respuesta contiene un ID válido y guardarlo en sessionStorage
      if (datos["ID"] !== undefined && datos["ID"] !== null) {
        sessionStorage.setItem("id_sesion", JSON.stringify(datos["ID"]));
        sessionStorage.setItem("Datos_Cliente", JSON.stringify(datos));
        sessionStorage.setItem("email_sesion", correo_telefono);
      } 
      else if(this.status==500){
        let modalErrorServidor = document.getElementById("errorModalServidor");
        new bootstrap.Modal(modalErrorServidor).show();
      } 
      else{
        cerrarModalesActivos()
        console.log("Error: 'ID' no encontrado en la respuesta.",this.status);
        modal.show()
      }

      // Verificar si la sesión está activa
      if (sessionStorage.getItem("id_sesion") !== null) {
        // Cambiar el contenido del modal de "Iniciar sesión" a "Inicio de sesión exitoso"
        let loginModal = document.getElementById("loginModal");

        // Ocultar el formulario de login y mostrar el mensaje de éxito
        document.getElementById("loginForm").style.display = "none";  // Ocultar el formulario
        document.getElementById("successMessage").style.display = "block"; // Mostrar el mensaje de éxito

        // Cambiar el título del modal a "Bienvenido"
        loginModal.querySelector(".modal-title").textContent = "Bienvenido";

        // Ocultar los botones de "Iniciar sesión" y "Registrarse" en el dropdown
        let btnSesion = document.getElementById("btnSesion");
        let btnRegistrarse = document.getElementById("btnRegistrarse");

        if (btnSesion && btnRegistrarse) {
          btnSesion.style.display = "none";  // Ocultar el botón de Iniciar sesión
          btnRegistrarse.style.display = "none";  // Ocultar el botón de Registrarse
        }

        // Mostrar las opciones de "Mi perfil" y "Cerrar sesión" en el dropdown
        let dropdownMenu = document.querySelector(".dropdown-menu");

        if (dropdownMenu) {
          // Crear elementos nuevos
          let perfilItem = document.createElement("li");
          perfilItem.innerHTML = '<a class="dropdown-item" href="/perfil">Mi perfil</a>';

          let cerrarSesionItem = document.createElement("li");
          cerrarSesionItem.innerHTML = '<a class="dropdown-item" href="javascript:void(0)" onclick="confirmarCerrarSesion()">Cerrar sesión</a>';

          // Agregar los nuevos elementos al dropdown
          dropdownMenu.appendChild(perfilItem);
          dropdownMenu.appendChild(cerrarSesionItem);
        }
      }
    }
  };

  xhttp.open("POST", "https://gestionturnos.pythonanywhere.com/login_web");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify(datos));
}

// Función para abrir el modal de confirmación de cierre de sesión
function confirmarCerrarSesion() {
  // Muestra el modal de confirmación de cierre de sesión
  let modal = new bootstrap.Modal(document.getElementById('confirmLogoutModal'));
  modal.show();
}

// Función para cerrar sesión
function cerrarSesion() {
  // Eliminar la sesión del sessionStorage
  sessionStorage.removeItem("id_sesion");
  sessionStorage.removeItem("Datos_Cliente");
  sessionStorage.removeItem("email_sesion");
  sessionStorage.removeItem("DatosTurno");

  // Cerrar el modal de confirmación
  let modal = bootstrap.Modal.getInstance(document.getElementById('confirmLogoutModal'));
  modal.hide();  // Esto cierra el modal de confirmación

  // Recargar la página para restaurar los elementos del dropdown
  location.reload();  // Esto recarga la página para restaurar el estado original
}

// Función para cancelar el cierre de sesión
function cancelarCerrarSesion() {
  // Cerrar el modal de confirmación sin hacer nada
  let modal = bootstrap.Modal.getInstance(document.getElementById('confirmLogoutModal'));
  modal.hide();
}



// Función para verificar si hay sesión activa y actualizar el dropdown
function checkSession() {
  // Verificar si existe la sesión activa
  let idSesion = sessionStorage.getItem("id_sesion");

  if (idSesion !== null) {
    // Si la sesión está activa, actualizar el dropdown
    let dropdownMenu = document.querySelector(".dropdown-menu");

    if (dropdownMenu) {
      // Limpiar el dropdown
      dropdownMenu.innerHTML = '';

      // Crear y añadir los elementos "Mi perfil" y "Cerrar sesión"
      let perfilItem = document.createElement("li");
      perfilItem.innerHTML = '<a class="dropdown-item" href="/perfil">Mi perfil</a>';

      let cerrarSesionItem = document.createElement("li");
      cerrarSesionItem.innerHTML = '<a class="dropdown-item" href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#confirmLogoutModal">Cerrar sesión</a>';

      // Añadir los nuevos elementos al dropdown
      dropdownMenu.appendChild(perfilItem);
      dropdownMenu.appendChild(cerrarSesionItem);
    }

    // Ocultar los botones de "Iniciar sesión" y "Registrarse"
    let btnSesion = document.getElementById("btnSesion");
    let btnRegistrarse = document.getElementById("btnRegistrarse");

    if (btnSesion && btnRegistrarse) {
      btnSesion.style.display = "none";
      btnRegistrarse.style.display = "none";
    }
  } else {
    // Si no hay sesión activa, mostrar los botones de "Iniciar sesión" y "Registrarse"
    let btnSesion = document.getElementById("btnSesion");
    let btnRegistrarse = document.getElementById("btnRegistrarse");

    if (btnSesion && btnRegistrarse) {
      btnSesion.style.display = "block";
      btnRegistrarse.style.display = "block";
    }

    // Restaurar el dropdown a su estado original
    let dropdownMenu = document.querySelector(".dropdown-menu");

    if (dropdownMenu) {
      dropdownMenu.innerHTML = `
        <li id="btnSesion"><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#loginModal">Iniciar sesión</a></li>
        <li id="btnRegistrarse"><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#registerModal">Registrarse</a></li>
      `;
    }
  }
}

// Llamar a checkSession() cuando se cargue la página
window.onload = checkSession;


// Después de cargar los servicios y agregar los elementos al acordeón, puedes hacer lo siguiente:

function cargarServicios() {
  let xhttp = new XMLHttpRequest();

  xhttp.open("GET", "https://gestionturnos.pythonanywhere.com/verServicios", true);

  xhttp.onreadystatechange = function() {
      if (this.readyState === 4) {
          if (this.status === 200) {
              let servicios = JSON.parse(this.responseText);

              const serviciosAgrupados = servicios.reduce((acc, servicio) => {
                  if (!acc[servicio.Nombre]) {
                      acc[servicio.Nombre] = [];
                  }
                  acc[servicio.Nombre].push(servicio);
                  return acc;
              }, {});

              const contenedorServicios = document.getElementById("contenedor_servicios");

              contenedorServicios.innerHTML = "";

              for (let nombre in serviciosAgrupados) {
                  const grupoDiv = document.createElement("div");
                  grupoDiv.classList.add("accordion-item");

                  const cardHeader = document.createElement("h2");
                  cardHeader.classList.add("accordion-header");
                  cardHeader.id = `heading-${nombre}`;

                  const button = document.createElement("button");
                  button.classList.add("accordion-button");
                  button.setAttribute("type", "button");
                  button.setAttribute("data-bs-toggle", "collapse");
                  button.setAttribute("data-bs-target", `#collapse-${nombre}`);
                  button.setAttribute("aria-expanded", "true");
                  button.setAttribute("aria-controls", `collapse-${nombre}`);
                  button.innerText = nombre;

                  cardHeader.appendChild(button);
                  grupoDiv.appendChild(cardHeader);

                  const cardBody = document.createElement("div");
                  cardBody.id = `collapse-${nombre}`;
                  cardBody.classList.add("accordion-collapse", "collapse");
                  cardBody.setAttribute("data-bs-parent", "#accordionExample");

                  serviciosAgrupados[nombre].forEach((servicio, index) => {
                      const tipoServicioDiv = document.createElement("div");

                      const tipoLabel = document.createElement("label");
                      tipoLabel.innerHTML = `${servicio.Tipo_servicio} - $${servicio.Precio}`;

                      const radio = document.createElement("input");
                      radio.type = "radio";
                      radio.id = `radio-${nombre}-${index}`;
                      radio.name = "servicio";
                      radio.value = servicio.ID;

                      tipoServicioDiv.appendChild(radio);
                      tipoServicioDiv.appendChild(tipoLabel);
                      cardBody.appendChild(tipoServicioDiv);

                      // Cambiar el estilo del label dinámicamente
                      tipoLabel.style.backgroundColor = "transparent";  // Fondo transparente
                      tipoLabel.style.color = "#333";  // Asegurarse de que el color de texto sea legible
                  });

                  grupoDiv.appendChild(cardBody);
                  contenedorServicios.appendChild(grupoDiv);
              }
          } else {
              console.error("Error en la solicitud. Estado:", this.status);
          }
      }
  };

  xhttp.send();
}
  
  document.addEventListener("DOMContentLoaded", function() {
    cargarServicios();
  });


//window.addEventListener("load", ()=>{
//    obtenerDia("2024-10-21")
//})
//dice el dia actual
function obtenerDia(fecha) {
  const fechaObj = new Date(fecha);

  // Obtener el día de la semana
  const diaDeLaSemana = fechaObj.getDay();

  // Crear un arreglo para los nombres de los días
  const dias = new Array()//, Lunes[""], Martes[""], Miércoles[""], Jueves[""], Viernes[""], Sábado[""]];
  console.log("numindex", diaDeLaSemana)
  domingo = [""]
  lunes = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"]
  martes = ["08:00", "09:00", "10:00", "11:00", "12:00"]
  miercoles = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"]
  jueves = ["08:00", "09:00", "10:00", "11:00", "12:00"]
  viernes = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"]
  sabado = [""]

  dias.push(lunes, martes, miercoles, jueves, viernes, sabado, domingo);

  //console.log(diaDeLaSemana)
  console.log("domingo", dias[0])
  return dias[diaDeLaSemana]
}

function listenerRadioFecha(evento) {
  // console.log(evento.target.value)
  ObtenerDatosTurno(fecha_seleccion);
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
    check.addEventListener("change", listenerRadioFecha);

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
  let meses = [
    { mes: "Enero", valor: "01" },
    { mes: "Febrero", valor: "02" },
    { mes: "Marzo", valor: "03" },
    { mes: "Abril", valor: "04" },
    { mes: "Mayo", valor: "05" },
    { mes: "Junio", valor: "06" },
    { mes: "Julio", valor: "07" },
    { mes: "Agosto", valor: "08" },
    { mes: "Septiembre", valor: "09" },
    { mes: "Octubre", valor: "10" },
    { mes: "Noviembre", valor: "11" },
    { mes: "Diciembre", valor: "12" }
  ];
  let numMes = meses.find(item => item.mes === lista[0]);
  console.log("numeroDeMes", numMes);
  let diaFormateado = String(dia).padStart(2, '0');
  let fecha = lista[1] + "-" + numMes.valor + "-" + diaFormateado;
  console.log("fecha formateada", fecha);
  return fecha;

}

function volverAIndex(){
  window.location.href = "./index.html";
}

//turnos disponibles, cargar los horarios disponibles dependiendo del dia y retarle la duraion de los turnos seleccionados
function mostrarTurnosDisponibles(fechaSeleccionada) {//agregar como variable el dia
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function (e) {
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
      let imagenSinTurnos = document.getElementById("imagenDeSinTurnos");
      let listaHoras = document.getElementById("lista_horas");
      let textoTurnos = document.getElementById("textoSinTurnos");
      console.log("diasquequierover", diaSeleccionado)
      //si hay turnos en el dia seleccionado me los muestra sino me muestra que no hay
      if (diaSeleccionado.some(elemento => /\d/.test(elemento))) {
        imagenSinTurnos.style.display = 'none';
        textoTurnos.style.display = 'none';
        listaHoras.style.display = 'block';
      } else {
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

function mostrarTurnosDeCliente() {//agregar como variable el dia
  let idSession = JSON.parse(sessionStorage.getItem("id_sesion"))
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function (e) {
    if (this.readyState == 4 && this.status == 200) {
      //console.log(JSON.parse(xhttp.response))
      let turnos = JSON.parse(xhttp.response)
      console.log(turnos)
    }else{

    }
      
  };
  xhttp.open("GET", "https://gestionturnos.pythonanywhere.com/verTurnoDeCliente/"+ idSession, true);
  xhttp.send();
  return turnos
}

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
  dias.forEach(function (li) {
    li.setAttribute("class", ""); // Limpiamos la clase de los días seleccionados
  });

  // Luego, seleccionamos el nuevo día
  let li = document.getElementById("dia_" + fecha);
  console.log(fecha)
  li.setAttribute("class", "seleccionado");
  let fechaSeleccionada = formatear_fecha(fecha, currentDate.innerText);
  mostrarTurnosDisponibles(fechaSeleccionada);
  fecha_seleccion.splice(0, 1, fechaSeleccionada)
}


prevNextIcon.forEach(icon => { // getting prev and next icons
  icon.addEventListener("click", () => { // adding click event on both icons
    // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
    currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

    if (currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
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

//VERIFICAR CONDICIONES PARA HABILITAR BOTÓN 

document.addEventListener('DOMContentLoaded', function () {
  const confirmarTurnoBtn = document.getElementById('confirmar-turno-btn');
  const calendar = document.querySelector('.calendar');  // Calendario de los días
  const listaHoras = document.getElementById('lista_horas');  // Lista de los horarios
  const acordeon = document.querySelector('#accordionExample'); // Contenedor del acordeón

  let diaSeleccionado = false;  // Verificar si se seleccionó un día
  let horarioSeleccionado = false;  // Verificar si se seleccionó un horario
  let servicioSeleccionado = false;  // Verificar si se seleccionó un servicio

  // Función para verificar si se cumplen todas las condiciones para habilitar el botón
  function verificarCondiciones() {
    console.log(`servicioSeleccionado: ${servicioSeleccionado}, diaSeleccionado: ${diaSeleccionado}, horarioSeleccionado: ${horarioSeleccionado}`);
    if (servicioSeleccionado && diaSeleccionado && horarioSeleccionado) {
      confirmarTurnoBtn.disabled = false;  // Habilitar el botón si todo está seleccionado
    } else {
      confirmarTurnoBtn.disabled = true;  // Deshabilitar el botón si falta algún elemento
    }
  }

  // Delegar el evento change para los radio buttons dentro del acordeón
  acordeon.addEventListener('change', function (event) {
    if (event.target.type === 'radio') {
      servicioSeleccionado = document.querySelector('input[name="servicio"]:checked') !== null;  // Verifica si al menos un radio está seleccionado
      console.log(`Servicio seleccionado: ${servicioSeleccionado}`);
      verificarCondiciones();  // Verificar las condiciones
    }
  });

  // Evento para seleccionar un día en el calendario
  calendar.addEventListener('click', function (event) {
    if (event.target.tagName === 'LI' && !event.target.classList.contains('inactive')) {
      diaSeleccionado = true;  // Se seleccionó un día
      console.log(`Día seleccionado: ${diaSeleccionado}`);
      verificarCondiciones();  // Verificar las condiciones
    }
  });

  // Evento para seleccionar un horario
  listaHoras.addEventListener('click', function (event) {
    if (event.target.tagName === 'LABEL') {  // Verifica si el usuario hace clic en el horario
      horarioSeleccionado = true;  // Se seleccionó un horario
      console.log(`Horario seleccionado: ${horarioSeleccionado}`);
      verificarCondiciones();  // Verificar las condiciones
    }
  });

  // Inicialmente, aseguramos que el botón está deshabilitado
  verificarCondiciones();  // Se ejecuta inmediatamente cuando se carga la página
});



//obtener datos de los checkbox 
function ObtenerDatosTurno(fechaYservicio) {
  console.log(fechaYservicio)
  let listaHoras = document.getElementById("lista_horas");  // Contenedor de los checkboxes
  let checkboxes = listaHoras.querySelectorAll("input[type='radio']");  // Selecciona todos los checkboxes
  console.log(checkboxes);

  let hora = "";  // Aquí almacenaremos la hora seleccionada
  let DatosdelCliente = JSON.parse(sessionStorage.getItem("Datos_Cliente"));
  let IDcliente = DatosdelCliente["ID"];
  console.log("seleccionada hora");

  // Recorrer todos los checkboxes (radio buttons)
  checkboxes.forEach(function (checkbox) {
    if (checkbox.checked) {
      console.log("Hora seleccionada: ", checkbox.value);  // Muestra el valor de la hora seleccionada
      hora = checkbox.value;  // Asignamos el valor de la hora seleccionada
      //return hora
    }
  });


  // Crear el objeto de datos con la información relevante
  let datos = {
    "ID_Trabajador": 1,  // Puedes cambiar esto según sea necesario
    "ID_Cliente": IDcliente,
    "ID_Servicio": fechaYservicio[1],
    "Fecha": fechaYservicio[0],
    "Hora": hora,
    "Confirmado": "Confirmado",  // Ajusta el estado según corresponda
  };
  console.log(datos)

  // Almacenar los datos en sessionStorage para su posterior uso
  sessionStorage.setItem("DatosTurno", JSON.stringify(datos));
  console.log("Datos cliente almacenados en sessionStorage:", datos);
}

function ModalIniciarSesion() {
  // Verificar si hay algún modal abierto y cerrarlo
  cerrarModalesActivos()

  // Crear el nuevo modal de error
  let modal = new bootstrap.Modal(document.getElementById('errorSesionModal'));

  // Obtener los datos de la sesión
  let datos = JSON.parse(sessionStorage.getItem("Datos_Cliente"));

  // Si no hay datos en sessionStorage, mostrar el modal de error
  if (datos == null) {
    modal.show();
  } else {
    // Si hay datos, redirigir a la página de "turno"
    window.location.href = "./turno.html";
  }
}


function registrarTurno(event) {
  event.preventDefault()

  let datos = JSON.parse(sessionStorage.getItem("DatosTurno"))
  console.log("DatosTurno", datos);

  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {

    console.log("state", this.readyState)
    console.log("status", this.status)

    // Verificar si la consulta se mandó mal
    if (this.readyState == 4 && this.status == 500) {
      $('#errorModal').modal('show');
    }
    // Si la consulta fue exitosa
    else if (this.readyState == 4 && this.status == 200) {
      $('#confirmacionModal').modal('show');
      enviarCorreo();
    }
  }

  xhttp.open("POST", "https://gestionturnos.pythonanywhere.com/agregarTurno");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify(datos));
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function enviarCorreo() {
  let correo = sessionStorage.getItem("email_sesion")
  let DatosDelTurno = JSON.parse(sessionStorage.getItem("DatosTurno"))
  let DatosDelCliente = JSON.parse(sessionStorage.getItem("Datos_Cliente"))
  let fecha = DatosDelTurno["Fecha"]
  let horario = DatosDelTurno["Hora"]
  let direccion = "madero2660"
  let nombre = DatosDelCliente["Nombre"]
  let apellido = DatosDelCliente["Apellido"]
  let datos_bd = {
    "fecha": fecha,
    "horario": horario,
    "direccion": direccion,
    "nombre": nombre,
    "apellido": apellido
  }

  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log("datos: ", datos_bd)
    }
  }

  xhttp.open("POST", "https://gestionturnos.pythonanywhere.com/confirmacion/" + correo);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify(datos_bd));

}

