$(document).ready(function () {

    let tipoTramiteSeleccionado = ""; // Inicialmente vacío

    $(document).on("click", ".tramite-card", function () {
        $(".tramite-card").removeClass("selected"); // Quitar selección previa
        $(this).addClass("selected"); // Marcar como seleccionado

        tipoTramiteSeleccionado = $(this).data("id"); // Obtener el ID del trámite

        $("#generar_ticket_btn").fadeIn(); // Mostrar el botón
    });


    $("#generar_ticket_btn").click(function () {
        if (tipoTramiteSeleccionado === "") return;


        $("#loading").show();
        $(".tramite-card").removeClass("selected");
        $("#generar_ticket_btn").fadeOut();

    
        $.ajax({
            url: "/kiosko/insert_turno",
            type: "POST",
            data: { id_venta: tipoTramiteSeleccionado },
            success: function (response) {
                let data = response;  // Convertimos la respuesta a JSON-
                let resultado = data.resultado;

                
                $("#loading").hide();
                //  var data = JSON.parse(response);

                if (data.success === true) {


                    var contenidoTicket = `
                    <div style="text-align: center; font-family: Arial, sans-serif;">

                        <img src="../../images/logo.png" style="height: auto;width: 100px;"  class="logo" alt="Logo Municipalidad">
                        <h2>MUNICIPALIDAD DE LA VICTORIA - CHICLAYO</h2>
                        <p><strong>Ticket:</strong> <span id="ticket_codigo"> ${resultado.turn_code}</span></p>
                        <p><strong>Trámite:</strong> ${resultado.tra_descrip}</p>
                         <p><strong>Turnos en espera:</strong> ${resultado.turnos_espera}</p>
                        <p><strong>Fecha y Hora:</strong> ${resultado.turn_fecha_crea}</p>
                        <p>Gracias por su visita</p>
                    </div>
                `;

                    var ventanaImpresion = window.open("", "", "width=300,height=400");
                    ventanaImpresion.document.write(contenidoTicket);
                    ventanaImpresion.document.close();
                    ventanaImpresion.print();



                } else {
                    $("#mensaje_resultado").html('<div class="alert alert-danger">Error al generar el ticket. Inténtelo de nuevo.</div>');
                }

            },
            error: function () {
                $("#loading").hide();
                $("#mensaje_resultado").html('<div class="alert alert-danger">Error en la conexión con el servidor.</div>');
                $("#generar_ticket_btn").fadeIn();
            }
        });
    });

    $("#imprimir_ticket_btn").click(function () {

    });


});


