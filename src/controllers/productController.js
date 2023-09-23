const ProductDAO = require('../dao/ProductDAO');
const ProductRepository = require('../repositories/ProductRepository'); 
const ProductService = require('../services/ProductService'); 

const productDAO = new ProductDAO();
const productRepository = new ProductRepository(productDAO);
const productService = new ProductService(productRepository);


