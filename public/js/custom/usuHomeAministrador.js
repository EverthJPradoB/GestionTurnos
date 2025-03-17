let ws = null; // Variable global para reutilizar la conexión

$(document).ready(function () {
    conectarWebSocket(); // Iniciar WebSocket al cargar la página
});

function conectarWebSocket() {
    // Reutilizar la conexión existente si ya está abierta
    if (ws && ws.readyState !== WebSocket.CLOSED) {
        console.log("⚡ WebSocket ya está conectado.");
        return;
    }

    fetch("/usuario/session_rol") // Llama al backend para obtener el id_rol
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Error:", data.error);
                return;
            }

            const ip = "localhost";
            ws = new WebSocket(`ws://${ip}:3000`); // Conexión sin id_per en la URL (puedes añadirlo si lo necesitas)

            ws.onopen = () => {
                console.log("✅ Conectado al WebSocket");
                // Enviar solicitud para obtener usuarios conectados
                ws.send(JSON.stringify({
                    action: "SOLICITAR_CONECTADOS",
                    id_rol: data.id_rol
                }));
            };

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log("📩 Mensaje recibido:", message);

                if (message.action === "USUARIOS_CONECTADOS") {
                    $("#personal").text(message.cantidad || 0);
                    $("#Kiosko").text(message.kiosko || 0);
                    $("#pantalla").text(message.pantalla || 0);
                }

                if (message.action === "USUARIO_DESCONECTADO") {
                    $("#personal").text(message.cantidad || 0);
                }

                if (message.action === "PERSONAL_DESCONECTADO") {
                    $("#personal").text(message.cantidad || 0);
                }

                if (message.action === "TODOS_DESCONECTADO") {
                    $("#personal").text(message.cantidad || 0);
                    $("#Kiosko").text(message.kiosko || 0);
                    $("#pantalla").text(message.pantalla || 0);
                }
            };

            ws.onerror = (error) => {
                console.error("⚠️ Error en WebSocket:", error);
            };

            ws.onclose = () => {
                console.log("❌ WebSocket cerrado");
                ws = null; // Limpiar la referencia
                setTimeout(() => {
                    console.log("🔄 Intentando reconectar...");
                    conectarWebSocket(); // Reconectar después de 2 segundos
                }, 2000);
            };
        })
        .catch(error => console.error("Error obteniendo sesión:", error));
}