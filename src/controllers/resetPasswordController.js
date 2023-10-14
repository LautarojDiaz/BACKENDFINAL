const UserModel = require('../models/userModel');


    /* GENERA Y ENVIA ENLACE POR MAIL */
const resetPasswordLink = generateResetPasswordLink(user);
sendResetPasswordEmail(user.email, resetPasswordLink);


    /* RESTRICCIONES CAMBIO D CONTRASEÑA */
if (newPassword === oldPassword) {
    return res.status(400).json({ message: 'No puedes usar la misma contraseña' });
  }


    /* SE FIJA SI EL ENLACE EXPIRO */
if (isResetLinkExpired(user.resetLinkExpiration)) {
    const resetPasswordLink = generateResetPasswordLink(user);
    sendResetPasswordEmail(user.email, resetPasswordLink);
    return res.status(200).json({ message: 'Se ha enviado un nuevo enlace de restablecimiento' });
  }

  
    /* RESTABLECER CONTASEÑA */
exports.resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  const user = await UserModel.findOne({
    resetToken,
    resetTokenExpiration: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json({ message: 'Enlace de restablecimiento no válido o expirado' });
}


    /* SE FIJA QUE LA NUEVA CONTRASEÑA, NO SEA IGUAL A LA ACTUAL */
const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    return res.status(400).json({ message: 'No puedes usar tu contraseña actual' });
}


    /* ACTUALIZA NUEVA CONTRASEÑA */
const salt = await bcrypt.genSalt(10);
user.password = await bcrypt.hash(newPassword, salt);
user.resetToken = null;
user.resetTokenExpiration = null;
await user.save();
  return res.status(200).json({ message: 'Contraseña restablecida con éxito' });
};
