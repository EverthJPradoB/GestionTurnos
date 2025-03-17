const express = require('express');
const multer = require('multer');

const router = express.Router();
const { UsuarioController } = require('../controllers/usuarioController'); // Asegúrate de que el nombre coincide

// Configura multer para manejar FormData
const upload = multer(); // Sin almacenamiento en disco, solo procesa los datos en memoria


// Ruta para obtener las ventanillas activas
router.post('/login', UsuarioController.login);

router.post('/listarPersonas', UsuarioController.listarPersonas);

router.post('/registrarPersonas', upload.none(), UsuarioController.guardarEditar);


router.post('/persona_x_id',upload.none(), UsuarioController.bascarPersona_x_id);


router.post('/combo_roles', upload.none() ,UsuarioController.combo_roles);

router.post('/combo_ventanillas',upload.none(), UsuarioController.combo_ventanillas);

router.post('/eliminarPersona',upload.none(), UsuarioController.eliminar_usuario);

router.post('/eliminarVentanilla',upload.none(), UsuarioController.desvincular_vetanilla_usuario);


router.get('/logout',upload.none(), UsuarioController.logout);

router.get('/session_venta',upload.none(), UsuarioController.obtener_ventanilla);

router.get('/session_rol',upload.none(), UsuarioController.obtener_rol);


router.post('/radio_priorizaciones', UsuarioController.radio_priorizaciones);

router.post('/perfil', UsuarioController.perfil);

router.post('/actualizar_perfil',upload.none(), UsuarioController.actualizar_perfil);


module.exports = router;