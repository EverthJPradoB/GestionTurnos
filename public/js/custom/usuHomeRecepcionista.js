let socket = null;

function conectarWebSocket() {
    if (socket && socket.readyState !== WebSocket.CLOSED) {
        console.log("⚡ WebSocket ya está conectado.");
        return;
    }

    fetch("/usuario/session_venta") // Obtiene id_per desde el backend
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Error:", data.error);
                alert("No tienes una ventanilla asignada. Serás redirigido al inicio.");
                window.location.href = "/";
                return;
            }

            const ip = "localhost";
            socket = new WebSocket(`ws://${ip}:3000?id_per=${data.id_per}`);

            socket.onopen = () => {
                // console.log("✅ WebSocket conectado");
                socket.send(JSON.stringify({ action: "REGISTRAR", id_per: data.id_per }));

                socket.send(JSON.stringify({
                    action: "DATOS_ESTADISTICOS_CARDS",
                    id_venta: data.id_venta,
                    id_rol: data.id_rol
                }));
            };

            socket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log("📩 Mensaje recibido:", message);

                if (message.action === "DATOS_ESTADISTICOS_CARDS") {
                    $("#finalizados").text(message.datos_estadisticos.finalizados || 0);
                    $("#cancelados").text(message.datos_estadisticos.cancelados || 0);
                    $("#ausentes").text(message.datos_estadisticos.ausentes || 0);
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

                if (message.action === "EXPULSADO") {

                    console.log(message);
                    

                    alert("Serás redirigido al inicio.");
                    window.location.href = "/";
                }
            };

            socket.onerror = (error) => {
                console.error("⚠️ Error en WebSocket:", error);
            };

            socket.onclose = () => {
                console.log("❌ WebSocket cerrado");
                socket = null; // Limpia la referencia al socket cerrado
                setTimeout(() => {
                    console.log("🔄 Intentando reconectar...");
                    conectarWebSocket(); // Intenta reconectar después de 2 segundos
                }, 2000);
            };

        })
        .catch(error => console.error("Error obteniendo sesión:", error));
}

// 📌 Ejecuta la conexión WebSocket en cada vista
document.addEventListener("DOMContentLoaded", conectarWebSocket);
