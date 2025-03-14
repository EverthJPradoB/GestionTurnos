$(document).ready(function () {

    perfil();



});


init(); // Inicializar variables

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