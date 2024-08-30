const productos = [
    { id: 1, nombre: 'Remera Algodón', precio: 30000, imagen: '/img/productos/remera.jpeg' },
    { id: 2, nombre: 'Short', precio: 20000, imagen: '/img/productos/short.jpeg' },
    { id: 3, nombre: 'Joggin', precio: 30000, imagen: '/img/productos/joggin.jpeg' },
    { id: 4, nombre: 'Remera Deportiva', precio: 30000, imagen: '/img/productos/REMERA-deportiva.jpg' },
    { id: 5, nombre: 'Gorrito Lana', precio: 10000, imagen: '/img/productos/GORRITO.jpeg' },
    { id: 6, nombre: 'Gorra', precio: 10000, imagen: '/img/productos/gorra.jpeg' },
    { id: 7, nombre: 'Musculosa', precio: 30000, imagen: '/img/productos/musculosa.jpeg' },
    { id: 8, nombre: 'Drop 1', precio: 45000, imagen: '/img/productos/1.jpeg' },
    { id: 9, nombre: 'Drop 2', precio: 45000, imagen: '/img/productos/2.jpeg' },
    { id: 10, nombre: 'Drop 3', precio: 45000, imagen: '/img/productos/3.jpeg' },
    { id: 11, nombre: 'Drop 4', precio: 45000, imagen: '/img/productos/4.jpeg' },
    { id: 12, nombre: 'Drop 5', precio: 45000, imagen: '/img/productos/5.jpeg' }
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function mostrarProductos() {
    const container = document.getElementById('productos-container');
    container.innerHTML = productos.map(producto => `
        <div class="producto">
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h2>${producto.nombre}</h2>
            <p>$${producto.precio}</p>
            <button onclick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
        </div>
    `).join('');
}

function mostrarMensaje(mensaje = 'Producto agregado') {
    const mensajePopup = document.getElementById('mensaje-popup');
    mensajePopup.querySelector('.message').textContent = mensaje; 
    mensajePopup.classList.add('active');

    setTimeout(() => {
        mensajePopup.classList.remove('active');
    }, 5000);
}

function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
    mostrarMensaje('Carrito vacío');
    reproducirSonidoTacho();
    ocultarCarrito();
}

function reproducirSonido() {
    document.getElementById('sonido-agregado').play();
}

function reproducirSonidoTacho() {
    document.getElementById('sonido-tacho').play();
}

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        const productoEnCarrito = carrito.find(p => p.id === id);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad++;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }
        actualizarCarrito();
        mostrarMensaje(`Producto agregado: ${producto.nombre}`);
        reproducirSonido();
        document.getElementById('carrito-icon').classList.add('active');
    }
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(p => p.id !== id);
    actualizarCarrito();
    reproducirSonidoTacho();
}

function cambiarCantidad(id, cantidad) {
    const producto = carrito.find(p => p.id === id);
    if (producto) {
        producto.cantidad += cantidad;
        if (producto.cantidad <= 0) {
            eliminarDelCarrito(id);
        } else {
            actualizarCarrito();
        }
    }
}

function actualizarCarrito() {
    const carritoInfo = document.getElementById('carrito-info');
    const carritoItems = document.getElementById('carrito-items');
    const carritoTotal = document.getElementById('carrito-total');

    carritoItems.innerHTML = carrito.map(item => `
        <div class="carrito-item">
            <img src="${item.imagen}" alt="${item.nombre}">
            <div class="item-details">
                <p>${item.nombre}</p>
                <p>$${item.precio * item.cantidad}</p>
            </div>
            <div class="item-actions">
                <button onclick="cambiarCantidad(${item.id}, -1)">-</button>
                <span>${item.cantidad}</span>
                <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
                <button onclick="eliminarDelCarrito(${item.id})">🗑️</button>
            </div>
        </div>
    `).join('');

    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    carritoTotal.textContent = `Total acumulado: $${total}`;

    if (carrito.length > 0) {
        carritoInfo.classList.add('active');
        document.getElementById('carrito-icon').classList.add('active');
    } else {
        carritoInfo.classList.remove('active');
        document.getElementById('carrito-icon').classList.remove('active');
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    localStorage.setItem('totalAcumulado', total);
}

function toggleCarritoInfo() {
    document.getElementById('carrito-info').classList.toggle('active');
}

function ocultarCarrito() {
    const carritoInfo = document.getElementById('carrito-info');
    carritoInfo.classList.remove('active');
    document.getElementById('carrito-icon').classList.remove('active');
}

document.getElementById('carrito-icon').addEventListener('click', event => {
    event.preventDefault();
    toggleCarritoInfo();
});

document.addEventListener('DOMContentLoaded', () => {
    mostrarProductos();
    actualizarCarrito();
});

const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

function setActiveLink(event) {
    navLinks.forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');
}

function cerrarMensaje() {
    const mensajePopup = document.getElementById('mensaje-popup');
    mensajePopup.classList.remove('active');
}


navLinks.forEach(link => link.addEventListener('click', setActiveLink));
