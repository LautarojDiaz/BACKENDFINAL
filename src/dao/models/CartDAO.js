const Carrito = require('../models/Carrito');


  /* CarritoDataAccess */
class CarritoDAO {
  async crear(datosCarrito) {
    try {
      const carrito = new Carrito(datosCarrito);
      return await carrito.save();
    } catch (error) {
      throw new Error('Error al crear el carrito');
    }
  }

  async buscarPorId(idCarrito) {
    try {
      return await Carrito.findById(idCarrito);
    } catch (error) {
      throw new Error('Error al buscar el carrito');
    }
  }
}

module.exports = CarritoDAO;
