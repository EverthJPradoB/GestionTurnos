

fetch("/usuario/session_rol") // Llama al backend para obtener el id_venta
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error("Error:", data.error);
            return;
        }


        const ip = "localhost";
        const ws = new WebSocket(`ws://${ip}:3000`);


        ws.onopen = () => {

            ws.send(JSON.stringify({ action: "DATOS_ESTADISTICOS_CARDS",id_rol: data.id_rol }));

        
        };

        ws.onmessage = (event) => {


            const data = JSON.parse(event.data);

            if (data.action === "DATOS_ESTADISTICOS_CARDS") {

                const estad = data.datos_estadisticos;
                console.log(estad);
                
                $("#finalizados").text(estad.finalizados)
                $("#cancelados").text(estad.cancelados)
                $("#anulados").text(estad.anulados)
            }

            if (data.action === "LISTA_TURNOS_VENTANILLA") {

                id_turn = data.id_turn;

                let turnos = data.turnos_ventanilla;

                //let turnoEnAtencion = turnos.find(turno => turno.id_est_turn == 2);
                turnoActual = turnos.find(turno => turno.id_est_turn == 2);
                if (turnoActual) {
                    validarActualBandera = true;
                    actualizarInterfaz(turnoActual);
                    $("#btnLlamarTurno").prop("disabled", false);
                    $("#btnFinalizarTurno").prop("disabled", false);
                    $("#btnCancelarTurno").prop("disabled", false);
                    $("#btnAnularTurno").prop("disabled", false);

                }

                $("#turno_espera").text(data.pendientes);

                if (id_turn) {
                    removerTurno(id_turn);
                }

            }

        };



        
        
    



    })
    .catch(error => console.error("Error obteniendo sesión:", error));


