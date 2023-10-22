
module.exports = {
    modules: [
      {
        name: 'Productos',
        description: 'Módulo para administrar productos.',
        routes: './src/routes/productRoutes.js', // Ruta de tus rutas de productos
      },
      {
        name: 'Carrito',
        description: 'Módulo para administrar carritos.',
        routes: './src/routes/cartRoutes.js', // Ruta de tus rutas de carrito
      },
    ],
  };




  /**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtiene todos los productos.
 *     tags:
 *       - Productos
 *     responses:
 *       200:
 *         description: Lista de productos obtenida con éxito.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/products', (req, res) => {
    // Implementa la lógica para obtener productos y envía una respuesta
  });

  

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del producto.
 *         name:
 *           type: string
 *           description: Nombre del producto.
 *         price:
 *           type: number
 *           description: Precio del producto.
 */
