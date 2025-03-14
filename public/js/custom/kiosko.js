$(document).ready(function () {


    // $.post("/kiosko/listar_ventanillas_activos_kiosko",

    //     function (data) {
    //         console.log(data);


    //     });



    $.ajax({
        url: "/kiosko/listar_ventanillas_activos_kiosko",
        type: "POST",
        // dataType: "json",
        success: function (response) {
            console.log(response); // Ver la respuesta en la consola

            if (!Array.isArray(response)) {
                console.error("Error: la respuesta no es un array válido.");
                return;
            }

            let lista = $("#lista_tramites");
            lista.empty();

            // const text_color = ["text-primary", "text-warning", "text-success", "text-info", "text-danger", "text-dark"];

            // const border_color = ["border-primary", "border-warning", "border-success", "border-info", "border-danger", "border-dark"];


            $.each(response, function (index, ventanilla) {

                console.log(ventanilla.nombre);

                // Para evitar errores de índice en colores, usamos el operador módulo (%)
                // const textClass = text_color[index % text_color.length];
                // const borderClass = border_color[index % border_color.length];

                lista.append(`
                    <div class="col-md-4 mb-3" >
                        <div class="card tramite-card text-center p-3" style="background-color: #3ab6c0;color:white" 
                            data-id="${ventanilla.id_venta}">
                            <h4><i class="fas fa-money-bill-wave"></i> ${ventanilla.venta_nom}</h4>
                        </div>
                    </div>
                `);
            });


        },
        error: function (xhr, status, error) {
            console.error("Error al obtener trámites:", error);
        }
    });

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

        console.log(tipoTramiteSeleccionado);



        $.ajax({
            url: "/kiosko/insert_turno",
            type: "POST",
            data: { id_venta: tipoTramiteSeleccionado },
            success: function (response) {
                let data = response;  // Convertimos la respuesta a JSON-
                let resultado = data.resultado;

                console.log(data);
                
                $("#loading").hide();
                //  var data = JSON.parse(response);


                //console.log(data);
                console.log(response);


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


