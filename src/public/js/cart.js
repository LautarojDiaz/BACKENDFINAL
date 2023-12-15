function getCartId() {
        /* OBTIENE CART ID */
    return fetch('/api/carts/get-cart-id')
        .then(response => response.json())
        .then(data => {
            const cartId = data.cartId;
            return cartId;
        });
  }
  
  function deleteProduct(productId) {
    
    getCartId()
        .then(cartId => {
            /* DELETE */
            return fetch(`/api/carts/${cartId}/product/${productId}`, {
                method: 'DELETE',
            });
        })
        .then((response) => {
            if (response.status === 201) {
                location.reload();
            } else {
                console.error('Error al eliminar el producto');
            }
        })
        .catch((error) => {
            console.error('Error al eliminar el producto:', error);
        });
  }
  
  function updateQuantity(productId) {
    const newQuantity = parseInt(document.getElementById('quantityInput').value);
  
    getCartId()
        .then(cartId => {
            /* PUT al server para actualizar cantidad */
            return fetch(`/api/carts/${cartId}/product/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });
        })
        .then((response) => {
            if (response.status === 201) {
                location.reload();
            } else {
                console.error('Error al actualizar la cantidad del producto');
            }
        })
        .catch((error) => {
            console.error('Error al actualizar la cantidad:', error);
        });
  }
  
  
  function deleteProductsInCart() {
    fetch('/api/carts/get-cart-id')
      .then(response => response.json())
      .then(data => {
          const cartId = data.cartId;
          fetch(`/api/carts/${cartId}`, {
          method: 'DELETE',
          })
          .then((response) => {
              if (response.status === 201) {
              location.reload();
              } else {
              console.error('Error al vaciar carrito');
              }
          })
      })
        .catch((error) => {
          console.error('Error al vaciar el carrito:', error);
        });
    }
  
  
    