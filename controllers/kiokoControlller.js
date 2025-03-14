const Kiosko = require('../models/Kiosko');
const { pool } = require('../config/conexion');
const WebSocket = require("ws");

class KioskoController {
    
    static async listar_ventanillas_tramites(req, res) {

        try {
            const tramites_ventanillas = await Kiosko.get_ventanilla_tramite_kiosko();

            res.status(200).json(tramites_ventanillas);

  
        } catch (error) {
            console.error("Error al obtener personas:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }

    }


    static async insert_turno(req, res) {


        const { id_venta } = req.body;

        const id_ventaFinal = id_venta || null;


        try {

     
            const tramite = await Kiosko.get_tramite_x_ventanilla(id_ventaFinal);

            const id_tra = tramite.id_tra;
            const tra_nom = tramite.tra_nom;
            const tra_descrip = tramite.tra_descrip;

            const cantidad_tramite_ventanilla = await Kiosko.get_cantidad_ventanilla_tramite(id_venta, id_tra);
            const turn_code = tra_nom + "-" + (cantidad_tramite_ventanilla + 1);



            const id_turn = await Kiosko.insert_turno(turn_code, id_ventaFinal, id_tra);
            const resultado = await Kiosko.get_cantidad_restante(id_ventaFinal,id_turn);
    
            const fechaOriginal =  resultado.turn_fecha_crea;

            const fechaFormateada = new Intl.DateTimeFormat('es-PE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }).format(fechaOriginal);

            resultado.turn_fecha_crea = fechaFormateada;
            resultado.tra_descrip = tra_descrip;


            if (resultado) {
                try {

                    const ip = "localhost";
                    const ws = new WebSocket(`ws://${ip}:3000`);
             
                    ws.on("open", () => {
                        const payload = JSON.stringify({
                            action: "NUEVO_TURNO",
                            id_venta: id_ventaFinal,
                            turn_code:turn_code,
                            id_turn:id_turn,

                        });
            
                        console.log("📡 Enviando mensaje WebSocket:", payload);
            
                        ws.send(payload);
                        // ws.close(); // Cerrar conexión después de enviar el mensaje
                    });
            
                    ws.on("error", (err) => {
                        console.error("❌ Error en WebSocket:", err.message);
                    });
            
                } catch (err) {
                    console.error("❌ Error en WebSocket:", err.message);
                }
            }

            res.status(200).json({ success: true,resultado });
  
        } catch (error) {
            console.error("Error al obtener personas:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }

    }





}




module.exports = { KioskoController };
