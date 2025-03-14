const express = require('express');
const multer = require('multer');

const router = express.Router();
const { VentanillaController } = require('../controllers/ventanillaController'); // Asegúrate de que el nombre coincide
const upload = multer(); // Sin almacenamiento en disco, solo procesa los datos en memoria

// Ruta para obtener las ventanillas activas
router.post('/listar_ventanilla_activas', VentanillaController.get_ventanilla_mnt);

router.post('/combo_tramites',upload.none(), VentanillaController.combo_tramites);

router.post('/ventanilla_x_id',upload.none(), VentanillaController.bascar_ventnailla_x_id);

router.post('/registrarVentanillas', upload.none(), VentanillaController.guardarEditar);

router.post('/eliminarVentanilla', upload.none(), VentanillaController.eliminar_ventanilla);



module.exports = router;
