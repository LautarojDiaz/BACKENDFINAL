const express = require('express');
const mokingController = require('../controllers/moking.controller');
const mockingRouter = express.Router();


mockingRouter.get('/mockingproducts', mokingController.generateMockProducts); 

module.exports = mockingRouter;
