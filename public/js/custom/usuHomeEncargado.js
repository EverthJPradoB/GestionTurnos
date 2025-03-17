let socket;

function conectarWebSocket() {
    if (socket && socket.readyState !== WebSocket.CLOSED) {
        console.log("⚡ WebSocket ya está conectado.");
        return;
    }

    fetch("/usuario/session_rol") // Obtiene id_per desde el backend
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Error:", data.error);
                return;
            }

            const ip = "localhost";
            socket = new WebSocket(`ws://${ip}:3000?id_per=${data.id_per}`);

            socket.onopen = () => {
                // console.log("✅ WebSocket conectado");
                socket.send(JSON.stringify({ action: "REGISTRAR", id_per: data.id_per }));
                socket.send(JSON.stringify({ action: "DATOS_ESTADISTICOS_CARDS", id_rol: data.id_rol }));
            };

            socket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log("📩 Mensaje recibido:", message);

                if (message.action === "DATOS_ESTADISTICOS_CARDS") {
                    $("#finalizados").text(message.datos_estadisticos.finalizados);
                    $("#cancelados").text(message.datos_estadisticos.cancelados);
                    $("#ausentes").text(message.datos_estadisticos.ausentes);
                }

                if (message.action === "DATOS_ESTADISTICOS_ACTUALIZAR") {
                    let can = 0;
                    if (message.finalizado) {
                        can = $("#finalizados").text();
                        $("#finalizados").text(Number(can) + Number(message.finalizado));
                    } else if (message.cancelado) {
                        can = $("#cancelados").text();
                        $("#cancelados").text(Number(can) + Number(message.cancelado));
                    } else if (message.ausente) {
                        can = $("#ausentes").text();
                        $("#ausentes").text(Number(can) + Number(message.ausente));
                    }
                }
            };

            socket.onclose = () => {
                console.log("❌ WebSocket cerrado");
            };
        })
        .catch(error => console.error("Error obteniendo sesión:", error));
}

// 📌 Ejecuta la conexión WebSocket en cada vista
document.addEventListener("DOMContentLoaded", conectarWebSocket);
