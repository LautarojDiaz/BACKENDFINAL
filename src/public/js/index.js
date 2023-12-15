const socket = io();

// ## APP CHAT ##
//APP MENSAJERÍA DESDE EL FRONT


  /* 1) ENVIAR MJS DESDE EL FRONT */
function sendMsg() {
  const messages = {
  user: document.getElementById("user-emit").value,
  message: document.getElementById("msg-emit").value 
}
socket.emit("chat-front-to-back", { messages })
}

  /* RECIBIR ARRAY D MJS QUE ENVIA EL BACK, MUESTRA EN PANTALLA */
socket.on('chat-back-to-all', (msgs)=> {
  let messagesHTML = '';
  msgs.forEach((msg) => {
    messagesHTML += `<p>${msg.user}:</p>
                      <p> ${msg.message}</p>`;
  });


  /* ACTUALIZAR EL CONTENIDO DE ELEMENTO divMsg */
const divMsg = document.getElementById("div-msg");
divMsg.innerHTML = messagesHTML;
})


// -----------------WEBSOCKETS------------------
// FORMULARIO CARGA DE PRODUCTOS DESDE EL FRONT 


const sendProduct = document.getElementById("submit-btn");
sendProduct.addEventListener("click", (e) => {
  e.preventDefault();

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const email = urlParams.get('email');

  const prod = {
    title: document.getElementById("product-name").value,
    description: document.getElementById("product-description").value,
    price: document.getElementById("product-price").value,
    thumbnail: document.getElementById("product-image").value,
    code: document.getElementById("product-code").value,
    stock: document.getElementById("product-stock").value,
    status: document.getElementById("product-status").value,
    category: document.getElementById("product-category").value,
    owner: email,
  };

  if (prod.title !== "" && prod.description !== "" && prod.price !== "" && prod.category !== "" && prod.code !== "" && prod.status !== "" && prod.stock !== "" && prod.thumbnail !== "") {
    socket.emit("newProduct", prod);
  } else {
    document.getElementById('err-form').innerHTML = `<p class="p-error" style="color: red">**Debe completar todos los campos</p>`;
  }
});

socket.on("productListUpdated", (data) => {
  updateProductList(data);
});






function updateProductList(products) {
const productListElement = document.getElementById("product-list");
    /* CREA CADENA D CARACTERES PARA ALMACENAR EL HTML */
let html = "";

  /* RECORRE LISTA D PRODUCTOS ACTUALIZADOS Y GENERA HTML CORRESPONDIENTE */
products.forEach((product) => {
  html += `
      <div class="card mb-3" style="">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${product.thumbnail}" class="img-fluid rounded-start" alt="...">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${product.title}</h5>
              <p class="card-text">${product.description}</p>
              <p class="card-text">${product.price}</p>
              <p class="card-text">${product.category}</p>
              <button class="btn-btn-primary" type="submit" onclick="deleteProduct('${product._id}')">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
  `;
});

  /* ACTUALIZA CONTENIDO DEL ELEMENTO "product-list" */
productListElement.innerHTML = html;
}



function deleteProduct(productId) {

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const email = urlParams.get('email');

  const prod = {
    title: document.getElementById("product-name").value,
    description: document.getElementById("product-description").value,
    price: document.getElementById("product-price").value,
    thumbnail: document.getElementById("product-image").value,
    code: document.getElementById("product-code").value,
    stock: document.getElementById("product-stock").value,
    status: document.getElementById("product-status").value,
    category: document.getElementById("product-category").value,
    owner: email,
  };

  const owner = prod.owner

  socket.emit("deleteProdId", productId, owner)
}