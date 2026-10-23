const btnConsultar = document.getElementById("btnConsultar");
const ciudad = document.getElementById("ciudad");
const fecha = document.getElementById("fecha");
const resultados = document.getElementById("resultados");
const mensaje = document.getElementById("mensaje");
const seccionResultados = document.getElementById("seccionResultados");
const seccionFiltro = document.getElementById("seccionFiltro");
const filtro = document.getElementById("Filtro");
let datosSolar = [];

btnConsultar.addEventListener("click",obtenerDatos);
filtro.addEventListener("change",aplicarFiltro);

async function obtenerDatos(){
    ocultarMensaje();
    
    const coordenadas = ciudad.value.split(",");
    const lat = coordenadas [0];
    const lng = coordenadas [1];
    const fechaSeleccionada = fecha.value;

    if (fechaSeleccionada ===""){
        mostrarMensaje("selecciona una fecha.");
        return;
    }
    const url = `https://api.sunrise-sunset.org/json?
    lat=${lat}&lng=${lng}&date=${fechaSeleccionada}&formatted=0`;

    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok){
            throw new Error("Error al conectar con la API");
        }
        const data = await respuesta.json();
        datosSolar = [
            {
                tipo: "amanecer",
                titulo:"Amanecer",
                valor: convertirHora (data.results.sunrise)
            },
            {
                tipo:"atardecer",
                titulo: "Atardecer",
                valor: convertirHora (data.results.sunset)
            },
            {
                tipo: "duracion",
                titulo: "Duracion del dia",
                valor: convertirDuracion(data.results.day_length)
            },
            {
                tipo:"mediodia",
                titulo:"Medio Solar",
                valor: convertirHora(data.results.solar_noon)
            }
        ];
            mostrarResultados(datosSolar);
            seccionResultados.classList.remove("d-none");
            seccionFiltro.classList.remove("d-none");
    } catch (error) {
        mostrarMensaje(error.message);
        console.error(error);

    }
}
    function mostrarResultados(datosSolar) {
    resultados.innerHTML = "";
    datosSolar.forEach(dato => {
        resultados.innerHTML += `
        <div class="col-md-4">
            <div class="card shadow h-100">

              <div class="card-body text-center">
                <h5 class="card-title">
                    ${dato.titulo}
                </h5>
                <p class="card-text fs-5">
                    ${dato.valor}
                </p>
                </div>  
            </div>
        </div>
        
    
        `;
    });
}
function aplicarFiltro() {
const opcion = filtro.value;
if (opcion === "todos") {

mostrarResultados(datosSolar);
return;

}

const datosFiltrados = datosSolar.filter(

dato => dato.tipo === opcion
);

mostrarResultados(datosFiltrados);
}

function convertirHora(hora) {

const fechaHora = new Date(hora);

return fechaHora.toLocaleTimeString("es-CL", {

hour: "2-digit",

minute: "2-digit",

second: "2-digit"
});

}

function convertirDuracion(segundos) {

const horas = Math.floor(segundos / 3600);

const minutos = Math.floor(

(segundos % 3600) / 60
);

return `${horas} horas ${minutos} minutos`;

}

function mostrarMensaje(texto) {

mensaje.textContent = texto;

mensaje.classList.remove("d-none");

}

function ocultarMensaje() {
mensaje.classList.add("d-none");
}
