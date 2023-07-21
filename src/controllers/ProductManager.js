const { promises: fs } = require('fs');
const { EventEmitter } = require('events');

class ProductManager extends EventEmitter {
  constructor(path) {
    super();
    this.path = path;
  }

  /* AGREGAR UN NUEVO PRODUCTO A LA LISTA DE PRODUCTOS */
  async addProduct(product) {
    const products = await this.getProductsFromDB();
    const newProductId = this.getNextProductId(products);
    const newProduct = { id: newProductId, ...product };
    products.push(newProduct);
    await this.saveProductsToDB(products);
    this.emit('productAdded', newProduct); // Emitir evento de producto agregado
    return newProductId;
  }

  /* OBTENER LA LISTA COMPLETA DE PRODUCTOS */
  async getProducts() {
    return await this.getProductsFromDB();
  }

  /* OBTENER UN PRODUCTO POR SU ID */
  async getProductById(id) {
    const products = await this.getProductsFromDB();
    id = parseInt(id, 10); // Parsear el ID a número con base 10
    return products.find((product) => product.id === id);
  }

  /* ACTUALIZAR UN PRODUCTO EXISTENTE */
  async updateProduct(id, updatedFields) {
    const products = await this.getProductsFromDB();
    id = parseInt(id, 10); // Parsear el ID a número con base 10
    const index = products.findIndex((product) => product.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedFields };
      await this.saveProductsToDB(products);
      return true;
    }
    return false;
  }

  /* ELIMINAR UN PRODUCTO POR SU ID */
  async deleteProduct(id) {
    const products = await this.getProductsFromDB();
    id = parseInt(id, 10); // Parsear el ID a número con base 10
    const index = products.findIndex((product) => product.id === id);
    if (index !== -1) {
      const deletedProduct = products.splice(index, 1)[0];
      await this.saveProductsToDB(products);
      this.emit('productDeleted', deletedProduct); // Emitir evento de producto eliminado
      return true;
    }
    return false;
  }

  /* OBTENER EL PRÓXIMO ID DISPONIBLE PARA UN NUEVO PRODUCTO */
  getNextProductId(products) {
    if (products.length === 0) {
      return 1;
    }
    const maxId = Math.max(...products.map((product) => product.id));
    return maxId + 1;
  }

  /* LEER LOS PRODUCTOS DESDE LA BASE DE DATOS */
  async getProductsFromDB() {
    try {
      const fileContents = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(fileContents);
    } catch (error) {
      throw new Error('Error al leer el archivo de productos');
    }
  }

  /* GUARDAR LOS PRODUCTOS EN LA BASE DE DATOS */
  async saveProductsToDB(products) {
    try {
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    } catch (error) {
      throw new Error('Error al guardar los productos en el archivo');
    }
  }
}

module.exports = ProductManager;
