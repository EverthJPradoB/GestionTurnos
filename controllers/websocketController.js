const WebSocket = require('../models/WebSocket');



class WebsocketController {

    static async listar_turnos_pendientes_slider_x_id_venta(id_venta) {

        try {

            const turnos_pendientes = await WebSocket.get_turnos_pendientes_slider_x_id_venta(id_venta);

            // res.status(201).json({ mensaje: "Listar Ventanila", result });
            return turnos_pendientes;

        } catch (error) {
            console.error("Error en listar_turnos_pendientes_slider_x_id_venta:", error);
            return { error: error.message }; // Devuelve el error en lugar de `res.status()`
        }
    }


}


module.exports = { WebsocketController };