const Ventanilla = require('../models/Ventanilla');
const { pool } = require('../config/conexion');


class VentanillaController {

    static async get_ventanilla_mnt(req, res) {


        try {

            const ventanillas = await Ventanilla.get_ventanilla_activos_model();

            const ventanillasModificado = ventanillas.map(row => ({
                ...row,
                tra_nom: row.tra_nom ? row.tra_nom : "<b>No tiene Tramite</b>",
                editar: `<button type="button" onClick="editar(${row.id_venta});" id="${row.id_venta}" class="btn btn-outline-warning btn-icon"><div><i class="fa fa-edit"></i></div></button>`,
                eliminar: `<button type="button" onClick="eliminar(${row.id_venta});" id="${row.id_venta}" class="btn btn-outline-danger btn-icon"><div><i class="fa fa-close"></i></div></button>`,
                desvincular: `<button type="button" onClick="desvincular(${row.id_venta});" id="${row.id_venta}" class="btn btn-outline-secondary btn-icon"><div><i class="fa fa-unlink"></i></div></button>`,

            
            
            }));




            // res.status(201).json({ mensaje: "Listar Ventanila", result });
            res.status(201).json({ data: ventanillasModificado });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    static async guardarEditar(req, res) {


        const { id_venta, venta_nom, venta_descrip, id_tra } = req.body;

        const id_ventaFinal = id_venta || null;
        const venta_nomFinal = venta_nom || null;
        const venta_descripFinal = venta_descrip || null;
        const id_traFinal = id_tra || null;


        // Validación de campos obligatorios
        if (!venta_nomFinal || !id_traFinal) {
            return res.status(400).json({ status: "error", message: "Complete los campos obligatorios" });
        }


        let connection;
        console.log(" ... " + id_venta);
        console.log(" ... " + id_ventaFinal);

        if (id_ventaFinal) {

            try {

                connection = await pool.getConnection(); // Obtener conexión del pool

                await connection.beginTransaction(); // Iniciar transacción

                await connection.query('BEGIN'); // Iniciar transacción (esto depende de cómo implementes el pool y `query`) 

                /// actualizar persona
                await Ventanilla.update_ventanilla(venta_nomFinal, venta_descripFinal, id_ventaFinal
                );

                let verificar = await Ventanilla.verificar_tramite_ventanilla(id_ventaFinal);

                let cantidad_tramites = verificar.count;
                let id_tramite_actual = verificar.id_tra;


                if (cantidad_tramites > 0) {


                    if (id_tramite_actual != id_traFinal ) {

                        await Ventanilla.desvincular_tramite(id_ventaFinal);

                        await Ventanilla.asociar_ventanilla_tramite(id_ventaFinal, id_traFinal);

                    }


                    // await Ventanilla.update_tramite(id_traFinal, id_ventaFinal);

                } else {


                    await Ventanilla.asociar_ventanilla_tramite(id_ventaFinal, id_traFinal);
                }



                await connection.query('COMMIT'); // Confirmar transacción
                res.status(200).json({ success: true, message: 'Ventanilla Modificada exitosamente' });

            } catch (error) {
                await connection.query('ROLLBACK'); // Deshacer cambios si hay error
                console.error("Error en actualizar:", error);
                res.status(500).json({ success: false, message: 'Error al modificar Ventanilla' });
            }


        } else {

            try {

                connection = await pool.getConnection(); // Obtener conexión del pool
                await connection.beginTransaction(); // Iniciar transacción

                await connection.query('BEGIN'); // Iniciar transacción (esto depende de cómo implementes el pool y `query`)

                // Insertar persona y obtener ID
                const id_venta = await Ventanilla.insert_ventanilla(venta_nomFinal, venta_descripFinal);


                // Insertar credenciales
                await Ventanilla.asociar_ventanilla_tramite(id_venta, id_traFinal);


                console.log("Ventanilla registrada exitosamente:");

                await connection.query('COMMIT'); // Confirmar transacción
                res.status(200).json({ success: true, message: 'Ventanilla registrada exitosamente' });

            } catch (error) {
                await connection.query('ROLLBACK'); // Deshacer cambios si hay error
                console.error("Error en insertPersonas:", error);
                res.status(500).json({ success: false, message: 'Error al registrar persona' });
            }



        }


    }



    static async combo_tramites(req, res) {

        try {

            const id_venta = req.body.id_venta || null; // Si no hay id_per, será null


            let id_tramite_actual = await Ventanilla.get_ventanilla_x_id_combo(id_venta);
            // id_venta_actual = id_venta_actual ?? null; // Si es undefined, lo convertimos en null

            const tramites_disponibles = await Ventanilla.get_tramites_activas_disponibles(id_venta, id_tramite_actual);

            let html = "<option label='Seleccione'></option>";

            if (Array.isArray(tramites_disponibles) && tramites_disponibles.length > 0) {
                tramites_disponibles.forEach(row => {
                    const selected = row.id_tra == id_tramite_actual ? "selected" : "";
                    html += `<option value="${row.id_tra}" ${selected}>${row.tra_nom}</option>`;
                });
            }

            res.send(html);
        } catch (error) {
            console.error("Error en combo_ventanillas:", error);
            res.status(500).send("Error interno del servidor");
        }
    }


    static async bascar_ventnailla_x_id(req, res) {


        try {

            const id_venta = req.body.id_venta || null; // Si no hay id_venta, será null

            const ventanilla_econtrada = await Ventanilla.get_ventanilla_x_id(id_venta);

            res.status(200).json(ventanilla_econtrada);

        } catch (error) {
            console.error("Error al obtener persona:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }

    }


    static async desvincular_tramite_vetanilla(req, res) {

        try {

            const id_per = req.body.id_venta;
            await Ventanilla.desvincular_tramite(id_per);

            res.status(200).json({ success: true, message: 'El tramite a sido desvinculada' });

        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor" });
        }

    }

    static async eliminar_ventanilla(req, res) {

        try {
            const id_venta = req.body.id_venta;
            await Ventanilla.delete_ventanilla_x_id(id_venta);

            res.status(200).json({ success: true, message: 'La Ventanilla a sido desabilitado' });

        } catch (error) {
            console.error("Error inactivar Ventanilla o Ventanilla_tramite o Ventanilla_persona:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }

    }








}


module.exports = { VentanillaController };