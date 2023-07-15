     /* SERVIDOR Socket.IO */
const socket = io();


    /* EVENTO productAdded */
socket.on('productAdded', (product) => {
});


    /* EVENTO productDeleted*/
socket.on('productDeleted', (productId) => {
});



    /* ENVIA FORMULARIO PARA AGREGAR UN PRODUCTO */
document.getElementById('addProductForm').addEventListener('submit', (event) => {
  event.preventDefault();



    /* OBTIENE LOS DATOS DEL FORMULARIO */
  const productName = document.getElementById('productName').value;
  const productPrice = document.getElementById('productPrice').value;


    /* ENVIA DATOS AL SERVER DESDE EL Socket.IO */
  socket.emit('addProduct', { name: productName, price: productPrice });


    /* LIMPIA EL FORMULARIO */
  document.getElementById('productName').value = '';
  document.getElementById('productPrice').value = '';
});
