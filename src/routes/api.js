const express = require('express');
const passport = require('passport');

const router = express.Router();

    /* PROTEGIDA OBTIENE EL USUARIO ACTUAL */
router.get('/sessions/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
