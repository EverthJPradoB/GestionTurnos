$(document).ready(function () {


    // console.log(1);

    // combo_tramite();

    /* Listado de datatable */
    $('#ventanilla_data').DataTable({
        "aProcessing": true,
        "aServerSide": true,
        dom: 'Bfrtip',
        buttons: [
            'copyHtml5',
            'excelHtml5',
            'csvHtml5',
        ],
        "ajax": {
            url: "/ventanilla/listar_ventanilla_activas",
            type: "post",
            dataSrc: function (json) {
                console.log(json);


                return json.data ?? []; // Asegurar que siempre sea un array
            }


        },
        "bDestroy": true,
        "responsive": true,
        "bInfo": true,
        "iDisplayLength": 10,
        "order": [[0, "asc"]],
        "columns": [
            { "data": "venta_nom" },
            { "data": "venta_descrip" },
            { "data": "tra_nom" },
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
    combo_tramite();

    $('#venta_nom').val('');
    $('#venta_descrip').val('');
    $('#lbltitulo').html('Nueva ventanilla');
    $('#venta_form')[0].reset();
    $('#modalmantenimiento').modal('show');

}


function editar(id_venta) {
    $.post("/ventanilla/ventanilla_x_id",
        { id_venta: id_venta },
        function (data) {

            console.log(data);




            $('#id_venta').val(data.id_venta);
            $('#venta_nom').val(data.venta_nom);

            $('#venta_descrip').val(data.venta_descrip);

            $('#lbltitulo').html('Editar Registro');
            $('#modalmantenimiento').modal('show');
            combo_tramite(id_venta)
        });

}


function init() {
    $("#venta_form").on("submit", function (e) {
        guardaryeditar(e);
    });
}


function guardaryeditar(e) {
    e.preventDefault();
    var formData = new FormData($("#venta_form")[0]);



    // Recorre y muestra los valores en la consola
    formData.forEach((value, key) => {
        console.log(key + ": " + value);
    });

    $.ajax({
        url: "/ventanilla/registrarVentanillas",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            let data = response;  // Convertimos la respuesta a JSON

            if (data.success === true) {

                $('#ventanilla_data').DataTable().ajax.reload();
                $('#modalmantenimiento').modal('hide');


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
        error: function () {
            Swal.fire({
                title: "Error",
                text: "Ocurrió un problema en la conexión con el servidor.",
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }
    });

}



function eliminar(id_venta) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción desactivará el trámite",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            $.post("/ventanilla/eliminarVentanilla",
                { id_venta: id_venta },
                function (data) {

                    if (data.success === true) {

                        $('#ventanilla_data').DataTable().ajax.reload();

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

function combo_tramite(id_venta) {
    $.post("/ventanilla/combo_tramites", { id_venta: id_venta }, function (data) {
        $('#id_tra').html(data);
    });
}


init();