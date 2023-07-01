class CartManager{
    constructor() {
      this.carts = {}; // Almacena los carritos en un objeto, donde cada clave es el ID del carrito y el valor es la instancia del carrito
    }
  

    /* CREA UN NUEVO CARRITO Y DEVUELVE EL ID */
    createCart() {
      const cartId = this.generateCartId();
      const newCart = new Cart();
      this.carts[cartId] = newCart; 
      return cartId; 
    }
  

    /* OBTIENE UN CARRITO DESDE SU ID */
    getCart(cartId) {
      return this.carts[cartId] || null; 
    }
  

    /* GENERA ID UNICO PARA EL CARRITO */
    generateCartId() {
      return Math.random().toString(36).substring(2, 10);
    }
  }
  
  module.exports = CartManager;
  