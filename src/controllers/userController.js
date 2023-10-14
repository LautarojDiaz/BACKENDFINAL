const UserModel = require('../models/userModel');


    /* CAMBIO ROL D USUARIO */
exports.changeUserRole = async (req, res) => {
  const { uid, newRole } = req.params;

  if (newRole !== 'user' && newRole !== 'premium') {
    return res.status(400).json({ message: 'Rol no válido' });
  }

  const user = await UserModel.findById(uid);
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  user.role = newRole;
  await user.save();

  return res.status(200).json({ message: `Rol de usuario cambiado a ${newRole}` });
};
