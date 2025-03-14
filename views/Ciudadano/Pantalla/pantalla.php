<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pantalla de Turnos</title>
  <style>
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

<body>
  <h1>Pantalla de Turnos</h1>
  <div id="turnos"></div>

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



  </script>
</body>

</html>