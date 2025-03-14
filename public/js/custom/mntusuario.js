

$(document).ready(function () {


    combo_rol();
    combo_ventanilla();
    // combo_tramite()

    /* Listado de datatable */
    $('#usuario_data').DataTable({
        "aProcessing": true,
        "aServerSide": true,
        dom: 'Bfrtip',
        buttons: [
            'copyHtml5',
            'excelHtml5',
            'csvHtml5',
        ],
        "ajax": {
            url: "/usuario/listarPersonas",
            type: "post", 
            dataSrc: function (json) {
          
                return json.data ?? []; // Asegurar que siempre sea un array
            }

        },
        "bDestroy": true,
        "responsive": true,
        "bInfo": true,
        "iDisplayLength": 10,
        "order": [[0, "desc"]],
        "columns": [
            { "data": "per_nom" },
            { "data": "per_ape_pa" },
            { "data": "per_ape_ma" },
            { "data": "per_telef" },
            { "data": "rol_nom" },
            { "data": "venta_nom" },
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


      validador_rol();


});


function init() {
    $("#per_form").on("submit", function (e) {
        guardaryeditar(e);
    });
}


function guardaryeditar(e) {
    e.preventDefault();
    var formData = new FormData($("#per_form")[0]);
    for (var pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }
    // Aquí, enviamos formData directamente
    $.ajax({
        url: "/usuario/registrarPersonas",
        type: "POST",
        data: formData, // Enviar formData directamente
        contentType: false, // No establecer el contentType
        processData: false, // No procesar los datos
        success: function (response) {
            let data = response;

            console.log(data);
            
            if (data.success === true) {
                console.log(1);
                $('#usuario_data').DataTable().ajax.reload();
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


function nuevo() {
    $('#id_rol').prop('disabled', false);
    $('#tra_nom').val('');
    // $('#tra_descrip').val('');
    $('#id_venta').val('');
    $('#lbltitulo').html('Nuevo Usuario');
    $('#per_form')[0].reset();
    $('#modalmantenimiento').modal('show');
    combo_rol();
    combo_ventanilla();
    // combo_tramite() 
}

function combo_rol(id_rol) {
    console.log("ID Rol enviado:", id_rol); // Verifica que el dato sea correcto

    $.post("/usuario/combo_roles", { id_rol: id_rol }, function (data) {

        $('#id_rol').html(data);
    });
}

function combo_ventanilla(id_per) {
    $.post("/usuario/combo_ventanillas",
        { id_per: id_per },
        function (data) {
            $('#id_venta').html(data);

        });
}


function editar(id_per) {


    $('#id_rol').prop('disabled', true);
    $.post("/usuario/persona_x_id",
        { id_per: id_per },
        function (data) {

            console.log(data);
            
            // data = JSON.parse(data);

            $('#id_per').val(data.id_per);
            $('#per_nom').val(data.per_nom);
            $('#per_ape_pa').val(data.per_ape_pa);
            $('#per_ape_ma').val(data.per_ape_ma);
            $('#per_correo').val(data.per_correo);
            $('#per_telef').val(data.per_telef);
            $('#id_per').val(data.id_per);


            console.log(data.id_rol);
            
            combo_rol(data.id_rol)
            $('#id_rol').prop('disabled', true);
            $('#lbltitulo').html('Editar Registro');
            $('#modalmantenimiento').modal('show');
            combo_ventanilla(id_per);
        });
        // $('#lbltitulo').html('Editar Registro');
        // $('#modalmantenimiento').modal('show');
        // combo_ventanilla(id_per);
   

}

function eliminar(id_per) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción desactivará el usuario",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            $.post("/usuario/eliminarPersona",
                { id_per: id_per },
                function (data) {
                
                    if (data.success === true) {

                        $('#usuario_data').DataTable().ajax.reload();

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


function validador_rol() {

    $("#id_rol").change(function () {
        var selectedRol = $(this).val();  // Obtener el valor seleccionado

        if (selectedRol == "3") {  // Si el rol es "Jefe de Área"
            $("#id_venta").prop("disabled", true); // Deshabilitar el combo de Ventanilla
            $("#id_venta").val("");  // Opcional: Limpiar la selección
        } else {
            $("#id_venta").prop("disabled", false); // Habilitar el combo si elige otro rol
        }
    });
}


init();