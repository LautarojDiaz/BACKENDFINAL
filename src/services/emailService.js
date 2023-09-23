const nodemailer = require('nodemailer');


  /* SERVICIO D CORREO ELECTRONICO */
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
}

async sendEmail(to, subject, text) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
};

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Correo electrónico enviado con éxito');
    } 
    catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }
  }
}

module.exports = EmailService;
