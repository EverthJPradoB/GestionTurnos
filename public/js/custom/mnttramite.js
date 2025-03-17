$(document).ready(function () {

    /* Listado de datatable */
    $('#tramite_data').DataTable({
        "aProcessing": true,
        "aServerSide": true,
        dom: 'Bfrtip',
        buttons: [
            'copyHtml5',
            'excelHtml5',
            'csvHtml5',
        ],
        "ajax": {
            url: "/tramite/listar_tramites_activos_x_id_mantenedor",
            type: "post",
            dataSrc: function (json) {

                return json.data ?? []; // Asegurar que siempre sea un array
            }

        },
        "bDestroy": true,
        "responsive": true,
        "bInfo": true,
        "iDisplayLength": 10,
        "order": [[0, "asc"]],
        "columns": [
            { "data": "tra_nom" },
            { "data": "tra_descrip" },
            { "data": "tra_tiem_esti" },
            { "data": "editar" },
            { "data": "eliminar" }

        ],
        "language": {
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        },
    });

});


function nuevo() {
    $('#tra_nom').val('');
    $('#tra_descrip').val('');
    $('#lbltitulo').html('Nuevo Tramite');
    $('#tra_form')[0].reset();
    $('#modalmantenimiento').modal('show');
}



function editar(id_tra) {


    $.post("/tramite/tramite_x_id",
        { id_tra: id_tra },
        function (data) {


            $('#id_tra').val(data.id_tra);
            $('#tra_nom').val(data.tra_nom);
            $('#tra_descrip').val(data.tra_descrip);
            $('#tra_tiem_esti').val(data.tra_tiem_esti);

            // Restablecer los estilos de validación de Bootstrap y Parsley
            let form = $('#tra_form');
            form.find('.form-control').removeClass('is-valid is-invalid'); // Quita bordes de validación
            form.find('.parsley-errors-list').remove(); // Elimina mensajes de error de Parsley
            form.parsley().reset(); // Reinicia Parsley

            $('#lbltitulo').html('Editar Registro');
            $('#modalmantenimiento').modal('show');

        });

}

function init() {
    $("#tra_form").on("submit", function (e) {
        guardaryeditar(e);


     


    });
}


function guardaryeditar(e) {
    e.preventDefault();
    var formData = new FormData($("#tra_form")[0]);

    $.ajax({
        url: "/tramite/registrarTramite",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            let data = response;  // Convertimos la respuesta a JSON

            if (data.success === true) {

                $('#tramite_data').DataTable().ajax.reload();
                $('#modalmantenimiento').modal('hide');


                let form = $('#tra_form');
                form.find('.form-control').removeClass('is-valid is-invalid'); // Quita bordes de validación
                form.find('.parsley-errors-list').remove(); // Elimina mensajes de error de Parsley
                form.parsley().reset(); // Reinicia Parsley

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

function eliminar(id_tra) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción desactivará el trámite",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            $.post("/tramite/eliminar_x_id",
                { id_tra: id_tra },
                function (data) {

                    if (data.success === true) {

                        $('#tramite_data').DataTable().ajax.reload();


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

                }
            );
        }
    });
}


init();