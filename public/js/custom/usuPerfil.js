let ws = null;


$(document).ready(function () {
    perfil();
    conectarWebSocket();

  
});


function conectarWebSocket() {
    if (ws && ws.readyState !== WebSocket.CLOSED) {
        console.log("⚡ WebSocket ya está conectado.");
        init(); // Inicializar eventos si la conexión ya existe
        return;
    }

    fetch("/usuario/session_rol") // Llama al backend para obtener el id_venta
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Error:", data.error);
                return;
            }


            const ip = "localhost";
            ws = new WebSocket(`ws://${ip}:3000?id_per=${data.id_per}`);

            ws.onopen = () => {
                // console.log("✅ Conectado al WebSocket como Admin");
                // Enviar solicitud para obtener usuarios conectados

                if (data.id_rol != 4) {
                    ws.send(JSON.stringify({ action: "REGISTRAR", id_per: data.id_per }));
                }

                init();
            };

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);

                if (message.action === "EXPULSADO" && data.id_rol != 3 && data.id_rol != 4) {
                    alert("Serás redirigido al inicio.");
                    window.location.href = "/";
                }
            };

            ws.onerror = (error) => {
                console.error("⚠️ Error en WebSocket:", error);
            };

            ws.onclose = () => {
                console.log("❌ WebSocket cerrado");
                ws = null;
                setTimeout(() => {
                    console.log("🔄 Intentando reconectar...");
                    conectarWebSocket();
                }, 2000);
            };


        })
        .catch(error => console.error("Error obteniendo sesión:", error));

}




function init() {
    $("#datos_perfil").on("submit", function (e) {
        guardaryeditar(e);
    });
}


function guardaryeditar(e) {
    e.preventDefault();
    var formData = new FormData($("#datos_perfil")[0]);

    $.ajax({
        url: "/usuario/actualizar_perfil",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            let data = response;  // Convertimos la respuesta a JSON

            if (data.success === true) {

                perfil();

                Swal.fire({
                    title: "Correcto!",
                    text: data.message,
                    icon: "success",
                    confirmButtonText: "Aceptar"
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: data.message,
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
            }
        },
        error: function (response) {
            let data = response.responseJSON;


            Swal.fire({
                title: "Error",
                text: data.message,
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }
    });
}


function perfil() {

    $.post("/usuario/perfil", function (data) {

        $('#datos_perfil').html(data);
    });
}