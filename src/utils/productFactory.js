class ProductFactory {
    createProduct(name, price, description) {
      return new Product(name, price, description);
    }
}
  
module.exports = ProductFactory;