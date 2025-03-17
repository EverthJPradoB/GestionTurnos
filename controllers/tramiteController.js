const Tramite = require('../models/Tramite');
// const { pool } = require('../config/conexion');


class TramiteController {

    static async guardaryeditar(req, res) {

        const { id_tra, tra_nom, tra_descrip, tra_tiem_esti } = req.body;

        const id_traFinal = id_tra || null;
        const tra_nomFinal = tra_nom || null;
        const tra_descripFinal = tra_descrip || null;
        const tra_tiem_estiFinal = tra_tiem_esti || null;

        if (!tra_nomFinal) {
            return res.status(400).json({ status: "error", message: "Complete los campos obligatorios" });
        }

        if (id_traFinal) {

            try {
                await Tramite.update_tramites(tra_nomFinal, tra_descripFinal,tra_tiem_estiFinal, id_traFinal);
                res.status(200).json({ success: true, message: 'Tramite registrado exitosamente' });
            } catch (error) {
                console.error("Error en update_tramites:", error);
                res.status(500).json({ success: false, message: 'Error al modificar Tramite' });
            }

        } else {

            try {

                await Tramite.insert_tramites(tra_nomFinal, tra_descripFinal , tra_tiem_estiFinal );
                res.status(200).json({ success: true, message: 'Tramite registrado exitosamente' });

            } catch (error) {

                console.error("Error en insert_tramites:", error);
                res.status(500).json({ success: false, message: 'Error al registrar Tramite' });

            }
        }
    }


    static async listar_tramites(req, res) {

        try {
            const tramites = await Tramite.get_tramites_activos();

            const tramitesModificado = tramites.map(row => ({
                ...row,
                editar: `<button type="button" onClick="editar(${row.id_tra});" id="${row.id_tra}" class="btn btn-outline-warning btn-icon"><div><i class="fa fa-edit"></i></div></button>`,
                eliminar: `<button type="button" onClick="eliminar(${row.id_tra});" id="${row.id_tra}" class="btn btn-outline-danger btn-icon"><div><i class="fa fa-close"></i></div></button>`
            }));


            res.status(200).json({ data: tramitesModificado });
        } catch (error) {
            console.error("Error al obtener personas:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }

    }


    static async buscar_tramite_x_id(req, res) {


        try {

            const id_tra = req.body.id_tra;
            const tramite_econtrado = await Tramite.get_tramite_activo_x_id(id_tra);

            res.status(200).json(tramite_econtrado);

        } catch (error) {
            console.error("Error al obtener persona:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }

    }

    static async eliminar_tramite(req, res) {

        try {
            const id_tra = req.body.id_tra;
             await Tramite.delete_tramite_x_id(id_tra);

            res.status(200).json({ success: true, message: 'El Tramite a sido desabilitado' });

        } catch (error) {
            console.error("Error inactivar tramite o ventnailla_tramite:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }

    }

}


module.exports = { TramiteController };
