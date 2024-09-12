const productosUrl = './js/productos.json'; 
let productos = []; 
let carrito = [];

async function cargarProductos() {
    try {
        const response = await fetch(productosUrl);
        if (!response.ok) throw new Error('Error al cargar los productos');
        productos = await response.json(); 
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error en la carga de productos:', error);
    }
}

function mostrarProductos(productos) {
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

async function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
    mostrarMensaje('Carrito vacío');
    reproducirSonidoTacho();
    ocultarCarrito();
}

function reproducirSonido(id) {
    document.getElementById(id).play();
}

function reproducirSonidoAgregado() {
    reproducirSonido('sonido-agregado');
}

function reproducirSonidoTacho() {
    reproducirSonido('sonido-tacho');
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
        reproducirSonidoAgregado();
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

function ocultarCarrito() {
    const carritoInfo = document.getElementById('carrito-info');
    carritoInfo.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos(); 
    actualizarCarrito(); 
});
