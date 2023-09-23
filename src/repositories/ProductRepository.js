
  /* REPOSITORIO D PRODUCTOS */
class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAllProducts() {
    return this.dao.getAllProducts();
  }

  async getProductById(id) {
    return this.dao.getProductById(id);
  }

  async createProduct(productData) {
    return this.dao.createProduct(productData);
  }

  async updateProduct(id, productData) {
    return this.dao.updateProduct(id, productData);
  }

  async deleteProduct(id) {
    return this.dao.deleteProduct(id);
  }
}

module.exports = ProductRepository;
