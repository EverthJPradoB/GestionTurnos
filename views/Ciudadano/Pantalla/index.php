<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Turnos</title>
    <!-- Enlace a Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        .contenedor-ventanillas {
            display: grid;
            grid-template-columns: repeat(3, minmax(550px, 1fr));
            gap: 15px;
            /* Espaciado entre ventanillas */
            justify-content: center;
            align-items: start;
            /* */
            grid-template-rows: 400px 400px;
            /* Primera fila de 200px, segunda automática */
        }

        .ventanilla {
            height: 100%;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
            min-width: 250px;
            /* Tamaño mínimo */
            /* max-width: 400px; */
            /* Tamaño máximo */
            word-wrap: break-word;
            /* Evita desbordamiento de texto */

        }

        .sub_ventanilla {
            height: 100%;
        }

        .llamado {
            background-color: red;
            color: white;
        }

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

        .siguiente {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            /* Espacia los elementos */
            height: 100%;
            /* Ocupa todo el espacio disponible */
        }

        .siguiente .list-group-item {
            flex-grow: 1;
            /* Hace que cada <li> crezca proporcionalmente */
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 50px;
            /* Ajusta la altura mínima */
        }

        .tamaño_turno_actual {
            font-size: 4rem;
            font-weight: bold;
        }
    </style>
</head>

<body class="">
    <!-- /* py-5*/  -->
    <div class="" style="height: 100vh;width: 100vw;background-color: aquamarine;">
        <!-- <h1 class="display-4 text-center mb-5">Sistema de Turnos</h1> -->

        <div class="p-2">
            <div class="contenedor-ventanillas" id="contenedor-ventanillas">
                <!-- Ventanilla 1 -->
              



            </div>
        </div>



    </div>

    <!-- Fila para las 4 ventanillas de abajo -->
    <!-- <div class="row-ventanillas-bottom">
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