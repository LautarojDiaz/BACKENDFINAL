const ProductDAO = require('../dao/productDAO');
const ProductRepository = require('../repositories/ProductRepository'); 
const ProductService = require('../services/productService');

const productDAO = new ProductDAO();
const productRepository = new ProductRepository(productDAO);
const productService = new ProductService(productRepository);


