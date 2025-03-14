const express = require('express');
const multer = require('multer');

const router = express.Router();
const { KioskoController } = require('../controllers/kiokoControlller'); // Asegúrate de que el nombre coincide

// Configura multer para manejar FormData
const upload = multer(); // Sin almacenamiento en disco, solo procesa los datos en memoria


// Ruta para obtener las ventanillas activas
router.post('/listar_ventanillas_activos_kiosko', KioskoController.listar_ventanillas_tramites);

router.post('/insert_turno',upload.none(), KioskoController.insert_turno);



// router.post('/registrarPersonas', upload.none(), UsuarioController.guardarEditar);




module.exports = router;