const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/authorization');


  /* RUTA ADMINISTRADORES */
router.get('/admin-only', authorize('administrador'), (req, res) => {
  res.json({ message: 'Esta es una ruta solo para administradores' });
});

module.exports = router;
