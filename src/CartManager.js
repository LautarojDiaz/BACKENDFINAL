class CartManager{
    constructor() {
      this.carts = {};
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
  