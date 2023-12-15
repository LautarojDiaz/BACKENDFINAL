
const ProductModel = require("../DAO/mongo/models/products.model");
const CartService = require("../services/cart.service");
const cartService = new CartService()


const productValid = async (req, res, next) => {
  const product = req.body;

  /* BUSCA PRODUCTOS X ID */
if (await ProductModel.findById(product._id)) {
  return res.status(400).json({ status: "error", message: "El producto ya existe" });
}
  
  /* CHEQUEAR Q POSEA LOS CAMPOR REQUERIDOS */
if (!product.title || !product.description || !product.price || !product.code || !product.category || !product.stock) {
  return res.status(400).json({ status: "error", message: "No se puede añadir el producto debido a que faltan campos requeridos" });
}
  return next();
};


module.exports = productValid;
