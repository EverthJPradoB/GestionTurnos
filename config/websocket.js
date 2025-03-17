const WebSocket = require("ws");

const { WebSocketModels } = require('../models/WebSocketModels'); // Asegúrate de que el nombre coincide

const clients = new Map();

function setupWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    console.log("cliente conectado");

    wss.on("connection", (ws) => {
        // Inicializamos los datos del cliente

        console.log(`Conexiones activas: ${wss.clients.size}`);

        const clientData = {
            ws,
            id_venta: null, // Se definirá cuando el cliente envíe su ID
            id_rol: null,
            pantalla_view: false, // Si ve todas las ventanillas
            kiosko_view: false,
            tipo: null,
            id_per: null
        };
        clients.set(ws, clientData);

        ws.on("message", async (data) => {
            try {
                const message = JSON.parse(data);

                if (!message || !message.action) return;

                switch (message.action) {

                    case "LISTA_TURNOS_VENTANILLA":

                        id_venta = message.id_venta ?? null; // Obtener id_venta
                        clientData.id_venta = id_venta; // Guardar el id_venta en el cliente

                        // Obtener turnos pendientes para la ventanilla específica
                        turnos_ventanilla = await WebSocketModels.get_turnos_x_id_venta(id_venta);

                        pendientes = await WebSocketModels.get_cantidad_pendientes(id_venta);


                        // 🔹 **Enviar solo a clientes con el mismo id_venta**
                        clients.forEach((client) => {
                            if (client.id_venta === id_venta) {
                                client.ws.send(
                                    JSON.stringify({
                                        action: "LISTA_TURNOS_VENTANILLA",
                                        turnos_ventanilla: turnos_ventanilla,
                                        pendientes: pendientes
                                    })
                                );
                            }
                        });


                        break;


                    case "LISTAR_VENTANILLAS_KIOSKO":

                        if ("kiosko_view" in message) {
                            clientData.kiosko_view = message.kiosko_view;
                        }


                        kiosko_general = await WebSocketModels.get_ventanilla_tramite_kiosko();

                        clients.forEach((client) => {
                            if (client.kiosko_view === true) {
                                client.ws.send(
                                    JSON.stringify({
                                        action: "LISTAR_VENTANILLAS_KIOSKO",
                                        kiosko_general: kiosko_general,
                                    })
                                );
                            }
                        });


                        break;



                    case "LISTAR_PANTALLA_GENERAL":

                        if ("pantalla_view" in message) {
                            clientData.pantalla_view = message.pantalla_view;
                        }

                        // Obtener turnos pendientes para la ventanilla específica
                        pantalla_general = await WebSocketModels.get_turnos_totales_pantalla();

                        // 🔹 **Enviar solo a clientes con el mismo id_venta**
                        clients.forEach((client) => {
                            if (client.pantalla_view == true) {
                                client.ws.send(
                                    JSON.stringify({
                                        action: "LISTAR_PANTALLA_GENERAL",
                                        pantalla_general: pantalla_general,
                                    })
                                );
                            }
                        });

                        break;

                    case "SIGUIENTE_TURNO":

                        id_venta = message.id_venta ?? null; // Obtener id_venta
                        clientData.id_venta = id_venta; // Guardar el id_venta en el cliente


                        if ("pantalla_view" in message) {
                            clientData.pantalla_view = message.pantalla_view;
                        }

                        en_atencion = await WebSocketModels.get_turno_en_atencion_actual(id_venta);

                        if (en_atencion == 0) {

                            disponibles_pendientes = await WebSocketModels.get_turno_disponible(id_venta);

                            // return disponibles[0].id_turn; // Retorna el id del primer turno o null si no hay


                            if (disponibles_pendientes > 0) {

                                await WebSocketModels.update_pendientes_x_en_atencion(disponibles_pendientes);

                                nuevo_turno = await WebSocketModels.get_turno_nuevo_actual(disponibles_pendientes);
                                turnos_ventanilla = nuevo_turno;

                                turnos_ventanilla_pantalla = await WebSocketModels.get_datos_patanlla_x_ventana(id_venta);

                                cantidad_restantes_pendientes = await WebSocketModels.cantidad_restantes_pendientes(id_venta);



                                clients.forEach((client) => {


                                    if (client.id_venta === id_venta) {
                                        client.ws.send(
                                            JSON.stringify({
                                                action: "LISTA_TURNOS_VENTANILLA",
                                                turnos_ventanilla: turnos_ventanilla,
                                                pendientes: cantidad_restantes_pendientes,
                                                id_turn: disponibles_pendientes,


                                            })
                                        );
                                    }

                                    if (client.pantalla_view === true) {
                                        client.ws.send(
                                            JSON.stringify({
                                                action: "LISTA_TURNOS_PANTALLA_CIUDADANO",
                                                turnos_ventanilla_pantalla: turnos_ventanilla_pantalla,
                                                id_venta: id_venta
                                            })
                                        );
                                    }



                                });


                            } else {

                                clients.forEach((client) => {
                                    if (client.id_venta === id_venta) {
                                        client.ws.send(
                                            JSON.stringify({
                                                action: "SIN_TURNOS",
                                                // turnos: turnos,
                                            })
                                        );
                                    }
                                });

                            }

                        } else {

                            clients.forEach((client) => {
                                if (client.id_venta === id_venta) {
                                    client.ws.send(
                                        JSON.stringify({
                                            action: "TERMINAR_TURNOS",
                                            // turnos: turnos,
                                        })
                                    );
                                }
                            });

                        }


                        break;


                    case "LISTA_SLIDER_TURNOS":

                        id_venta = message.id_venta ?? null; // Obtener id_venta
                        clientData.id_venta = id_venta; // Guardar el id_venta en el cliente

                        //// no es necesario
                        clients.set(ws, clientData); // Actualizar en el Map

                        console.log("sasa: " + id_venta);

                        // Obtener turnos pendientes para la ventanilla específica
                        turnos_slider = await WebSocketModels.get_turnos_pendientes_slider_x_id_venta(id_venta);


                        // 🔹 **Enviar solo a clientes con el mismo id_venta**
                        clients.forEach((client) => {

                            if (client.id_venta == id_venta) {
                                client.ws.send(
                                    JSON.stringify({
                                        action: "LISTA_SLIDER_TURNOS",
                                        turnos_slider: turnos_slider,
                                    })
                                );
                            }
                        });

                        break;

                    case 'FINALIZAR_TURNO':

                        id_venta = message.id_venta ?? null; // Obtener id_venta
                        clientData.id_venta = id_venta; // Guardar el id_venta en el cliente

                        id_turn = message.turno_id ?? null;
                        id_per = message.id_per ?? null;

                        if ("pantalla_view" in message) {
                            clientData.pantalla_view = message.pantalla_view;
                        }

                        if ("id_rol" in message) {
                            clientData.id_rol = message.id_rol;
                        }


                        await WebSocketModels.update_en_atencion_x_en_finalizado(id_turn)

                        // se obtiene la fecha de atencion
                        turn_fecha_aten = await WebSocketModels.get_turn_fecha_aten(id_turn);
                        // se inserta en la tabla de atendidos

                        await WebSocketModels.insert_atendidos(turn_fecha_aten, id_turn, id_per);

                        ///////////// NO SE MODIFICA
                        //turnos_ventanilla_pantalla = await WebSocketModels.get_datos_patanlla_x_ventana(id_venta);

                        clients.forEach((client) => {

                            if (client.pantalla_view === true) {
                                client.ws.send(
                                    JSON.stringify({
                                        action: "LIMPIAR_EN_ATENCION",
                                        turno_id: id_turn

                                    })
                                );
                            }

                            if (client.id_venta == id_venta || client.id_rol == id_rol) {
                                client.ws.send(
                                    JSON.stringify({
                                        action: "DATOS_ESTADISTICOS_ACTUALIZAR",
                                        finalizado: 1,
                                    })
                                );
                            }



                        });

                        break;

                    case 'LLAMAR_TURNO':


                        id_venta = message.id_venta ?? null; // Obtener id_venta
                        clientData.id_venta = id_venta; // Guardar el id_venta en el cliente

                        id_turn = message.turno_id ?? null;


                        if ("pantalla_view" in message) {
                            clientData.pantalla_view = message.pantalla_view;
                        }


                        clients.forEach((client) => {
                            if (client.pantalla_view === true) {
                                client.ws.send(
                                    JSON.stringify({
                                        action: "LLAMAR_TURNO",
                                        turno_id: id_turn,
                                        id_venta: id_venta
                                    })
                                );
                            }
                        });


                        break;

                    case "PRIORIZAR_TURNO":

                        formData = message.formData;

                        id_venta = formData.id_venta ?? null; // Obtener id_venta
                        id_turno = formData.id_turno ?? null; // Obtener id_turno
                        id_priori = formData.id_priori ?? null; // Obtener priori
                        motivo = formData.motivo ?? null; // Obtener motivo

                        clientData.id_venta = id_venta; // Guardar el id_venta en el cliente

                        if ("pantalla_view" in message) {
                            clientData.pantalla_view = message.pantalla_view;
                        }


                        // Validación de campos
                        if (!id_turno || !id_priori) {

                            console.log("hola");

                            // Verifica si id_turno o priori están vacíos o no definidos
                            clients.forEach((client) => {
                                if (client.id_venta === id_venta) {
                                    client.ws.send(
                                        JSON.stringify({
                                            action: "NO_PRIORIZAR_TURNO",
                                        })
                                    );
                                }
                            });

                            return;
                        }


                        await WebSocketModels.update_pioridad_turno(id_priori, id_turno);

                        turn_code = await WebSocketModels.select_turn_code_x_id_turn(id_turno);

                        turnos_slider = await WebSocketModels.get_turnos_pendientes_slider_x_id_venta(id_venta);

                        /////////////  MODIFICAR TURNOS EN PANTALLA
                        turnos_ventanilla_pantalla = await WebSocketModels.get_datos_patanlla_x_ventana(id_venta);


                        clients.forEach((client) => {
                            if (client.id_venta === id_venta) {
                                client.ws.send(
                                    JSON.stringify({
                                        action: "LISTA_SLIDER_TURNOS",
                                        turnos_slider: turnos_slider,
                                        turn_code: turn_code
                                    })
                                );
                            }
                        });


                        clients.forEach((client) => {


                            if (client.pantalla_view === true) {
                                client.ws.send(
                                    JSON.stringify({
                                        action: "LISTA_TURNOS_PANTALLA_CIUDADANO",
                                        turnos_ventanilla_pantalla: turnos_ventanilla_pantalla,
                                        id_venta: id_venta
                                    })
                                );
                            }

                        });

                        break;

                    case 'CANCELAR_TURNO':

                        id_venta = message.id_venta ?? null; // Obtener id_venta
                        clientData.id_venta = id_venta; // Guardar el id_venta en el cliente

                        id_turn = message.turno_id ?? null;
                        id_per = message.id_per ?? null;



                        if ("pantalla_view" in message) {
                            clientData.pantalla_view = message.pantalla_view;
                        }


                        if ("id_rol" in message) {
                            clientData.id_rol = message.id_rol;
                        }

                        await WebSocketModels.update_en_atencion_x_en_cancelado_anulado(4, id_per, id_turn)

                        ///////////// NO SE MODIFICA
                        //turnos_ventanilla_pantalla = await WebSocketModels.get_datos_patanlla_x_ventana(id_venta);
                        console.log(clientData.id_venta);

                        clients.forEach((client) => {
                            if (client.pantalla_view === true) {
                                client.ws.send(
                                    JSON.stringify({
                                        action: "LIMPIAR_EN_ATENCION",
                                        turno_id: id_turn
                                    })
                                );
                            }

                            if (client.id_venta == id_venta || client.id_rol == id_rol) {

                                client.ws.send(
                                    JSON.stringify({
                                        action: "DATOS_ESTADISTICOS_ACTUALIZAR",
                                        cancelado: 1,
                                    })
                                );
                            }

                        });



                        break;

                    case 'AUSENTE_TURNO':

                        id_venta = message.id_venta ?? null; // Obtener id_venta
                        clientData.id_venta = id_venta; // Guardar el id_venta en el cliente

                        id_turn = message.turno_id ?? null;
                        id_per = message.id_per ?? null;



                        if ("pantalla_view" in message) {
                            clientData.pantalla_view = message.pantalla_view;
                        }


                        if ("id_rol" in message) {
                            clientData.id_rol = message.id_rol;
                        }


                        await WebSocketModels.update_en_atencion_x_en_cancelado_anulado(5, id_per, id_turn)

                        ///////////// NO SE MODIFICA
                        //turnos_ventanilla_pantalla = await WebSocketModels.get_datos_patanlla_x_ventana(id_venta);

                        clients.forEach((client) => {
                            if (client.pantalla_view === true) {
                                client.ws.send(
                                    JSON.stringify({
                                        action: "LIMPIAR_EN_ATENCION",
                                        turno_id: id_turn
                                    })
                                );
                            }

                            if (client.id_venta == id_venta || client.id_rol == id_rol) {

                                client.ws.send(
                                    JSON.stringify({
                                        action: "DATOS_ESTADISTICOS_ACTUALIZAR",
                                        ausente: 1,
                                    })
                                );
                            }

                        });

                        break;


                    case "DATOS_ESTADISTICOS_CARDS":

                        id_venta = message.id_venta ?? null; // Obtener id_venta

                        id_rol = message.id_rol ?? null;

                        clientData.id_venta = id_venta;
                        clientData.id_rol = id_rol;

                        datos_estadisticos = await WebSocketModels.datos_estaditicos_finalizados_cancelados_ausentes(id_rol, id_venta);

                        clients.forEach((client) => {
                            if (client.id_venta == id_venta || client.id_rol == id_rol) {
                                client.ws.send(
                                    JSON.stringify({
                                        action: "DATOS_ESTADISTICOS_CARDS",
                                        datos_estadisticos: datos_estadisticos,
                                    })
                                );
                            }
                        });

                        break;


                    ////////////////////////////////////////////////////////////////////////////

                    case "REGISTRAR":
                        clientData.tipo = message.tipo ?? null; // Asignamos el tipo desde el principio

                        if (clientData.tipo === "kiosko") {
                            // Reemplazar conexión antigua del kiosko si existe
                            for (const [existingWs, existingClient] of clients) {
                                if (existingClient.tipo === "kiosko" && existingWs !== ws) {
                                    console.log("Cerrando conexión antigua del kiosko");
                                    existingWs.close();
                                    clients.delete(existingWs);
                                }
                            }
                            console.log("Kiosko registrado (único)"); // La conexión ya está en clients con tipo "kiosko"
                        } else if (clientData.tipo === "pantalla_ciudadano") {
                            // Reemplazar conexión antigua de Pantalla del Ciudadano si existe
                            for (const [existingWs, existingClient] of clients) {
                                if (existingClient.tipo === "pantalla_ciudadano" && existingWs !== ws) {
                                    console.log("Cerrando conexión antigua de Pantalla del Ciudadano");
                                    existingWs.close();
                                    clients.delete(existingWs);
                                }
                            }
                            console.log("Pantalla del Ciudadano registrada (única)"); // La conexión ya está en clients con tipo "pantalla_ciudadano"
                        } else {
                            // Manejo de usuarios con id_per
                            const id_per = message.id_per ?? null;
                            if (!id_per) break;

                            for (const [existingWs, existingClient] of clients) {
                                if (existingClient.id_per === id_per && existingWs !== ws) {
                                    console.log(`Reemplazando conexión antigua para id_per: ${id_per}`);
                                    existingWs.close();
                                    clients.delete(existingWs);
                                }
                            }

                            clientData.id_per = id_per; // Solo usuarios tienen id_per
                      

                        }

                        kioskoConectado = [...clients.values()].filter(client => client.tipo === "kiosko").length;
                        pantallaConectada = [...clients.values()].filter(client => client.tipo === "pantalla_ciudadano").length;
                        usuariosConectados = [...clients.values()].filter(client => client.id_per != null).length;

                        clients.forEach((client) => {
                            if (client.id_rol == 4) {
                                client.ws.send(
                                    JSON.stringify({
                                        action: "USUARIOS_CONECTADOS",
                                        cantidad: usuariosConectados,
                                        pantalla: pantallaConectada,
                                        kiosko: kioskoConectado
                                    })
                                );
                            }
                        });


                        break;



                    case "SOLICITAR_CONECTADOS":
                        id_rol = message.id_rol ?? null;
                        clientData.id_rol = id_rol;

                        // Contar solo los clientes con id_per asignado
                        kioskoConectado = [...clients.values()].filter(client => client.tipo === "kiosko").length;
                        pantallaConectada = [...clients.values()].filter(client => client.tipo === "pantalla_ciudadano").length;
                        usuariosConectados = [...clients.values()].filter(client => client.id_per != null).length;


                        // Enviar la cantidad correcta a los administradores
                        clients.forEach((clientData, clientWs) => {
                            if (clientData.id_rol === id_rol) {
                                clientWs.send(
                                    JSON.stringify({
                                        action: "USUARIOS_CONECTADOS",
                                        cantidad: usuariosConectados,
                                        pantalla: pantallaConectada,
                                        kiosko: kioskoConectado
                                    })
                                );
                            }
                        });

                        break;


                }
            } catch (error) {
                console.error("Error procesando mensaje:", error);
            }
        });

        ws.on("close", () => {
            console.log(`Conexiones activas: ${wss.clients.size}`);
            setTimeout(() => {
                if (clients.has(ws)) { // Si no se reconectó
                    clients.delete(ws);
                    // console.log("Cliente eliminado tras 5 segundos, id_per:", clientData.id_per);
                    const usuariosConectados = [...clients.values()].filter(client => client.id_per != null).length;
                    const kioskoConectado = [...clients.values()].filter(client => client.tipo === "kiosko").length;
                    const pantallaConectada = [...clients.values()].filter(client => client.tipo === "pantalla_ciudadano").length;


                    clients.forEach((client) => {
                        if (client.id_rol == 4) {
                            client.ws.send(
                                JSON.stringify({
                                    action: "TODOS_DESCONECTADO",
                                    cantidad: usuariosConectados,
                                    pantalla: pantallaConectada,
                                    kiosko: kioskoConectado
                                })
                            );
                        }
                    });
                }
            }, 5000); // 5 segundos de gracia

        });

    });

    return wss;
}

