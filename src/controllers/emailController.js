const UserModel = require('../models/userModel');
const nodemailer = require('nodemailer');


    /* CONTROLADOR ENVIA CORREO D RESTABLECIMIENTO */
exports.sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
}


    /* GENERA TOKEN UNICO Y ESTABLECE LA EXPIRACION */
const resetToken = crypto.randomBytes(32).toString('hex');
const resetTokenExpiration = Date.now() + 3600000; 


    /* ASOCIA TOKEN Y EXPIRACION AL USUARIO */
user.resetToken = resetToken;
user.resetTokenExpiration = resetTokenExpiration;
await user.save();
const transporter = nodemailer.createTransport({});


  /* ENVIA CORREO CON ENLACE D RESTABLECIMIENTO */
const resetLink = `${resetToken}`;
const mailOptions = {
    to: email,
    subject: 'Restablecimiento de Contraseña',
    text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`,
};
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error al enviar el correo' });
    }
    return res.status(200).json({ message: 'Correo enviado con éxito' });
  });
};
