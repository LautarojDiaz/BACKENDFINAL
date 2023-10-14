const ProductDAO = require('../dao/productDAO');
const ProductRepository = require('../repositories/ProductRepository'); 
const ProductService = require('../services/productService');

const productDAO = new ProductDAO();
const productRepository = new ProductRepository(productDAO);
const productService = new ProductService(productRepository);


    /* MODIFICACION Y ELIMINACION D PRODUCTOS */
if (user.role === 'premium' && product.owner !== user.email) {
    return res.status(403).json({ message: 'No tienes permisos para eliminar este producto' });
  }
  