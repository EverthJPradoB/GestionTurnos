

fetch("/usuario/session_venta") // Llama al backend para obtener el id_venta
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error("Error:", data.error);
            return;
        }

        id_venta = data.id_venta; // Recupera el id de ventanilla desde PHP


        const audio = new Audio("../../sound/sonido.mp3");

        const ip = "localhost";
        const ws = new WebSocket(`ws://${ip}:3000`);


        ws.onopen = () => {

            ws.send(JSON.stringify({ action: "LISTA_TURNOS_VENTANILLA", id_venta: id_venta }));

            ws.send(JSON.stringify({ action: "LISTA_SLIDER_TURNOS", id_venta: id_venta }));

            ws.send(JSON.stringify({ action: "TURNOS_PENDIENTES_RESTANTES", id_venta: id_venta }));

            console.log("Conectado al WebSocket");

        };


        window.siguienteTurno = function () {

            ws.send(JSON.stringify({ action: "SIGUIENTE_TURNO", id_venta: id_venta }));
        };


        window.llamarTurno = function () {
            if (turnoActual) {
                ws.send(JSON.stringify({ action: "LLAMAR_TURNO", turno_id: turnoActual.id_turn, id_venta: id_venta }));
            }
            audio.play().then(() => {
                console.log("Audio desbloqueado");
            }).catch(error => console.error("Error al reproducir el sonido:", error));
        }


        window.finalizarTurno = function () {
            if (turnoActual && turnoActual.id_turn) {
                finalizarTurno_temporizador();
                ws.send(JSON.stringify({ action: "FINALIZAR_TURNO", turno_id: turnoActual.id_turn, id_venta: id_venta, id_per: data.id_per }));
                //  turnoActual = null;
                $("#turno_codigo, #turno_ventanilla, #turno_tramite, #turno_espera, #turno_estado, #turno_actual").text("-");
                $("#btnLlamarTurno, #btnFinalizarTurno,#btnAnularTurno,#btnCancelarTurno").prop("disabled", true);
            } else {
                console.warn("No hay turno seleccionado para finalizar.");
            }

        }

        window.cancelarTurno = function () {
            if (turnoActual && turnoActual.id_turn) {

                Swal.fire({
                    title: "Estas seguro de cancelar el turno?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Si, Cancelar Turno!",
                }).then((result) => {
                    if (result.isConfirmed) {

                        finalizarTurno_temporizador();
                        ws.send(JSON.stringify({ action: "CANCELAR_TURNO", turno_id: turnoActual.id_turn, id_venta: id_venta, id_per: data.id_per }));
                        //  turnoActual = null;
                        $("#turno_codigo, #turno_ventanilla, #turno_tramite, #turno_espera, #turno_estado, #turno_actual").text("-");
                        $("#btnLlamarTurno, #btnFinalizarTurno,#btnAnularTurno,#btnCancelarTurno").prop("disabled", true);

                        Swal.fire({
                            title: "Turno Cancelado!",
                            text: "El Turno a sido cancelado correctamente.",
                            icon: "success"
                        });
                    }
                });

            } else {
                console.warn("No hay turno seleccionado para finalizar.");
            }

        }

        window.anularTurno = function () {
            if (turnoActual && turnoActual.id_turn) {

                Swal.fire({
                    title: "Estas seguro de anular el turno?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Si, Anular Turno!",
                }).then((result) => {
                    if (result.isConfirmed) {


                        finalizarTurno_temporizador();
                        ws.send(JSON.stringify({ action: "AUSENTE_TURNO", turno_id: turnoActual.id_turn, id_venta: id_venta, id_per: data.id_per }));
                        //  turnoActual = null;
                        $("#turno_codigo, #turno_ventanilla, #turno_tramite, #turno_espera, #turno_estado, #turno_actual").text("-");
                        $("#btnLlamarTurno, #btnFinalizarTurno,#btnAnularTurno,#btnCancelarTurno").prop("disabled", true);

                        Swal.fire({
                            title: "Turno Cancelado!",
                            text: "El Turno a sido cancelado correctamente.",
                            icon: "success"
                        });
                    }
                });



            } else {
                console.warn("No hay turno seleccionado para finalizar.");
            }

        }
        window.priorizarTurno = function (idTurno) {

            if (idTurno) {
                $("#id_turno").val(idTurno);
                $('#modalmantenimiento').modal('show');
                // ws.send(JSON.stringify({ action: "PRIORIZAR_TURNO", turno_id: turnoActual.id_turn, id_venta: id_venta }));
            }

        }

        ws.onmessage = (event) => {


            const data = JSON.parse(event.data);

            if (data.action === "LISTA_SLIDER_TURNOS") {

                let turn_code = data.turn_code;

                let turnos_slider = data.turnos_slider;

                if (turnos_slider) {

                    if (turn_code) {
                        $('#modalmantenimiento').modal('hide');

                        Swal.fire({
                            title: "Correcto!",
                            html: `Turno <b>${turn_code}</b> priorizado correctamente`,  // Cambié 'text' por 'html'
                            icon: "success",
                            confirmButtonText: "Aceptar"
                        });
                    }

                    let sidebar = $("#sidebar_turnos").empty();
                    // sidebar.empty();  
                    turnos_slider.forEach(t => {

                        sidebar.append(`
                         <div class="d-flex justify-content-between align-items-center turno-item" id="turno-${t.id_turn}">
                            <h5 class="fw-bold text-dark">Turno: ${t.turn_code}</h5>
                            <button class="btn btn-warning btn-sm priorizar-btn" data-id="${t.id_turn}" onclick="priorizarTurno(${t.id_turn})">Priorizar</button>
                        </div>    `);
                    });

                }
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

            if (data.action === "SIN_TURNOS") {
                Swal.fire({
                    title: "Aviso",
                    icon: "info",
                    html: "<b>No hay turnos por atender</b>",
                    confirmButtonText: "Aceptar",
                });
            };

            if (data.action === "TERMINAR_TURNOS") {
                Swal.fire({
                    title: "Aviso",
                    icon: "info",
                    html: "<b>Termine de atender su turno actual</b>",
                    confirmButtonText: "Aceptar",
                });
            };

            if (data.action === "ACTUALIZAR_SLIDER_CANTIDAD") {
             
                agregarTurno(data.id_turn, data.turn_code);
                let can =$("#turno_espera").text();
         
                $("#turno_espera").text( Number(can)+ Number(data.cantidad));

            };

            if (data.action === "NO_PRIORIZAR_TURNO") {
                Swal.fire({
                    title: "Error",
                    text: "Debe seleccionar un motivo",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
            };



        };


        document.getElementById('pri_form').addEventListener('submit', (e) => {
            e.preventDefault(); // Prevenir la acción predeterminada del formulario (recargar la página)



            var id_turno = $('[name="id_turno"]').val();
            var id_priori = $('[name="priori"]:checked').val();
            var motivo = $('[name="motivo"]').val();

            // Verificar si los campos están vacíos
            if (!id_turno || !id_priori) {
                Swal.fire({
                    title: "Error",
                    text: "Debe seleccionar un motivo",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });

                return; // Evitar el envío de los datos
            }

            var formData = { id_venta: id_venta, id_turno: id_turno, id_priori: id_priori, motivo: motivo };

            // Enviar los datos del formulario al servidor WebSocket
            ws.send(JSON.stringify({ action: "PRIORIZAR_TURNO", formData }));


            console.log('Datos enviados:', formData);
        });




        function actualizarInterfaz(turno) {
            if (turno) {
                $("#turno_codigo").text(turno.turn_code);
                $("#turno_ventanilla").text(turno.venta_nom);
                $("#turno_tramite").text(turno.tra_descrip);
                $("#turno_espera").text(turno.turnos_espera);
                $("#turno_estado").text(turno.esta_turn_nom);
                $("#tiempo_estimado").text(turno.tra_tiem_esti);


                // 🔥 Limpia la bandera de turno finalizado
                localStorage.removeItem("turnoFinalizado");
                console.log(turno);
                
                console.log();
                
                if (turnoActual.tra_tiem_esti) {
                    iniciarCuentaRegresiva(turnoActual.tra_tiem_esti * 60);
                }

                $("#btnLlamarTurno, #btnFinalizarTurno,#btnAnularTurno,#btnCancelarTurno").prop("disabled", false);
            } else {
                $("#turno_codigo, #turno_ventanilla, #turno_tramite, #turno_espera, #turno_estado, #turno_actual").text("-");
                $("#btnLlamarTurno, #btnFinalizarTurno,#btnAnularTurno,#btnCancelarTurno").prop("disabled", true);

            }
        }


        let intervaloCuentaRegresiva; // Definir la variable en el ámbito global

        function iniciarCuentaRegresiva(DURACION_TURNO) {
            console.log("Duración del turno (en segundos):", DURACION_TURNO);

            // Si el turno ya finalizó, no iniciar el contador
            if (localStorage.getItem("turnoFinalizado") === "true") {
                $("#tiempo_estimado").text("Tiempo finalizado");
                return;
            }

            let inicioTurno = localStorage.getItem("inicioTurno");

            // Si no hay un tiempo de inicio, lo guardamos
            if (!inicioTurno) {
                inicioTurno = Date.now();
                localStorage.setItem("inicioTurno", inicioTurno);
            } else {
                inicioTurno = parseInt(inicioTurno, 10);
            }

            function actualizarTiempoRestante() {
                const tiempoPasado = Math.floor((Date.now() - inicioTurno) / 1000); // segundos transcurridos
                let tiempoRestante = Math.max(0, DURACION_TURNO - tiempoPasado); // ya en segundos

                let minutos = Math.floor(tiempoRestante / 60);
                let segundos = tiempoRestante % 60;
                segundos = segundos < 10 ? "0" + segundos : segundos;

                let tiempoEstimado = $("#tiempo_estimado");
                tiempoEstimado.text(`${minutos}:${segundos}`);

                // Calcular umbrales dinámicamente
                let umbralAdvertencia = Math.floor(DURACION_TURNO * 0.20); // 20% del tiempo total
                let umbralCritico = Math.floor(DURACION_TURNO * 0.10); // 10% del tiempo total

                // Cambiar colores según el tiempo restante
                if (tiempoRestante <= umbralCritico) {
                    tiempoEstimado.css("color", "red"); // Crítico
                } else if (tiempoRestante <= umbralAdvertencia) {
                    tiempoEstimado.css("color", "orange"); // Advertencia
                } else {
                    tiempoEstimado.css("color", "green"); // Normal
                }

                if (tiempoRestante <= 0) {
                    clearInterval(intervaloCuentaRegresiva);
                    tiempoEstimado.text("Tiempo finalizado");
                    localStorage.setItem("turnoFinalizado", "true"); // Guardamos que el turno ha finalizado
                }
            }

            // Iniciar la cuenta regresiva
            actualizarTiempoRestante();
            intervaloCuentaRegresiva = setInterval(actualizarTiempoRestante, 1000);
        }


        // Reset cuando el turno termina
        function finalizarTurno_temporizador() {
            localStorage.removeItem("inicioTurno");
            clearInterval(intervaloCuentaRegresiva); // Detener el intervalo de tiempo
            $("#tiempo_estimado").text("-"); // Reiniciar el texto del temporizador en la interfaz
        }


        function removerTurno(turnoId) {
            const turno = document.getElementById(`turno-${turnoId}`);
            if (turno) {
                turno.remove();
            }
        }

        function agregarTurno(id_turn, turn_code) {
            let sidebar = $("#sidebar_turnos");
        
            if (!sidebar.length) return; // Si no existe, salir
        
            // Verificar si el turno ya existe
            if (document.getElementById(`turno-${id_turn}`)) {
                return; // Evita duplicados
            }
        
            // Crear el elemento dinámicamente
            let turnoHtml = `
                <div class="d-flex justify-content-between align-items-center turno-item" id="turno-${id_turn}">
                    <h5 class="fw-bold text-dark">Turno: ${turn_code}</h5>
                    <button class="btn btn-warning btn-sm priorizar-btn" data-id="${id_turn}" onclick="priorizarTurno(${id_turn})">Priorizar</button>
                </div>
            `;
        
            // Agregar al final de la lista
            sidebar.append(turnoHtml);
        }
        
        
    



    })
    .catch(error => console.error("Error obteniendo sesión:", error));


