const Product = require('./models/Product');

class ProductManager {
  constructor() {}


    /* NUEVO PRODUCTO A BASE D DATOS */
  async addProduct(name, price, description) {
    try {
      const newProduct = new Product({
        name: name,
        price: price,
        description: description,
      });

      await newProduct.save();
      return newProduct;
    } catch (error) {
      console.error('Error al agregar el producto:', error.message);
      return null;
    }
  }


    /* OBTIENE LOS PRDUCTOS D BASE D DATOS */
  async getAllProducts() {
    try {
      const products = await Product.find();
      return products;
    } catch (error) {
      console.error('Error al obtener los productos:', error.message);
      return [];
    }
  }


    /* OBTIENE PRODUCTO X SU ID */
  async getProductById(productId) {
    try {
      const product = await Product.findById(productId);
      return product;
    } catch (error) {
      console.error('Error al obtener el producto:', error.message);
      return null;
    }
  }


    /* ACTUALIZA PRODUCTO X SU ID */
  async updateProduct(productId, updatedData) {
    try {
      const product = await Product.findByIdAndUpdate(productId, updatedData, {
        new: true,
      });
      return product;
    } catch (error) {
      console.error('Error al actualizar el producto:', error.message);
      return null;
    }
  }


    /* ELIMINA PRODUCTO X SU ID */
  async deleteProduct(productId) {
    try {
      const product = await Product.findByIdAndRemove(productId);
      return product;
    } catch (error) {
      console.error('Error al eliminar el producto:', error.message);
      return null;
    }
  }
}

module.exports = ProductManager;
