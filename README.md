El proyecto consiste en una página web completa desarrollada aplicando todos los contenidos del curso Front-End. El sitio representa un estudio de diseño de interiores (“Noctem Designs”) e integra estructura semántica, estilos responsivos, interactividad con JavaScript y consumo de una API pública.

A continuación se detalla cómo se cumplió cada punto de la consigna:

1. HTML semántico

La estructura del sitio utiliza etiquetas semánticas como:
<header>, <nav>, <main>, <section>, <article>, <footer>

2. Formulario de contacto funcional

Se implementó un formulario con los campos requeridos (nombre, correo y mensaje), validado mediante JavaScript.
El envío se realiza a través de Formspree según lo solicitado.

3. Estilos con CSS y Responsive Design

Se utilizó un archivo externo style.css con:

Flexbox para organizar las tarjetas de productos
Grid para la sección de reseñas
Media queries para adaptar el formulario de contacto y el diseño general
Google Fonts y propiedades de background
Accesibilidad: colores legibles y etiquetas asociadas a inputs

4. Productos organizados en cards

La sección de productos está maquetada con Flexbox, e incluye:

Imagen
Nombre
Descripción
Precio
Botón de “Agregar al carrito”
Además, se sumó una subsección “Recomendados desde la API”.

5. Integración de API REST

Se consumió la API:
https://fakestoreapi.com/products?limit=4
Los productos se muestran dinámicamente en tarjetas manteniendo el estilo general.

6. Carrito de compras dinámico

Desarrollado íntegramente en JavaScript:

Agregar productos desde las cards
Editar cantidades
Eliminar productos
Cálculo automático de subtotal y total
Persistencia con LocalStorage
Contador de productos en el menú

7. Interactividad con JavaScript

El archivo script.js incluye:

Validación del formulario
Manipulación del DOM
Render dinámico de productos desde API
Actualización en tiempo real del carrito
Eventos y lógica de negocio
