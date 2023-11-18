const multer = require('multer');
const path = require('path');

// Define las carpetas de destino según el tipo de archivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Selecciona la carpeta de destino según el tipo de archivo
    const fileType = file.fieldname === 'profileImage' ? 'profiles' : 'documents';
    cb(null, path.join(__dirname, '..', 'uploads', fileType));
  },
  filename: (req, file, cb) => {
    // Genera un nombre de archivo único basado en la fecha y el sufijo aleatorio
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Configuración de Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Límite de tamaño del archivo (en bytes)
  fileFilter: (req, file, cb) => {
    // Filtra archivos por tipo MIME (acepta imágenes y documentos)
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('application/')) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no admitido'), false);
    }
  },
});

// Exporta la configuración de Multer
module.exports = upload;

