  /* SERVICIO D PRODUCTOS */
class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async getAllProducts() {
    return this.productRepository.getAllProducts();
  }

  async getProductById(id) {
    return this.productRepository.getProductById(id);
  }

  async createProduct(productData) {
    return this.productRepository.createProduct(productData);
  }
}

module.exports = ProductService;
