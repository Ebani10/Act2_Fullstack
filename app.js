// Clase Tarea
class Tarea {
  constructor(nombre, completa = false) {
    this.id = Date.now();
    this.nombre = nombre;
    this.completa = completa;
  }

  editar(nuevoNombre) {
    this.nombre = nuevoNombre;
  }

  cambiarEstado() {
    this.completa = !this.completa;
  }
}

// Clase GestorDeTareas
class GestorDeTareas {
  constructor() {
    this.tareas = JSON.parse(localStorage.getItem("tareas")) || [];
  }

  agregar(tarea) {
    this.tareas.push(tarea);
    this.guardar();
  }

  eliminar(id) {
    this.tareas = this.tareas.filter(t => t.id !== id);
    this.guardar();
  }

  guardar() {
    localStorage.setItem("tareas", JSON.stringify(this.tareas));
  }
}

// DOM
const inputTarea = document.getElementById("inputTarea");
const btnAgregar = document.getElementById("btnAgregar");
const listaTareas = document.getElementById("listaTareas");
const mensajeError = document.getElementById("mensajeError");

const gestor = new GestorDeTareas();

// Renderizar tareas
const renderizar = () => {
  listaTareas.innerHTML = "";

  gestor.tareas.forEach(tarea => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span class="${tarea.completa ? 'completa' : ''}">
        ${tarea.nombre}
      </span>
      <div>
        <button data-id="${tarea.id}" class="editar">Editar</button>
        <button data-id="${tarea.id}" class="eliminar">Eliminar</button>
      </div>
    `;

    li.querySelector("span").addEventListener("click", () => {
      tarea.completa = !tarea.completa;
      gestor.guardar();
      renderizar();
    });

    li.querySelector(".editar").addEventListener("click", () => {
      const nuevoNombre = prompt("Editar tarea:", tarea.nombre);
      if (nuevoNombre && nuevoNombre.trim() !== "") {
        tarea.editar(nuevoNombre.trim());
        gestor.guardar();
        renderizar();
      }
    });

    li.querySelector(".eliminar").addEventListener("click", () => {
      gestor.eliminar(tarea.id);
      renderizar();
    });

    listaTareas.appendChild(li);
  });
};

// Agregar tarea
btnAgregar.addEventListener("click", () => {
  const texto = inputTarea.value.trim();

  if (texto === "") {
    mensajeError.textContent = "No puedes agregar una tarea vacía.";
    return;
  }

  mensajeError.textContent = "";
  const nuevaTarea = new Tarea(texto);
  gestor.agregar(nuevaTarea);
  inputTarea.value = "";
  renderizar();
});

// Inicial
renderizar();
