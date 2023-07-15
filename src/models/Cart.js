class Cart {
    constructor() {
      this.products = [];
    }
  
    /* AGREGA PRODUCTO AL CARRITO */
    addProduct(product) {
      this.products.push(product);
    }
  
    /* ELIMINA PRODUCTO DEL CARRITO POR ID */
    removeProduct(productId) {
      this.products = this.products.filter((product) => product.id !== productId);
    }
  
    /* OBTIENE LISTA DE PRODUCTOS DEL CARRITO */
    getProducts() {
      return this.products;
    }
  
    /* CALCULA EL PRECIO TOTAL DEL CARRITO */
    getTotalPrice() {
      const totalPrice = this.products.reduce((total, product) => total + product.price, 0);
      return totalPrice;
    }
  }
  
  module.exports = Cart;
  