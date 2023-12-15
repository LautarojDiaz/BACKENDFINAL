const UserModel = require('../DAO/mongo/models/users.model');
const UserService = require('../services/user.service');
const userService = new UserService();

class UserController {

  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      const simplifiedUsers = users.map((user) => ({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      }));
      res.render('all-users', { users: simplifiedUsers })
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener usuarios" });
    }
  }

  async deleteOldUsers (req, res) {
    try {
      const deletedUsers = await userService.deleteInactiveUsers();


      return res.status(200).json({ message: 'Usuarios inactivos eliminados con éxito', deletedUsers });
    } catch (error) {
      console.error('Error al eliminar usuarios inactivos:', error);
      return res.status(500).json({ error: 'Error al eliminar usuarios inactivos' });
    }
  }

  async togglePremiumUser(req, res) {
    try {
      const { uid } = req.params;
      const result = await userService.togglePremiumUser(uid);
      const { user, userDocumentCount } = result;
      const userRegresive = 3 - userDocumentCount
        
      if (!user) {
        return res.status(404).render('error-document', { uid, userDocumentCount, userRegresive });
      }
  
      if (userDocumentCount) {
        return res.render('changeRole', { msg: 'Role actualizado con éxito', userDocumentCount });
      } else {
        return res.render('changeRole', { msg: 'La cantidad de documentos es menor que 3', userDocumentCount });
      }
    } catch (e) {
      logger.error('Ocurrió un error en la función togglePremiumUser:', e)
      return res.status(500).json({ error: 'Error al cambiar el rol del usuario' });
    }
  }
  

  async uploadForm(req, res) {
    try {
      const { uid } = req.params;
      const userId = uid;
      res.render('upload-documents', { userId })
    } catch (e) {
      logger.error('Ocurrió un error en la función uploadForm:', e)
    }
  }


  /* CONFIGURACION D GUARDADO D ARCHIVOS EN MULTER */
  async uploadDocument(req, res) {
    try {
      const { uid } = req.params;
      const { originalname, filename } = req.file; 
      const { documentType } = req.body;


      /* CREA ONJETO QUE REPRESENTA EL DOCUMENTO CARGADO */
      const newDocument = {
        name: originalname,
        reference: filename,
        documentType,
      };


      /* ENCUENTRA AL USUARIO X ID */
      const user = await UserModel.findById(uid);

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }


      /* AGREGAR EL NUEVO DOCUMENTO AL ARRAY D DOCUMENTOS DEL USUARIO */
      user.documents.push(newDocument);

      await user.save();

      const result = await userService.togglePremiumUser(uid);
      const { userDocumentCount } = result;
      const userRegresive = 3 - userDocumentCount;
      let changeRole = false
      let changeRoleFalse = true

      if (userDocumentCount >= 3) {
        changeRole = true
        changeRoleFalse = false
      }
      res.render('uploaded-succesfully', {uid, userDocumentCount, userRegresive, changeRole, changeRoleFalse} )
    } catch (e) {
      logger.error('Ocurrió un error en la función uploadDocument:', e)
      return res.status(500).json({ error: 'Error al cargar el documento' });
    }
  }

}

module.exports = UserController;