async function enviarMensajeWebSocket(payload) {

    // Asegúrate de acceder a 'action' a través de 'payload.action'
    if (payload.action === "NUEVO_TURNO") {

        const id_venta = payload.id_venta ?? null; // Obtener id_venta
        const turn_code = payload.turn_code;
        const id_turn = payload.id_turn;
        const pantalla_view = payload.pantalla_view;

        try {
            turnos_ventanilla_pantalla = await WebSocketModels.get_datos_patanlla_x_ventana(id_venta);
        } catch (error) {
            console.error("Error al obtener datos de pantalla:", error);
            return; // O puedes enviar un mensaje de error a los clientes si es necesario
        }
        // Procesa los clientes y envía los mensajes
        clients.forEach((clientData, ws) => {
            console.log(1);

            // Asegúrate de que el id_venta coincida
            if (clientData.id_venta == id_venta) {
                console.log(2);

                // Enviar el mensaje a este cliente
                ws.send(
                    JSON.stringify({
                        action: "ACTUALIZAR_SLIDER_CANTIDAD",
                        turn_code: turn_code,
                        id_turn: id_turn,
                        cantidad: 1
                    })
                );
                console.log("📡 Mensaje enviado a cliente con id_venta:", id_venta);
            }



            if (clientData.pantalla_view === true) {
                ws.send(
                    JSON.stringify({
                        action: "LISTA_TURNOS_PANTALLA_CIUDADANO",
                        turnos_ventanilla_pantalla: turnos_ventanilla_pantalla,
                        id_venta: id_venta
                    })
                );
            }
        });


    }
}

// module.exports = setupWebSocket;
module.exports = { setupWebSocket, clients, enviarMensajeWebSocket };