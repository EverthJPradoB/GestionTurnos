<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Turnos</title>
    <!-- Enlace a Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- <style>
        /* Estilo adicional para personalizar */
        .turno-actual {
            font-size: 3rem;
            font-weight: bold;
            color: #28a745;
            /* Verde para el turno actual */
        }

        .siguiente-turno {
            font-size: 1.75rem;
            color: #007bff;
            /* Azul para el siguiente turno */
        }

        .turno-pendiente {
            font-size: 2rem;
            color: #ffc107;
            /* Amarillo para turnos pendientes */
        }

        /* Estilo para el logo o espacio reservado */
        .espacio-logo {
            /* background-color:rgb(49, 6, 6); */
            height: 100%;
            /* Ajustamos la altura al 100% del contenedor */
            /* border: 2px solid #007bff; */
            border-radius: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            height: 350px;
            /* Ajuste de altura */
            width: 350px;
            /* Ajuste de ancho */
            margin-left: 40px;

        }

        /* Ventanilla con ajuste de tamaño */
        .ventanilla {
            border: 2px solid #ccc;
            padding: 20px;
            /* margin-bottom: 20px; */
            border-radius: 10px;
            background-color: #f9f9f9;
            height: 100%;
            /* Ajuste de altura */
        }

        /* Diseño de contenedor para todo */
        .container {
            background-color: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
        }

        /* Estilo de la fila de ventanillas */
        .row-ventanillas {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;

        }

        /* Estilo para la fila de 4 ventanillas de abajo */
        .row-ventanillas-bottom {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
        }

        /* Ajuste de columnas */
        .col-md-2 {
            flex: 1 1 calc(33.33% - 20px);
            /* Ajuste para que las ventanillas no se vean tan delgadas */
            margin: 10px;
        }

        /* Espacio para el logo */
        .col-md-4-logo {
            flex: 1 1 calc(33.33% - 20px);
            /* El logo ocupa el 33% del espacio restante */
            margin: 10px;
        }

        /* Ajustes responsivos */
        @media (max-width: 768px) {
            .espacio-logo {
                width: 100px;
                height: 60px;
            }

            .ventanilla {
                padding: 15px;
                width: 180px;
                min-height: 220px;
            }
        }
    </style> -->
</head>

