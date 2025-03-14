$(document).ready(function () {


    console.log(1);
    
    combo_tramite();

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
            url: "../../controllers/ventanilla.php?op=listar_ventanilla_activos_mantenedor",
            type: "post",

        },
        "bDestroy": true,
        "responsive": true,
        "bInfo": true,
        "iDisplayLength": 10,
        "order": [[0, "asc"]],
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
    $.post("../../controllers/ventanilla.php?op=listar_ventanilla_activos_x_id_mantenedor",
        { id_venta: id_venta },
        function (data) {
            data = JSON.parse(data);

         

            $('#id_venta').val(data.id_venta);
            $('#venta_nom').val(data.venta_nom);

            $('#venta_descrip').val(data.venta_descrip);

        });
    $('#lbltitulo').html('Editar Registro');
    $('#modalmantenimiento').modal('show');
    combo_tramite(id_venta)
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
        url: "../../controllers/ventanilla.php?op=guardaryeditar",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            let data = JSON.parse(response);  // Convertimos la respuesta a JSON



            if (data.status === "success") {

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
            $.post("../../controllers/ventanilla.php?op=eliminar_ventanilla",
                { id_venta: id_venta },
                function (data) {
                    data = JSON.parse(data);

                    $('#ventanilla_data').DataTable().ajax.reload();
                    Swal.fire(data.status === "success" ? "Eliminado" : "Error", data.message, data.status);
                }
            );
        }
    });
}


function combo_tramite(id_venta) {
    $.post("../../controllers/ventanilla.php?op=combo", { id_venta: id_venta }, function (data) {
        $('#id_tra').html(data);
    });
}


init();