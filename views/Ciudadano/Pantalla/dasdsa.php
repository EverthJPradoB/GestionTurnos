





<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Turnos</title>
    <!-- Enlace a Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
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

        .turno {
            font-size: 24px;
            margin: 10px;
            padding: 10px;
            border: 1px solid #000;
            width: 200px;
            text-align: center;
        }

        .llamado {
            background-color: red;
            color: white;
        }
    </style>
</head>

<body class="">
    <!-- /* py-5*/  -->
    <div class="container">
        <!-- <h1 class="display-4 text-center mb-5">Sistema de Turnos</h1> -->

        <!-- Fila para las 2 ventanillas de arriba -->
        <div class="row-ventanillas">
            <div class="col-md-2 mb-4">
                <div class="ventanilla text-center">
                    <h3>Ventanilla 1</h3>
                    <div class="turno-actual">Turno: <div id="v1" style="display: inline-block; min-width: 100px; text-align: center;"></div>
                    </div>
                    <!-- <div class="siguiente-turno">Siguiente: 46</div> -->
                    <ul class="list-group mt-3" id="v1_siguiente">
                        <li class="list-group-item turno-pendiente d-flex justify-content-center align-items-center"
                            style="gap: 10px; min-height: 40px;">
                            <span>Turno:</span>
                            <span class="mx-1" id="turno_v1_siguiente_1"
                                style="min-width: 70px; text-align: center; display: inline-block; font-weight: bold;">
                                -
                            </span>
                        </li>

                        <li class="list-group-item turno-pendiente d-flex justify-content-center align-items-center"
                            style="gap: 10px; min-height: 40px;">
                            <span>Turno:</span>
                            <span class="mx-1" id="turno_v1_siguiente_2"
                                style="min-width: 70px; text-align: center; display: inline-block; font-weight: bold;">
                                -
                            </span>
                        </li>

                        <li class="list-group-item turno-pendiente d-flex justify-content-center align-items-center"
                            style="gap: 10px; min-height: 40px;">
                            <span>Turno:</span>
                            <span class="mx-1" id="turno_v1_siguiente_3"
                                style="min-width: 70px; text-align: center; display: inline-block; font-weight: bold;">
                                -
                            </span>
                        </li>

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

            <!-- Espacio para el logo ocupa el espacio restante -->
            <div class="col-md-4-logo mb-4">
                <div class="espacio-logo">
                    <img width="100%" height="100%" src="../../../assets/images/logo.png" alt="">
                    <!-- <p class="m-0 text-center text-muted">Logo</p> -->
                </div>
            </div>
        </div>

        <!-- Fila para las 4 ventanillas de abajo -->
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
        </div>
    </div>

    <h1>Pantalla de Turnos</h1>
    <div id="turnos"></div>
    <!-- Scripts de Bootstrap -->

    <?php
    require_once("../../html/MainJs.php");
    ?>

    <script src="pantalla.js"></script>



    <!-- 
  <script>
    const ws = new WebSocket("ws://34.58.169.105:2347");
    ws.onopen = () => {
      console.log("Conectado al WebSocket");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log(data);




      if (data.action === "LISTA_TURNOS") {



        mostrarTurnos(data.turnos);

        if (data.validarActualBandera === true) {
          //// DATOS DEBEN PROVENIR DE LA BASE DE DATOS
          console.log(1);

          actualizarEstadoTurno(data.turno_id, "EN ATENCION 2");
        }

      } else if (data.action === "ACTUALIZAR_TURNO") {

        if (data.validarActualBandera === true) {
          //// DATOS DEBEN PROVENIR DE LA BASE DE DATOS
          console.log(1);

          actualizarEstadoTurno(data.turno_id, "EN ATENCION 3");
        }



      } else if (data.action === "LLAMAR_TURNO") {
        resaltarTurno(data.turno_id);
      } else if (data.action === "FINALIZAR_TURNO") {
        removerTurno(data.turno_id);
      }
    };

    function mostrarTurnos(turnos) {
      const contenedor = document.getElementById("turnos");
      contenedor.innerHTML = "";
      turnos.forEach(turno => {
        const div = document.createElement("div");
        div.id = `turno-${turno.id_turn}`;
        div.classList.add("turno");
        div.innerText = `Turno: ${turno.turn_code}`;
        contenedor.appendChild(div);
      });
    }

    function actualizarEstadoTurno(turnoId, estado) {
      const turno = document.getElementById(`turno-${turnoId}`);
      if (turno) {
        turno.innerText += ` - ${estado}`;
      }
    }

    function resaltarTurno(turnoId) {
      const turno = document.getElementById(`turno-${turnoId}`);
      if (turno) {
        turno.classList.add("llamado");
      }
    }

    function removerTurno(turnoId) {
      const turno = document.getElementById(`turno-${turnoId}`);
      if (turno) {
        turno.remove();
      }
    }



  </script> -->

</body>

</html>


