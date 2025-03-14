const express = require('express');
const multer = require('multer');

const router = express.Router();
const { TramiteController } = require('../controllers/tramiteController'); // Asegúrate de que el nombre coincide

// Configura multer para manejar FormData
const upload = multer(); // Sin almacenamiento en disco, solo procesa los datos en memoria


// Ruta para obtener las ventanillas activas
router.post('/listar_tramites_activos_x_id_mantenedor', TramiteController.listar_tramites);

router.post('/registrarTramite', upload.none(),TramiteController.guardaryeditar);

router.post('/tramite_x_id',upload.none(), TramiteController.buscar_tramite_x_id);

router.post('/eliminar_x_id',upload.none(), TramiteController.eliminar_tramite);


// router.post('/registrarPersonas', upload.none(), UsuarioController.guardarEditar);




module.exports = router;