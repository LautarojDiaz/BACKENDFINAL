  /* GESTOR D PRODUCTOS */
class Product {
    constructor(id, name, price) {
      this.id = id;
      this.name = name;
      this.price = price;
    }
  }
  
  class ProductDAO {
    constructor() {
      this.products = [];
    }
  
    createProduct(name, price) {
      const newProduct = new Product(this.products.length + 1, name, price);
      this.products.push(newProduct);
      return newProduct;
    }
  
    getProductById(id) {
      return this.products.find((product) => product.id === id);
    }
  }
  
  module.exports = ProductDAO;
  