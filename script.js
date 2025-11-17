document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // VALIDACIÓN FORMULARIO
  // =========================
  const form = document.querySelector(".contacto__formulario");
  const mensajeForm = document.getElementById("form-mensaje");

  if (form && mensajeForm) {
    form.addEventListener("submit", (event) => {
      mensajeForm.textContent = "";
      mensajeForm.className = "";
      let hayError = false;

      const nombre = document.getElementById("nombreContacto");
      const email = document.getElementById("emailContacto");
      const mensaje = document.getElementById("mensaje");

      if (!nombre.value.trim()) {
        hayError = true;
        mensajeForm.textContent = "Por favor ingresá tu nombre.";
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        hayError = true;
        mensajeForm.textContent = "Por favor ingresá un correo electrónico válido.";
      }

      if (!mensaje.value.trim()) {
        hayError = true;
        mensajeForm.textContent = "Por favor escribí un mensaje.";
      }

      if (hayError) {
        event.preventDefault();
        mensajeForm.classList.add("form-error");
      } else {
        mensajeForm.textContent = "Enviando mensaje…";
        mensajeForm.classList.add("form-success");
      }
    });
  }

  // =========================
  // CARRITO CON LOCALSTORAGE
  // =========================

  let carrito = [];

  const carritoContador = document.getElementById("carrito-contador");
  const carritoVacio = document.getElementById("carrito-vacio");
  const carritoTabla = document.querySelector(".carrito__tabla");
  const carritoItems = document.getElementById("carrito-items");
  const carritoTotal = document.getElementById("carrito-total");
  const carritoBotonVaciar = document.getElementById("carrito-vaciar");

  function cargarCarritoDesdeStorage() {
    const guardado = localStorage.getItem("carrito");
    carrito = guardado ? JSON.parse(guardado) : [];
    actualizarCarritoUI();
  }

  function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  function obtenerTotalItems() {
    return carrito.reduce((acc, item) => acc + item.cantidad, 0);
  }

  function formatearPrecio(numero) {
    return "$" + numero.toLocaleString("es-AR");
  }

  function actualizarCarritoUI() {
    if (!carritoItems || !carritoTotal || !carritoContador) return;

    // contador del header
    carritoContador.textContent = obtenerTotalItems();

    // carrito vacío
    if (carrito.length === 0) {
      carritoItems.innerHTML = "";
      carritoTotal.textContent = "$0";
      if (carritoVacio) carritoVacio.style.display = "block";
      if (carritoTabla) carritoTabla.style.display = "none";
      if (carritoBotonVaciar) carritoBotonVaciar.style.display = "none";
      if (carritoTotal.parentElement) {
        carritoTotal.parentElement.style.display = "none";
      }
      return;
    }

    // carrito con productos
    if (carritoVacio) carritoVacio.style.display = "none";
    if (carritoTabla) carritoTabla.style.display = "table";
    if (carritoBotonVaciar) carritoBotonVaciar.style.display = "inline-block";
    if (carritoTotal.parentElement) {
      carritoTotal.parentElement.style.display = "flex";
    }

    carritoItems.innerHTML = "";
    let total = 0;

    carrito.forEach((item) => {
      const subtotal = item.precio * item.cantidad;
      total += subtotal;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.nombre}</td>
        <td>${formatearPrecio(item.precio)}</td>
        <td>
          <input
            type="number"
            min="1"
            value="${item.cantidad}"
            class="carrito-cantidad"
            data-id="${item.id}"
          >
        </td>
        <td>${formatearPrecio(subtotal)}</td>
        <td>
          <button class="carrito-eliminar" data-id="${item.id}">
            Eliminar
          </button>
        </td>
      `;
      carritoItems.appendChild(tr);
    });

    carritoTotal.textContent = formatearPrecio(total);
  }

  function agregarAlCarrito(desdeCard) {
    const nombreEl = desdeCard.querySelector(".producto__nombre");
    const precioEl = desdeCard.querySelector(".producto__precio");
    const imgEl = desdeCard.querySelector(".producto__imagen");

    if (!nombreEl || !precioEl) return;

    const nombre = nombreEl.textContent.trim();
    const id = nombre;

    const precioNumero = Number(precioEl.textContent.replace(/[^\d]/g, ""));

    const existente = carrito.find((item) => item.id === id);

    if (existente) {
      existente.cantidad += 1;
    } else {
      carrito.push({
        id,
        nombre,
        precio: precioNumero,
        imagen: imgEl ? imgEl.src : "",
        cantidad: 1,
      });
    }

    guardarCarrito();
    actualizarCarritoUI();
  }

  // click en "Agregar al carrito"
  document.addEventListener("click", (event) => {
    const boton = event.target.closest(".producto__boton");
    if (boton) {
      const card = boton.closest(".producto");
      if (card) {
        agregarAlCarrito(card);

        const carritoSection = document.getElementById("carrito");
        if (carritoSection) {
          carritoSection.scrollIntoView({ behavior: "smooth" });

          carritoSection.classList.add("carrito--resaltado");
          setTimeout(() => {
            carritoSection.classList.remove("carrito--resaltado");
          }, 800);
        }
      }
    }
  });

  // cambiar cantidades / eliminar
  if (carritoItems) {
    carritoItems.addEventListener("input", (event) => {
      if (event.target.classList.contains("carrito-cantidad")) {
        const id = event.target.getAttribute("data-id");
        let nuevaCantidad = parseInt(event.target.value, 10);
        if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
          nuevaCantidad = 1;
          event.target.value = "1";
        }

        const item = carrito.find((prod) => prod.id === id);
        if (item) {
          item.cantidad = nuevaCantidad;
          guardarCarrito();
          actualizarCarritoUI();
        }
      }
    });

    carritoItems.addEventListener("click", (event) => {
      if (event.target.classList.contains("carrito-eliminar")) {
        const id = event.target.getAttribute("data-id");
        carrito = carrito.filter((prod) => prod.id !== id);
        guardarCarrito();
        actualizarCarritoUI();
      }
    });
  }


  if (carritoBotonVaciar) {
    carritoBotonVaciar.addEventListener("click", () => {
      carrito = [];
      guardarCarrito();
      actualizarCarritoUI();
    });
  }

  cargarCarritoDesdeStorage();

  // =========================
  // FETCH API – PRODUCTOS EXTRA
  // =========================
  const productosApiContainer = document.getElementById("productos-api");

  if (productosApiContainer) {
    fetch("https://fakestoreapi.com/products?limit=4")
      .then((respuesta) => respuesta.json())
      .then((productos) => {
        productos.forEach((producto) => {
          const article = document.createElement("article");
          article.classList.add("producto");

          article.innerHTML = `
            <img
              src="${producto.image}"
              alt="${producto.title}"
              class="producto__imagen"
            >
            <h3 class="producto__nombre">${producto.title}</h3>
            <p class="producto__texto">
              ${producto.description.slice(0, 120)}...
            </p>
            <p class="producto__precio">$${producto.price}</p>
            <button class="producto__boton">
              <i class="fas fa-shopping-cart" aria-hidden="true"></i>
              <span>Agregar al carrito</span>
            </button>
          `;

          productosApiContainer.appendChild(article);
        });
      })
      .catch((error) => {
        console.error("Error al obtener productos:", error);
        productosApiContainer.innerHTML =
          "<p>No se pudieron cargar los productos desde la API.</p>";
      });
  }
});