<body class="">

    <div class="">
        <!-- <h1 class="display-4 text-center mb-5">Sistema de Turnos</h1> -->

        <!-- Fila para las 2 ventanillas de arriba -->
        <!-- <div class="row-ventanillas">
      <div class="col-md-2 mb-4">
        <div class="ventanilla text-center">
          <h3>Ventanilla 1</h3>
          <div class="turno-actual">Turno: 45</div>
          <div class="siguiente-turno">Siguiente: 46</div>
          <ul class="list-group mt-3">
            <li class="list-group-item turno-pendiente">Turno 47</li>
            <li class="list-group-item turno-pendiente">Turno 48</li>
          </ul>
        </div>
      </div>

      <div class="col-md-2 mb-4">
        <div class="ventanilla text-center">
          <h3>Ventanilla 2</h3>
          <div class="turno-actual">Turno: 46</div>
          <div class="siguiente-turno">Siguiente: 47</div>
          <ul class="list-group mt-3">
            <li class="list-group-item turno-pendiente">Turno 48</li>
            <li class="list-group-item turno-pendiente">Turno 49</li>
          </ul>
        </div>
      </div>

      <div class="col-md-4-logo mb-4">
        <div class="espacio-logo">
          <img width="100%" height="100%" src="../../../assets/images/logo.png" alt="">
         
        </div>
      </div>
    </div> -->

        <!-- Fila para las 4 ventanillas de abajo -->
        <!-- 
    <div class="row-ventanillas-bottom">
      <div class="col-md-2 mb-4">
        <div class="ventanilla text-center">
          <h3>Ventanilla 3</h3>
          <div class="turno-actual">Turno: 47</div>
          <div class="siguiente-turno">Siguiente: 48</div>
          <ul class="list-group mt-3">
            <li class="list-group-item turno-pendiente">Turno 49</li>
            <li class="list-group-item turno-pendiente">Turno 50</li>
          </ul>
        </div>
      </div>

      <div class="col-md-2 mb-4">
        <div class="ventanilla text-center">
          <h3>Ventanilla 4</h3>
          <div class="turno-actual">Turno: 48</div>
          <div class="siguiente-turno">Siguiente: 49</div>
          <ul class="list-group mt-3">
            <li class="list-group-item turno-pendiente">Turno 50</li>
            <li class="list-group-item turno-pendiente">Turno 51</li>
          </ul>
        </div>
      </div>

      <div class="col-md-2 mb-4">
        <div class="ventanilla text-center">
          <h3>Ventanilla 5</h3>
          <div class="turno-actual">Turno: 49</div>
          <div class="siguiente-turno">Siguiente: 50</div>
          <ul class="list-group mt-3">
            <li class="list-group-item turno-pendiente">Turno 51</li>
            <li class="list-group-item turno-pendiente">Turno 52</li>
          </ul>
        </div>
      </div>

      <div class="col-md-2 mb-4">
        <div class="ventanilla text-center">
          <h3>Ventanilla 6</h3>
          <div class="turno-actual">Turno: 50</div>
          <div class="siguiente-turno">Siguiente: 51</div>
          <ul class="list-group mt-3">
            <li class="list-group-item turno-pendiente">Turno 52</li>
            <li class="list-group-item turno-pendiente">Turno 53</li>
          </ul>
        </div>
      </div>
    </div> -->
    </div>

    <style>
        body {
            margin: 0;
            font-family: Arial, sans-serif;
        }

        .sidebar-container {
            position: fixed;
            right: -300px;
            top: 60px;
            height: 100vh;
            transition: right 0.3s ease;
        }

        .sidebar {
            width: 300px;
            height: 100vh;
            background-color: #f8f9fa;
            padding: 15px;
            box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
        }

        .toggle-btn {
            position: fixed;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            width: 60px;
            height: 50px;
            background-color: #007bff;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border-radius: 5px;
            transition: right 0.3s ease;
        }

        .w-button {

            width: 220px;
            height: 50px;
            margin: 10px;
        }

        .turno-item {
            padding: 12px;
            border-radius: 10px;
            margin-bottom: 10px;
            background: white;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            border-left: 6px solid #007bff;
            cursor: pointer;
        }

        .turno-item:hover {
            background-color: #e9ecef;
        }

        .turno-item.tramite1 {
            border-left-color: #28a745;
        }

        .scrollable-div {

            /* Ancho fijo */
            height: calc(100vh - 60px);
            overflow-y: auto;
            /* Altura fija */
            /* Permite scroll vertical */

        }
    </style>

    <h1>Recepción</h1>
    <button onclick="siguienteTurno()">Siguiente Turno</button>
    <button id="btnLlamarTurno" onclick="llamarTurno()" disabled>Llamar Turno</button>
    <button id="btnFinalizarTurno" onclick="finalizarTurno()" disabled>Finalizar Turno</button>



    <h6>Turno Actual: <b><span id="turno_codigo"></span></b></h6>
    <h6 class="pt-3">Ventanilla: <b><span id="turno_ventanilla"></span></b></h6>
    <h6 class="pt-3">Tramite: <b><span id="turno_tramite"></span></b></h6>
    <h6 class="pt-3">Turnos en espera: <b><span id="turno_espera"></span></b></h6>
    <h6 class="font-weight-bold text-success pt-3">Estado: <b><span id="turno_estado"></span></b></h6>

    <p>Turno actual: <span id="turno_actual"></span></p>


    <div>
        <div class="toggle-btn">Turnos</div>
        <div class="sidebar-container">
            <div class="sidebar">
                <h5>Lista de Turnos Pendientes</h5>
                <div id="sidebar_turnos" class="scrollable-div">

                </div>
            </div>
        </div>
    </div>


    <?php
    require_once("../../html/MainJs.php");
    ?>
    <!-- <script src="pantalla.js"></script> -->
    <script>
        const ws = new WebSocket("ws://34.58.169.105:2347");


        let validarActualBandera = false;

        // $(document).ready(function () {
        //         $.ajax({
        //             url: "../../../controllers/usuario.php?op=obtener_turno_actual",
        //             type: "GET",
        //             success: function (response) {
        //                 let data = JSON.parse(response);
        //                 console.log(data);

        //                 if (data && data.status === "success" && data.data) {
        //                     turnoActual = data.data;

        //                     if (turnoActual.id_est_turn == 2) {

        //                         validarActualBandera = true;
        //                         actualizarInterfaz(turnoActual);

        //                         // ✅ Habilitar botones porque ya hay un turno en proceso
        //                         $("#btnLlamarTurno").prop("disabled", false);
        //                         $("#btnFinalizarTurno").prop("disabled", false);
        //                     } else {
        //                         // 🟡 Si el turno está "PENDIENTE", no mostramos nada hasta que se presione "Siguiente"
        //                         console.log("No hay turno en atención. Esperando que se presione 'Siguiente Turno'.");
        //                     }
        //                 } else {
        //                     console.log("No hay turnos disponibles");
        //                 }
        //             },
        //             error: function () {
        //                 Swal.fire({
        //                     title: "Error",
        //                     text: "Ocurrió un problema en la conexión con el servidor.",
        //                     icon: "error",
        //                     confirmButtonText: "Aceptar"
        //                 });
        //             }
        //         });
        // });

        ws.onopen = () => {
            console.log("Conectado al WebSocket");
            let turnoActual = null;
        };


        function siguienteTurno() {


            // Actualizar la interfaz con los datos del turno

            /// enviar mensaje al servidor
            ws.send(JSON.stringify({
                action: "SIGUIENTE_TURNO"
            }));

        }

        function llamarTurno() {
            if (turnoActual) {
                ws.send(JSON.stringify({ action: "LLAMAR_TURNO", turno_id: turnoActual.id_turn }));
            }
        }


        function finalizarTurno() {
            if (turnoActual && turnoActual.id_turn) {
                ws.send(JSON.stringify({ action: "FINALIZAR_TURNO", turno_id: turnoActual.id_turn }));

                //  turnoActual = null;
                $("#turno_codigo, #turno_ventanilla, #turno_tramite, #turno_espera, #turno_estado, #turno_actual").text("-");

                $("#btnLlamarTurno, #btnFinalizarTurno").prop("disabled", true);
            } else {
                console.warn("No hay turno seleccionado para finalizar.");
            }
        }


        ws.onmessage = (event) => {


            const data = JSON.parse(event.data);

            if (data.action === "LISTA_TURNOS") {
                let turnos = data.turnos;

                //let turnoEnAtencion = turnos.find(turno => turno.id_est_turn == 2);
                turnoActual = turnos.find(turno => turno.id_est_turn == 2);
                if (turnoActual) {
                    validarActualBandera = true;
                    actualizarInterfaz(turnoActual);
                    $("#btnLlamarTurno").prop("disabled", false);
                    $("#btnFinalizarTurno").prop("disabled", false);
                }

                let turnos_slider = data.turnos_silder_recpcion;

                if (turnos_slider) {

                    let sidebar = $("#sidebar_turnos");
                    turnos_slider.forEach(t => {
                        sidebar.append(`
                        <div class="turno-item" id="turno-${t.id_turn}">
                            <h5 class="fw-bold text-dark">Turno: ${t.turn_code}</h5>
                        
                        </div>`);
                    });


                }

            }



            if (data.action === "ACTUALIZAR_TURNO") {
                console.log("🔍 Datos recibidos para ACTUALIZAR_TURNO:", data);

                turnoActual = data.turno;

                //let turnoEnAtencion = turnos.find(turno => turno.id_est_turn == 2);

                /// para que cuando comienze la vista de gestion de turnos no aya error por id
                if (data.turno_id === turnoActual.id_turn) {
                    document.getElementById("turno_actual").innerText = turnoActual.turn_code + " - " + data.estado;
                    console.log("mostrar datos");


                    $("#turno_ventanilla").text(turnoActual.venta_nom);
                    actualizarInterfaz(turnoActual);

                    removerTurno(turnoActual.id_turn);

                }


            };


            if (data.action === "SIN_TURNOS") {
                Swal.fire({
                    title: "Aviso",
                    icon: "info",
                    html: "<b>No hay turnos por atender</b>",
                    confirmButtonText: "Aceptar",
                });


            };


            if (data.action === "FINALIZAR_TURNO" && turnoActual && data.turno_id === turnoActual.id_turn) {
                console.log("Turno finalizado:", data.turno_id);
                turnoActual = null;  // Aquí recién limpiamos turnoActual
                $("#turno_codigo, #turno_ventanilla, #turno_tramite, #turno_espera, #turno_estado, #turno_actual").text("-");
                $("#btnLlamarTurno, #btnFinalizarTurno").prop("disabled", true);
            }

            /// para actulizar la pantalla del recepcionista

            // if ( data.action === "FINALIZAR_TURNO" && data.turno_id === turnoActual.id_turn) {
            //     console.log("Turno finalizado:", data.turno_id);
            //     finalizarTurno();
            // }

        };

        function removerTurno(turnoId) {
            const turno = document.getElementById(`turno-${turnoId}`);
            if (turno) {
                turno.remove();
            }
        }

        function actualizarInterfaz(turno) {
            if (turno) {
                $("#turno_codigo").text(turno.turn_code);
                $("#turno_ventanilla").text(turno.venta_nom);
                $("#turno_tramite").text(turno.tra_descrip);
                $("#turno_espera").text(turno.turnos_espera);
                $("#turno_estado").text(turno.esta_turn_nom);
                $("#turno_actual").text(turno.id_turn);
                $("#btnLlamarTurno, #btnFinalizarTurno").prop("disabled", false);
            } else {
                $("#turno_codigo, #turno_ventanilla, #turno_tramite, #turno_espera, #turno_estado, #turno_actual").text("-");
                $("#btnLlamarTurno, #btnFinalizarTurno").prop("disabled", true);
            }
        }

    </script>

    <script>
        $(document).ready(function () {
            let expanded = false;
            $(".toggle-btn").click(function () {
                $(".sidebar-container").css("right", expanded ? "-300px" : "0");
                $(".toggle-btn").css("right", expanded ? "10px" : "310px").text(expanded ? "Turnos" : "Cerrar");
                expanded = !expanded;
            });
        });
    </script>


</body>

</html>