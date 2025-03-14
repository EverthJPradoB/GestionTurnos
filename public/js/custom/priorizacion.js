
$(document).ready(function () {

    radio_prioridades();

    function radio_prioridades() {

        $.post("/usuario/radio_priorizaciones", function (data) {

            $('#id_pri').html(data);


            $('input[name="priori"]').change(function () {
                const motivoOtro = document.getElementById('motivo-otro'); // El textarea de "Otro"
                
                if ($(this).val() == '4') {
                    motivoOtro.style.display = 'block'; // Muestra el textarea cuando se selecciona "Otro"
                } else {
                    motivoOtro.style.display = 'none'; // Oculta el textarea cuando se selecciona cualquier otra opción
                }
            });

        });
    }



}); // Fin de la función ready