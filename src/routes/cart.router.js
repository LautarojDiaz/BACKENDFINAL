const express = require('express')
const { Router } = require('express');
const cartRouter = express.Router();
const CartController = require('../controllers/cart.controller');
const cartController = require('../controllers/cart.controller');
const { isUser, isProductCreator, isPremium, isUserOrPremium } = require('../middlewares/auth');


cartRouter.get("/", CartController.createCart );
cartRouter.get('/view-cart', cartController.viewCart );
cartRouter.get('/get-cart-id', cartController.getCartById ); 
cartRouter.get('/checkout/:cartId', cartController.viewCheckout);
cartRouter.put("/:cid/products/:pid", CartController.addToCart );
cartRouter.delete("/:cid/product/:pid", CartController.deleteProductToCart );
cartRouter.delete("/:cid", CartController.clearCart );
cartRouter.get("/:cid", CartController.getCartById );
cartRouter.put("/:cid/product/:pid", CartController.updateCart);
cartRouter.put("/:cid/products/:pid", CartController.addProduct );
cartRouter.post("/:cid/purchase", isUserOrPremium, cartController.purchaseCart );


module.exports = cartRouter






    