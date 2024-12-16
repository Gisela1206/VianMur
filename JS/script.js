// configuracion de productos con stock y dctos
const productos = {
    cuenco: {
        nombre: 'Cuenco',
        precio: 5000,
        stock: 20,
        descuento: 0.1,
        disenio: "Cuenco pintado a mano, de 13cm de diámetro x 12 de profundidad, ideal para servir snacks o salsas para acompañar unos dips.",
        descripcionAmpliada: "Puedes encontrarlo en colores tierra, como así también en colores pastel."
    },
    colador: {
        nombre: 'Colador',
        precio: 10000,
        stock: 5,
        descuento: 0.05,
        disenio: "Colador de arcilla blanca, pintado a mano. 15cm de diámetro x 10cm de profundidad. Para colar pastas, dejar secar frutas y verduras.",
        descripcionAmpliada: "Puede ser que llegue en este color o en otros colores."
    },
    mate: {
        nombre: 'Mate',
        precio: 4000,
        stock: 4,
        descuento: 0,
        disenio: "Pequeño mate de arcilla roja, tratado con óxido y esmalte. Para los mates y tererés de tus desayunos y meriendas.",
        descripcionAmpliada: "Si quieres agregar la bombilla puedes hacerlo."
    },
    plato: {
        nombre: 'Plato',
        precio: 8000,
        stock: 40,
        descuento: 0.15,
        disenio: "Plato torneado, pintado con pátinas y engobes, y guardas esgrafiadas. 20 cm de diametro. Apto para calentar en microondas tus comidas de todos los días.",
        descripcionAmpliada: "Puedes encargarlos todos del mismo color o de colores variados."
    },
    taza: {
        nombre: 'Taza',
        precio: 9000,
        stock: 50,
        descuento: 0.2,
        disenio: "Taza de pasta blanca, pintada a mano con óxido de cobalto y terminación de esgrafiado. 9cm de diámetro y 10 cm de altura. Apta microondas.",
        descripcionAmpliada: "Sirve para compartir un desayuno o merienda con amigos, es grande para unas largas charlas."
    },
   /* tazaViole: {
        nombre: 'Taza Viole',
        precio: 7000,
        stock: 3,
        descuento: 0,
        disenio: "Taza torneada con pasta enriquecida con óxido de manganeso, pintada a mano con engobes en tonos naranjas y ocres, de 9 cm de diámetro y 10 de alto. Apta microondas.",
        descripcionAmpliada: "Puedes encontrarlo en colores tierra, como así también en colores pastel"
    },*/

    };
    
    const IVA = 0.21;
    
    document.addEventListener('DOMContentLoaded', cargarCarrito);
    
    function agregarAlCarrito(nombre, precio, productoKey) {
        const producto = productos[productoKey];

            if(producto.stock <= 0) {
            alert('Sin stock!');
            return;
        }

       renderizarCarrito();  
       
        // obtener la info del carrito del LS
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
        // agregar nuevo producto
        carrito.push({
            nombre: producto.nombre,
            precio: producto.precio,
            productoKey: productoKey
        });
    
        // reducir stock
        producto.stock--;
        document.getElementById(`stock-${productoKey}`).textContent = producto.stock;
    
        // Guardar en LS
        localStorage.setItem('carrito',JSON.stringify(carrito));
    
        // actualizar la vista
        renderizarCarrito();  
    }

    function renderizarCarrito() {
        const listaCarrito = document.getElementById('lista-carrito');
        const subtotalCarrito = document.getElementById('subtotal-carrito');
        const descuentoCarrito = document.getElementById('descuento-carrito');
        const ivaCarrito = document.getElementById('iva-carrito');
        const totalCarrito = document.getElementById('total-carrito');
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        
        // Limpiar lista anterior
        listaCarrito.innerHTML = '';
        
        // Totales iniciales
        let subtotal = 0;
        let descuentoTotal = 0;
        
        // Renderizar cada producto
       
             carrito.forEach((producto, index) => {
             const productoInfo = productos[producto.productoKey];
                const li = document.createElement('li');
            
            // Calcular descuento individual
            const descuentoProducto = productoInfo.descuento * producto.precio;
            const precioConDescuento = producto.precio - descuentoProducto;
            
            li.innerHTML = `
                ${producto.nombre} - $${producto.precio} 
                ${productoInfo.descuento > 0 ? 
                    `<span class="descuento">(Desc. ${(productoInfo.descuento * 100).toFixed(0)}%: 
                    -$${descuentoProducto.toFixed(2)})</span>` 
                    : ''}
            `;
            
            // Botón para eliminar producto
            const botonEliminar = document.createElement('button');
            botonEliminar.textContent = 'Eliminar';
            botonEliminar.onclick = () => eliminarDelCarrito(index);
            
            li.appendChild(botonEliminar);
            listaCarrito.appendChild(li);
            
            // Sumar al subtotal y descuentos
            subtotal += producto.precio;
            descuentoTotal += descuentoProducto;
        });
        
        // Calcular IVA
        const ivaTotal = (subtotal - descuentoTotal) * IVA;
        const total = subtotal - descuentoTotal + ivaTotal;
        
        // Actualizar totales
        subtotalCarrito.textContent = subtotal.toFixed(2);
        descuentoCarrito.textContent = descuentoTotal.toFixed(2);
        ivaCarrito.textContent = ivaTotal.toFixed(2);
        totalCarrito.textContent = total.toFixed(2);
    }
    
    function eliminarDelCarrito(index) {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        
        // Recuperar el producto para devolver stock
        const producto = productos[carrito[index].productoKey];
        producto.stock++;
        document.getElementById(`stock-${carrito[index].productoKey}`).textContent = producto.stock;
        
        // Eliminar producto por índice
        carrito.splice(index, 1);
        
        // Actualizar localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        // Renderizar de nuevo
        renderizarCarrito();
    }
    
    function vaciarCarrito() {
        // Restaurar stock de todos los productos
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carrito.forEach(item => {
            const producto = productos[item.productoKey];
            producto.stock++;
            document.getElementById(`stock-${item.productoKey}`).textContent = producto.stock;
        });
        
        // Limpiar localStorage
        localStorage.removeItem('carrito');
        
        // Renderizar
        renderizarCarrito();
    }

       

    
    function cargarCarrito() {
        // Cargar carrito al iniciar la página
        renderizarCarrito();
    }
    
    // Funciones de Checkout
    function mostrarCheckout() {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        
        // Validar que hay productos en el carrito
        if (carrito.length === 0) {
            alert('El carrito está vacío');
            return;
        }
        
        // Mostrar modal de checkout
        const modal = document.getElementById('checkout-modal');
        modal.style.display = 'flex';
        
        // Actualizar totales en el modal
        const subtotal = parseFloat(document.getElementById('subtotal-carrito').textContent);
        const descuento = parseFloat(document.getElementById('descuento-carrito').textContent);
        const iva = parseFloat(document.getElementById('iva-carrito').textContent);
        const total = parseFloat(document.getElementById('total-carrito').textContent);
        
        document.getElementById('modal-subtotal').textContent = subtotal.toFixed(2);
        document.getElementById('modal-descuento').textContent = descuento.toFixed(2);
        document.getElementById('modal-iva').textContent = iva.toFixed(2);
        document.getElementById('modal-total').textContent = total.toFixed(2);
    }
    
    function realizarCompra() {
        // Simular compra
        alert('¡Compra realizada con éxito!');
        
        // Vaciar carrito
        localStorage.removeItem('carrito');
        
        // Cerrar modal
        cerrarCheckout();
        
        // Renderizar carrito vacío
        renderizarCarrito();
    }
    
    function cerrarCheckout() {
        const modal = document.getElementById('checkout-modal');
        modal.style.display = 'none';
    }






    // Función para agregar el botón "Ver Más" y la descripción ampliada
    function agregarVerMas(productoKey) {
        const producto = productos[productoKey];
        const productoDiv = document.querySelector(`.producto[data-producto="${productoKey}"]`);
        const tarjetaContent = productoDiv.querySelector('.tarjeta-content');
    
        // Crear el botón "Ver Más"
        const verMasButton = document.createElement('button');
        verMasButton.textContent = 'Ver Más';
        verMasButton.classList.add('ver-mas-button');
    
        // Crear el párrafo de descripción ampliada
        const descripcionAmpliada = document.createElement ('p');
        descripcionAmpliada.innerHTML = `Descripción ampliada: ${producto.descripcionAmpliada}`;
        descripcionAmpliada.classList.add('descripcion-ampliada');
        descripcionAmpliada.style.display = 'none'; // Inicialmente oculto
    
        // Agregar evento de clic al botón
        verMasButton.addEventListener('click', () => {
        descripcionAmpliada.style.display = descripcionAmpliada.style.display === 'none' ? 'block' : 'none';

        // Puedes cambiar el texto del botón si lo deseas
            verMasButton.textContent = descripcionAmpliada.style.display === 'none' ? 'Ver Más' : 'Ocultar';
        });
    
        // Agregar el botón y la descripción al div del producto
        tarjetaContent.appendChild(verMasButton);
        tarjetaContent.appendChild(descripcionAmpliada);

       // <p class="descripcion-ampliada">Descripción ampliada: Puedes encontrarlo en colores tierra, como así también en colores pastel</p>
    }
    
    // Modificar el HTML para incluir atributos data-producto
    function renderizarProductos() {
        const productosDiv = document.getElementById('productos') ;

        productosDiv.innerHTML = ''; // Limpiar productos anteriores
    
        for (const productoKey in productos) {
            const producto = productos[productoKey];
    
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto');
            productoDiv.setAttribute('data-producto', productoKey);  // Agregar atributo data-producto


            productoDiv.innerHTML = `
            <a href="#">
                <figure>
                    <img src="../IMG/${productoKey}.jpeg" alt="${producto.nombre}">
                </figure>
            </a>
            <div class="tarjeta-content">
                <h3>${producto.nombre}</h3>
                <p class="disenio">${producto.disenio}</p>
                <span>Importe: $${producto.precio}</span>
                <span>Stock: <span id="stock-${productoKey}">${producto.stock}</span></span>
                <button onclick="agregarAlCarrito('${producto.nombre}', ${producto.precio}, '${productoKey}')">Agregar</button>
                <p class="descripcion-ampliada" style="display: none;">Descripción Ampliada: $ {producto.descripcionAmpliada}</p>
            </div>
            `;

        productosDiv.appendChild(productoDiv);

        // Agregar el botón "Ver Más" y la descripción
        agregarVerMas(productoKey);
    }
}

// Llamar a renderizarProductos() para crear los divs de producto con atributos data-producto
//renderizarProductos();
    
//buscando soluciones
document.addEventListener('DOMContentLoaded', () => {
   renderizarProductos();
   cargarCarrito();
});
