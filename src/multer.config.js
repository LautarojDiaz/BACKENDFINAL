const multer = require('multer');

    /* CONFIGURACION ALMACENAMIENTO D ARCHIVOS*/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'profileImage') {
      cb(null, './src/uploads/profiles'); 
    } else if (file.fieldname === 'productImage') {
      cb(null, './src/uploads/products');
    } else if (file.fieldname === 'document') {
      cb(null, './src/uploads/documents'); 
    } else {
      cb(new Error('Invalid fieldname'), false);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
  },
});


    /*CREAR INSTANCIA D MULTER*/
const multerConfig = multer({ storage });

module.exports = multerConfig;
