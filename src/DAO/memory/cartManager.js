const { json } = require("express");
const fs = require("fs");

class CartManager {
    static = 1
    constructor (path) {
        this.path = 'cart.json'
    }

    async createCart() {
        try {
            let carts = await this.getProductsFromCarts();
            const cartId = Math.round(Math.random() * 1000000);
            const cartIdToString = cartId.toString()
            const cart = {
                id: cartIdToString,
                products: []
            };
            carts.push(cart);
            const cartString = JSON.stringify(carts, null, 2);
            await fs.promises.writeFile(this.path, cartString, err=> {
                if (err) {
                    return ('error')
                }
                return carts;
            })
        } catch (err) {
            return (err)
        }
    }
    /* TRAE OBJETOS DEL JSON cart.json */
    async getProductsFromCarts() { 
        try {
            if(fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8')
                return JSON.parse(data);
            }
            await fs.promises.writeFile(this.path, JSON.stringify([]))
        } catch (error) {
            return (error)
        }
    }

    async getCart(id) {  /* TRAR JSON CON TODOS LOS CARRITOS */
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, "utf-8");
                return JSON.parse(data);
            }
        } catch (error) {
            return(error);
        }
    }

    async getProductsToCartById (id) { /* BUSCA CARRO CON ESTE ID */
        try {
            const carts = await this.getCart(); 
            const cart = carts.find((cart) => cart.id == id)
            if (!cart) {
                throw new Error(`No existe carrito con ID, ${id}`)
            }
            return cart
        } catch (error) {
            
        }
    }

    async addProductIdinCartId(cid, pid) {
        try {
          const carts = await this.getCart();
          const cartToUpdateIndex = carts.findIndex((cart) => cart.id == cid);
          if (cartToUpdateIndex == -1) {
            throw new Error(`No existe ningún carrito con el id ${cid}`);
          }
          const cart = carts[cartToUpdateIndex];
          const productIndex = cart.products.findIndex((product) => product.id == pid);
          if (productIndex !== -1) {
            /* SI EL PRODUCTO YA EXISTE EN EL CARRITO, AUMENTA LA CANT EN 1 */
            cart.products[productIndex].quantity++;
          } else {
            /* SI EL PRODUCTO NO EXISTE EN EL CARRITO, AGREGA AL ARRAY D PRODUCTOS */
            cart.products.push({
              id: pid,
              quantity: 1,
            });
          }
          await this.updateCartById(cid, cart);
        } catch (error) {
          console.error(error);
        }
      }
      
      async updateCartById(cid, cart) {
        try {
          const carts = await this.getCart();
          const index = carts.findIndex((cart) => cart.id == cid);
          if (index === -1) {
            throw new Error(`No existe ningún carrito con el id ${cid}`);
          }
          carts[index] = { ...cart };
          await this.saveProductsInCart(carts);
        } catch (error) {
          console.error(error);
        }
      }
      
    async saveProductsInCart(carts) {
        try {
            const data = JSON.stringify(carts, null, 2);
            await fs.promises.writeFile(this.path, data, err=> {
                if (err) {
                    return ('error')
                }
            })
        } catch (error) {
            return (error)
        }
    }  


    }

const cartManager = new CartManager("carts.json");


module.exports = CartManager
