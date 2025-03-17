const Usuario = require('../models/Usuario');
const { pool } = require('../config/conexion');


const  { setupWebSocket, clients ,enviarMensajeWebSocket}  = require("../config/websocket"); 

class UsuarioController {

    static async login(req, res) {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.json({
                success: false,
                mensaje: "Por favor, complete todos los campos.",
                tipoAlerta: "danger"
            });
        }

        try {
            const result = await Usuario.login(username, password);

            if (result && result.length > 0) {
                const user = result[0];

                // Guardar variables de sesión del usuario
                req.session.id_cred = user.id_cred;
                req.session.id_per = user.id_per;
                req.session.per_nom = user.per_nom;
                req.session.per_ape_pa = user.per_ape_pa;
                req.session.per_ape_ma = user.per_ape_ma;
                req.session.id_rol = user.id_rol;
                req.session.id_venta = user.id_venta;




                // Determinar la URL de redirección
                let redirectUrl = "/";

                if (user.id_rol == 2) {
                    redirectUrl = "/Recpcionista/UsuHome";
                }
                else if (user.id_rol == 3) {
                    redirectUrl = "/Encargado/UsuHome";
                } else if (user.id_rol == 4) {
                    redirectUrl = "/Admin/UsuHome";
                }

                return res.json({ success: true, redirectUrl });

            } else {
                return res.json({
                    success: false,
                    mensaje: "Usuario o contraseña incorrectos.",
                    tipoAlerta: "danger"
                });
            }
        } catch (error) {
            return res.json({
                success: false,
                mensaje: "Error en el servidor. Intente más tarde.",
                tipoAlerta: "danger"
            });
        }
    }


    static async listarPersonas(req, res) {
        try {
            const personas = await Usuario.get_total_personas_mnt();

            const personasModificadas = personas.map(row => ({
                ...row, // Mantiene los datos originales
                venta_nom: row.venta_nom ? row.venta_nom : "<b>-</b>",
                editar: `<button type="button" onClick="editar(${row.id_per});" id="${row.id_per}" class="btn btn-outline-warning btn-icon"><div><i class="fa fa-edit"></i></div></button>`,
                eliminar: `<button type="button" onClick="eliminar(${row.id_per});" id="${row.id_per}" class="btn btn-outline-danger btn-icon"><div><i class="fa fa-close"></i></div></button>`,
                desvincular: row.id_rol == 3 ? "<b>-</b>" : `<button type="button" onClick="desvincular(${row.id_per});" id="${row.id_per}" class="btn btn-outline-secondary btn-icon"><div><i class="fa fa-unlink"></i></div></button>`,
            }));


            res.status(200).json({ data: personasModificadas });
        } catch (error) {


            res.status(500).json({ message: "Error interno del servidor" });
        }
    }



    static async guardarEditar(req, res) {

        const { id_per, per_nom, per_ape_pa, per_ape_ma, per_correo, per_telef, id_venta, id_rol } = req.body;



        const id_perFinal = id_per || null;
        const per_nomFinal = per_nom || null;
        const per_ape_paFinal = per_ape_pa || null;
        const per_ape_maFinal = per_ape_ma || null;
        const per_correoFinal = per_correo || null;
        const per_telefFinal = per_telef || null;
        const id_ventaFinal = id_venta || null;

        const id_rolFinal = id_rol || null;


        // Validación de campos obligatorios
        if (!per_nomFinal || !per_ape_paFinal || !per_ape_maFinal) {
            return res.status(400).json({ status: "error", message: "Complete los campos obligatorios" });
        }

        // Validación de correo electrónico
        if (per_correoFinal && !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/i.test(per_correoFinal)) {

            return res.status(400).json({ status: "error", message: "Ingrese un correo electrónico válido" });
        }

        let connection;

        if (id_perFinal) {

            try {



                connection = await pool.getConnection(); // Obtener conexión del pool

                await connection.beginTransaction(); // Iniciar transacción

                await connection.query('BEGIN'); // Iniciar transacción (esto depende de cómo implementes el pool y `query`) 

                /// actualizar persona
                await Usuario.update_persona(
                    id_perFinal, per_nomFinal, per_ape_paFinal, per_ape_maFinal, per_correoFinal, per_telefFinal);

                let verificar = await Usuario.verificar_tramite_ventanilla(id_perFinal);

                let cantidad_ventanilla = verificar.count;
                let id_venta_actual = verificar.id_venta;


                if (cantidad_ventanilla || cantidad_ventanilla > 0) {


                    if (id_venta_actual != id_ventaFinal) {

                        await Usuario.desvincular_ventanilla(id_perFinal);

                        await Usuario.asociar_ventanilla(id_perFinal, id_ventaFinal);
                    }

                } else {

                    if (id_rolFinal != 3 && id_venta) {

                        await Usuario.asociar_ventanilla(id_perFinal, id_ventaFinal);
                    }

                }



                await connection.query('COMMIT'); // Confirmar transacción
                res.status(200).json({ success: true, message: 'Persona Modificada exitosamente' });

            } catch (error) {
                await connection.query('ROLLBACK'); // Deshacer cambios si hay error

                res.status(500).json({ success: false, message: 'Error al modificar persona' });
            }


        } else {

            try {

                connection = await pool.getConnection(); // Obtener conexión del pool
                await connection.beginTransaction(); // Iniciar transacción

                await connection.query('BEGIN'); // Iniciar transacción (esto depende de cómo implementes el pool y `query`)

                const id_per = await Usuario.insertPersona(per_nomFinal, per_ape_paFinal, per_ape_maFinal, per_correoFinal, per_telefFinal, id_rolFinal);

                // Insertar persona y obtener ID

                // Insertar credenciales
                await Usuario.insertCredenciales(id_per, per_nom, per_ape_pa, per_ape_ma);

                // Asociar ventanilla si corresponde
                if (id_rol !== 3 && id_venta) {
                    await Usuario.asociar_ventanilla(id_per, id_venta);
                }



                await connection.query('COMMIT'); // Confirmar transacción
                res.status(200).json({ success: true, message: 'Persona registrada exitosamente' });

            } catch (error) {
                await connection.query('ROLLBACK'); // Deshacer cambios si hay error


                res.status(500).json({ success: false, message: 'Error al registrar persona' });
            }

            //    // Notificar por WebSocket si es necesario
            //     if (resultado.affectedRows > 0 && id_venta) {
            //         PersonaController.enviarNotificacionWebSocket(id_venta);
            //     }

        }

    }




    static async combo_roles(req, res) {

        const id_rol_actual = req.body.id_rol; // Obtener el rol actual desde el request
        const roles_disponibles = await Usuario.getRolesActivos(); // Obtener los roles activos

        let html = "<option label='Seleccione'></option>";

        if (Array.isArray(roles_disponibles) && roles_disponibles.length > 0) {
            roles_disponibles.forEach(row => {
                const selected = row.id_rol == id_rol_actual ? "selected" : "";
                html += `<option value="${row.id_rol}" ${selected}>${row.rol_nom}</option>`;
            });
        }
        res.send(html);
    }

    static async radio_priorizaciones(req, res) {

        try {

            let priorizaciones = await Usuario.get_priorizacion();
            // id_venta_actual = id_venta_actual ?? null; // Si es undefined, lo convertimos en null

            let html = "";

            // Recorremos las ventanillas disponibles y generamos los radio buttons
            if (Array.isArray(priorizaciones) && priorizaciones.length > 0) {
                priorizaciones.forEach(row => {
                    // Cada radio button tendrá un id único basado en el id_venta
                    html += `
                        <div >
                            <input  type="radio" id="priori-${row.id_pri}" name="priori" value="${row.id_pri}">
                            <label  for="priori-${row.id_pri}">${row.pri_nom}</label>
                        </div>
                    `;
                });
            }

            res.send(html);
        } catch (error) {
            res.status(500).send("Error interno del servidor");
        }
    }


    static async combo_ventanillas(req, res) {

        try {

            const id_per = req.body.id_per || null; // Si no hay id_per, será null

            let id_venta_actual = await Usuario.get_ventanilla_x_id_persona(id_per);
            // id_venta_actual = id_venta_actual ?? null; // Si es undefined, lo convertimos en null

            const ventanillas_disponibles = await Usuario.get_ventanillas_activas_disponibles(id_per, id_venta_actual);

            let html = "<option label='Seleccione'></option>";

            if (Array.isArray(ventanillas_disponibles) && ventanillas_disponibles.length > 0) {
                ventanillas_disponibles.forEach(row => {
                    const selected = row.id_venta == id_venta_actual ? "selected" : "";
                    html += `<option value="${row.id_venta}" ${selected}>${row.venta_nom}</option>`;
                });
            }
            res.send(html);
        } catch (error) {
            res.status(500).send("Error interno del servidor");
        }
    }


    static async bascarPersona_x_id(req, res) {
        try {

            const id_per = req.body.id_per;
            const persona_econtrada = await Usuario.get_persona_x_id(id_per);


            res.status(200).json(persona_econtrada);

        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor" });
        }

    }

    static async eliminar_usuario(req, res) {

        try {

            const id_per = req.body.id_per;
            await Usuario.delete_usuario_x_id(id_per);

            res.status(200).json({ success: true, message: 'La Persona a sido eliminada' });

        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor" });
        }

    }


    static async desvincular_vetanilla_usuario(req, res) {

        try {
            const { id_per } = req.body; // Extraer directamente con destructuring
            await Usuario.desvincular_ventanilla(id_per);
         
           // Buscar la conexión del recepcionista
           let clientWsToClose = null;
           for (const [ws, clientData] of clients) {
               if (clientData.id_per == id_per) {
                   clientWsToClose = ws;
                   console.log("Cliente encontrado para id_per:", id_per);
                   break;
               }
           }

           
            if (clientWsToClose) {
                
                clientWsToClose.send(JSON.stringify({ action: "EXPULSADO"}));
                console.log("Mensaje EXPULSADO enviado a id_per:", id_per);
                clientWsToClose.close();
                clients.delete(clientWsToClose); // Eliminar del Map

                // Calcular y notificar cantidades actualizadas
    
                const usuariosConectados = [...clients.values()].filter(client => client.id_per != null).length;

                clients.forEach((client) => {
                    if (client.id_rol == 4) {
                        client.ws.send(
                            JSON.stringify({
                                action: "PERSONAL_DESCONECTADO",
                                cantidad: usuariosConectados
                            })
                        );
                    }
                });


            }
    
            res.status(200).json({ success: true, message: "La ventanilla ha sido desvinculada" });
    
        } catch (error) {
            console.error("❌ Error en desvincular_vetanilla_usuario:", error);
            res.status(500).json({ success: false, message: "Error interno del servidor" });
        }

    }
    

    static obtener_ventanilla(req, res) {
        if (!req.session.id_venta || !req.session.id_per) {
            return res.status(401).json({ error: "No autorizado" }); // Código 401 (Unauthorized)
        }

        res.json({ id_venta: req.session.id_venta, id_per: req.session.id_per });
    }

    static obtener_rol(req, res) {
        if (!req.session.id_rol || !req.session.id_per) {
            return res.status(401).json({ error: "No autorizado" }); // Código 401 (Unauthorized)
        }

        res.json({ id_rol: req.session.id_rol , id_per: req.session.id_per });
    }



    static logout(req, res) {
        const id_per = req.session?.id_per; // Evitar error si req.session no tiene id_pe
        
        if (id_per && clients[id_per]) {
            console.log(`🚨 Expulsando usuario ${id_per}`);
            clients[id_per].send(JSON.stringify({ action: "EXPULSADO" , cantidad: 1}));
            clients[id_per].close();
            delete clients[id_per]; // Eliminar del registro
        }
    
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('Error al cerrar sesión');
            }
            res.redirect('/');
        });
    }
    


    static async perfil(req, res) {

        try {
            let perfil = await Usuario.get_perfil_x_id(req.session.id_per);
            // id_venta_actual = id_venta_actual ?? null; // Si es undefined, lo convertimos en null



            let correo = perfil?.per_correo ?? "";  // Usa Nullish Coalescing (??) en lugar de OR (||)
            let telefono = perfil?.per_telef ?? "";

            let html = `  
            <input type="hidden" name="id_usuario" value="${perfil.id_per}" required>
        
            <div class="row">
                <div class="col-md-6 mb-3">
                <label for="per_nom" class="form-label">Nombre:</label>
                <input type="text" class="form-control" id="per_nom" name="per_nom" value="${perfil.per_nom}" required>
                </div>        
        
                <div class="col-md-6 mb-3">
                <label for="per_ape_pa" class="form-label">Apellido Paterno:</label>
                <input type="text" class="form-control" id="per_ape_pa" name="per_ape_pa" value="${perfil.per_ape_pa}" required>
                </div>
            </div>
        
            <div class="row">
                <div class="col-md-6 mb-3">
                <label for="per_ape_ma" class="form-label">Apellido Materno:</label>
                <input type="text" class="form-control" id="per_ape_ma" name="per_ape_ma" value="${perfil.per_ape_ma}" required>
                </div>
        
                <div class="col-md-6 mb-3">
                <label for="per_correo" class="form-label">Correo Electrónico:</label>
                <input type="email" class="form-control" id="per_correo" name="per_correo" value="${correo}">
                </div>
            </div>
        
            <div class="row">
                <div class="col-md-6 mb-3">
                <label for="per_telef" class="form-label">Teléfono:</label>
                <input type="number" class="form-control" id="per_telef" name="per_telef" value="${telefono}">
                </div>
            </div>
        
            <div class="d-flex justify-content-end">
                <button type="submit" class="btn btn-primary me-2">Guardar Cambios</button>
            </div>
        `;


            res.send(html);
        } catch (error) {
            res.status(500).send("Error interno del servidor");
        }
    }


    static async actualizar_perfil(req, res) {

        const { per_nom, per_ape_pa, per_ape_ma, per_correo, per_telef } = req.body;


        const per_nomFinal = per_nom || null;
        const per_ape_paFinal = per_ape_pa || null;
        const per_ape_maFinal = per_ape_ma || null;
        const per_correoFinal = per_correo || null;
        const per_telefFinal = per_telef || null;

        if (!per_nomFinal || !per_ape_paFinal || !per_ape_maFinal) {
            return res.status(400).json({ status: "error", message: "Complete los campos obligatorios" });
        }


        // Validación de correo electrónico
        if (per_correoFinal && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(per_correoFinal)) {
            return res.status(400).json({ status: "error", message: "Ingrese un correo electrónico válido" });
        }

        try {

            await Usuario.update_perfil(per_nomFinal, per_ape_paFinal, per_ape_maFinal, per_correoFinal, per_telefFinal, req.session.id_per);
            // id_venta_actual = id_venta_actual ?? null; // Si es undefined, lo convertimos en null
            res.status(200).json({ success: true, message: 'Datos Modificada exitosamente' });

        } catch (error) {

            res.status(500).send("Error interno del servidor");
        }
    }


}

module.exports = { UsuarioController };
