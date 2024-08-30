let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let totalAcumulado = parseFloat(localStorage.getItem('totalAcumulado')) || 0;

const sonidoAgregado = document.getElementById('sonido-agregado');
const sonidoTacho = document.getElementById('sonido-tacho');
const popup = document.getElementById('popup');
const cerrarPopup = document.getElementById('cerrar-popup');
const cerrarPopup2 = document.getElementById('cerrar-popup2');
const descargarFactura = document.getElementById('descargar-factura');
const errorPopup = document.getElementById('error-popup');
const errorMessage = document.getElementById('error-message');
const cerrarErrorPopup = document.getElementById('cerrar-error-popup');

function actualizarCarrito() {
    const carritoContainer = document.getElementById('carrito-container');
    const totalContainer = document.getElementById('carrito-total');
    carritoContainer.innerHTML = '';

    carrito.forEach((item, index) => {
        carritoContainer.innerHTML += `
            <div class="carrito-item">
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="carrito-item-details">
                    <h4>${item.nombre}</h4>
                    <div class="cantidad-container">
                        <button class="btn btn-secondary" onclick="cambiarCantidad(${index}, -1)">-</button>
                        <span>${item.cantidad}</span>
                        <button class="btn btn-secondary" onclick="cambiarCantidad(${index}, 1)">+</button>
                    </div>
                </div>
                <div class="carrito-item-price">
                    <p>Total: $${(item.precio * item.cantidad).toFixed(2)}</p>
                    <button class="btn btn-danger" onclick="eliminarProducto(${index})">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>`;
    });

    totalContainer.textContent = `Total a Pagar: $${totalAcumulado.toFixed(2)}`;
}

function cambiarCantidad(index, cantidad) {
    const item = carrito[index];
    const cantidadAnterior = item.cantidad;

    item.cantidad += cantidad;
    
    if (item.cantidad < 1) {
        eliminarProducto(index);
        return;
    }

    totalAcumulado += (item.precio * item.cantidad) - (item.precio * cantidadAnterior);

    localStorage.setItem('carrito', JSON.stringify(carrito));
    localStorage.setItem('totalAcumulado', totalAcumulado);
    actualizarCarrito();

    reproducirSonido(sonidoAgregado);
}

function eliminarProducto(index) {
    const item = carrito[index];
    totalAcumulado -= item.precio * item.cantidad;

    carrito.splice(index, 1);

    if (carrito.length === 0) {
        totalAcumulado = 0;
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    localStorage.setItem('totalAcumulado', totalAcumulado);
    actualizarCarrito();

    reproducirSonido(sonidoTacho);
}

function vaciarCarrito() {
    carrito = [];
    totalAcumulado = 0;

    localStorage.removeItem('carrito');
    localStorage.removeItem('totalAcumulado');
    actualizarCarrito();
}

function finalizarCompra() {
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const correo = document.getElementById('correo').value;
    const direccion = document.getElementById('direccion').value;
    const pais = document.getElementById('pais').value;
    const ciudad = document.getElementById('ciudad').value;

    if (!nombre || !apellido || !correo || !direccion || !pais || !ciudad) {
        mostrarError('Por favor, completa todos los campos');
        return;
    }

    popup.style.display = 'flex';
    
    cerrarPopup.removeEventListener('click', cerrarPopupHandler);
    cerrarPopup.addEventListener('click', cerrarPopupHandler);

    cerrarPopup2.removeEventListener('click', cerrarPopup2Handler);
    cerrarPopup2.addEventListener('click', cerrarPopup2Handler);

    descargarFactura.removeEventListener('click', descargarFacturaHandler);
    descargarFactura.addEventListener('click', descargarFacturaHandler);

    setTimeout(() => {
        popup.style.display = 'none';
        vaciarCarrito();
    }, 10000);
}

function cerrarPopupHandler() {
    popup.style.display = 'none';
}

function cerrarPopup2Handler() {
    popup.style.display = 'none';
    vaciarCarrito();
}

function descargarFacturaHandler() {
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const correo = document.getElementById('correo').value;
    const direccion = document.getElementById('direccion').value;
    const pais = document.getElementById('pais').value;
    const ciudad = document.getElementById('ciudad').value;
    generarFactura(nombre, apellido, correo, direccion, pais, ciudad);
    popup.style.display = 'none';
    vaciarCarrito();
}

function generarFactura(nombre, apellido, correo, direccion, pais, ciudad) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Factura de Compra', 10, 20);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre: ${nombre} ${apellido}`, 10, 40);
    doc.text(`Correo: ${correo}`, 10, 50);
    doc.text(`Dirección: ${direccion}`, 10, 60);
    doc.text(`País: ${pais}`, 10, 70);
    doc.text(`Ciudad: ${ciudad}`, 10, 80);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Productos:', 10, 100);

    let y = 110;
    carrito.forEach(item => {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text(`${item.nombre}: $${(item.precio * item.cantidad).toFixed(2)} (${item.cantidad} cantidad)`, 10, y);
        y += 10;
    });

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', 10, y + 10);
    doc.text(`$${totalAcumulado.toFixed(2)}`, 190, y + 10, { align: 'right' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.text('Gracias por su compra!', 10, y + 30);

    doc.save('factura.pdf');
}

function reproducirSonido(sonido) {
    if (sonido) {
        sonido.play();
    }
}

function mostrarError(mensaje) {
    errorMessage.textContent = mensaje;
    errorPopup.style.display = 'flex';

    cerrarErrorPopup.removeEventListener('click', cerrarErrorPopupHandler);
    cerrarErrorPopup.addEventListener('click', cerrarErrorPopupHandler);
}

function cerrarErrorPopupHandler() {
    errorPopup.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', actualizarCarrito);
