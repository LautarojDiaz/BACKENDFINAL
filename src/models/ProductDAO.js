const Producto = require('../models/Producto');


  /* GESTION D PRODUCTOS EN LA BASE D DATOS */
class ProductoDAO {
  async crear(datosProducto) {
    try {
      const producto = new Producto(datosProducto);
      return await producto.save();
    } catch (error) {
      throw new Error('Error al crear el producto');
    }
  }

  async buscarPorId(idProducto) {
    try {
      return await Producto.findById(idProducto);
    } catch (error) {
      throw Error('Error al buscar el producto');
    }
  }
}

module.exports = ProductoDAO;

