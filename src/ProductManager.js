const { promises: fs } = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
  }


    /* NUEVO PRODUCTO A LISTA D PRODUCTOS */
  async addProduct(product) {
    const products = await this.getProductsFromDB();
    product.id = this.getNextProductId(products);
    products.push(product);
    await this.saveProductsToDB(products);
    return product.id;
  }


    /* VE LISTA COMPLETA D PRODUCTOS */
  async getProducts() {
    return await this.getProductsFromDB();
  }


    /* PRODUCTO X ID */
  async getProductById(id) {
    const products = await this.getProductsFromDB();
    return products.find((product) => product.id === id);
  }


    /* ACTUALIZA PRODUCTO EXISTENTE */
  async updateProduct(id, updatedFields) {
    const products = await this.getProductsFromDB();
    const index = products.findIndex((product) => product.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedFields };
      await this.saveProductsToDB(products);
      return true;
    }
    return false;
  }


    /* ELIMINA PRODUCTO X ID */
  async deleteProduct(id) {
    const products = await this.getProductsFromDB();
    const index = products.findIndex((product) => product.id === id);
    if (index !== -1) {
      products.splice(index, 1);
      await this.saveProductsToDB(products);
      return true;
    }
    return false;
  }


    /* RECIBE PROXIMO ID PARA UN NUEVO PRODUCTO */
  getNextProductId(products) {
    if (products.length === 0) {
      return 1;
    }
    const maxId = Math.max(...products.map((product) => product.id));
    return maxId + 1;
  }


    /* LEE EL PRODUCTO, LO DEVUELVE COMO ARRAY D OBJETO */
  async getProductsFromDB() {
    try {
      const fileContents = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(fileContents);
    } catch (error) {
      throw new Error('Error al leer el archivo de productos');
    }
  }

  
    /* GUARDA EL PRODUCTO EN EL ARCHIVO */
  async saveProductsToDB(products) {
    try {
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    } catch (error) {
      throw new Error('Error al guardar los productos en el archivo');
    }
  }
}

module.exports = ProductManager;
