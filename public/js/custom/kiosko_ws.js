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

    const ip = "localhost";
    ws = new WebSocket(`ws://${ip}:3000`);

    ws.onopen = () => {
        console.log("✅ Conectado al WebSocket");
        ws.send(JSON.stringify({ action: "REGISTRAR", tipo: "kiosko" })); // Registro inicial
        ws.send(JSON.stringify({ action: "LISTAR_VENTANILLAS_KIOSKO", kiosko_view: true }));
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("📩 Mensaje recibido:", data);

        switch (data.action) {
            case "LISTAR_VENTANILLAS_KIOSKO":
                let response = data.kiosko_general;

                if (!Array.isArray(response)) {
                    console.error("Error: la respuesta no es un array válido.");
                    return;
                }

                let lista = $("#lista_tramites");
                lista.empty();

                $.each(response, function (index, ventanilla) {
                    lista.append(`
                        <div class="col-md-4 mb-3">
                            <div class="card tramite-card text-center p-3" style="background-color: #3ab6c0;color:white" 
                                data-id="${ventanilla.id_venta}">
                                <h4><i class="fas fa-money-bill-wave"></i> ${ventanilla.venta_nom}</h4>
                            </div>
                        </div>
                    `);
                });
                break;
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
}