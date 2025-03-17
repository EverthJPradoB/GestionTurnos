


const ip = "localhost";
const ws = new WebSocket(`ws://${ip}:3000`);


ws.onopen = () => {
    console.log("Conectado al WebSocket");

    /// ws.send(JSON.stringify({ action: "LISTA_TURNOS", id_venta: 44 }));
    ws.send(JSON.stringify({ action: "REGISTRAR", tipo: "pantalla_ciudadano" })); 
    ws.send(JSON.stringify({ action: "LISTAR_PANTALLA_GENERAL", pantalla_view: true }));
    
};

ws.onmessage = (event) => {

    const data = JSON.parse(event.data);



    switch (data.action) {

        case "LISTAR_PANTALLA_GENERAL":

            let turnos_generales = data.pantalla_general;

            // Obtener los id_venta únicos
            // Obtener los id_venta únicos
            let ventasUnicas = turnos_generales.reduce((acc, turno) => {
                // Verificamos si ya existe un objeto con ese id_venta en el acumulador
                if (!acc.some(item => item.id_venta === turno.id_venta)) {
                    acc.push({ id_venta: turno.id_venta, venta_nom: turno.venta_nom });
                }
                return acc;
            }, []);

            $("#contenedor-ventanillas").empty(); // Vaciar el contenedor una sola vez

            ventasUnicas.forEach(venta => {
                crearVentanillasGeneral(venta, turnos_generales);
            });


            break;

        case "LISTA_TURNOS_PANTALLA_CIUDADANO":

            let turnos = data.turnos_ventanilla_pantalla;

            let id_venta = data.id_venta;

            crearVentanilla_x_id_venta(turnos, id_venta)

            // case "ACTUALIZAR_TURNO":
            //     actualizarEstadoTurno(data.turno);

            break;

        case "LIMPIAR_EN_ATENCION":

        
            removerTurno(data.turno_id)
          
        case "LLAMAR_TURNO":
   

            resaltarTurno(data.turno_id);

            break;
        case "FINALIZAR_TURNO":
            removerTurno(data.turno_id);
            break;
    }
};


function crearVentanillasGeneral(venta, turnos) {


    idVentanilla = venta.id_venta;
    nomnbre = venta.venta_nom;
    // Crea el HTML de la ventanilla usando las clases de Bootstrap
    let turnos_en_espera = [];

    let html = `
        <div class="ventanilla" id="ventanilla_${idVentanilla}">
            <div class="card text-center shadow sub_ventanilla tamaño_turno_actual">
                <h3 class="card-title"> ${nomnbre}</h3> `;
    html += `<div class="turno-actual">
                <span class=" fs-5" style="text-align: center; display: inline-block; font-weight: bold;">
                    <span id="v_actual_${idVentanilla}" class="tamaño_turno_actual">`;
    i = 1;
    turnos.forEach(t => {
        if (t.id_venta === idVentanilla) { // Filtramos solo los turnos del idVentaActual
            if (t.id_est_turn == 2) {
        

                // Si el turno está en atención, lo mostramos en el contenedor principal
                html += `      <div id="turno-v-${t.id_turn}">
                <span style="color: blue;">${t.turn_code}</span>
            </div>`;


            } else {
                i++;
                // Si no está en atención, lo agregamos a la lista de espera
                turnos_en_espera.push(t);
            }
        }
    });
    html += `      </span>
        </span>
    </div> `;
    // Limitar la lista de turnos en espera a los primeros 3
    turnos_en_espera = turnos_en_espera.slice(0, 2);
    // Seleccionamos el contenedor principal de la ventanilla (se asume que están numerados: #v_actual_1, #v_actual_2, …)

    // Limpiar el DOM del contenedor antes de agregar los turnos

    html += `   <ul class="list-group mt-3 siguiente" id="v_${idVentanilla}_siguiente">`;

    j = 1;
    turnos_en_espera.forEach(t => {
        // let v2 = $(`#turno_siguiente_${idVentanilla}_${j}`);

        if (t.id_venta === idVentanilla) {

            // v2.append(1)
            html += `
            <li class="list-group-item turno-pendiente d-flex justify-content-center align-items-center"
            style="gap: 10px; min-height: 40px;">
            <span class="mx-1" id="turno_siguiente_${idVentanilla}_${j}"
                style="min-width: 70px; text-align: center; display: inline-block; font-weight: bold;">`;
            if (t.id_turn != null) {

                html += `      <div id="turno-v-${t.id_turn}">
                    <span>${t.turn_code}</span>
                </div>`;
            } else {
                html += `      <h2>    </h2>`;
            }

            html += `            </span>
            </li>
                        `;
        }
        j++;

    })


    if (i == 1 || i == 2) {



        for (i; i <= 2; i++) {
            // $(#turno_siguiente_${idVenta}_${j}).empty();


            html += `
        <li class="turno-actual list-group-item turno-pendiente d-flex justify-content-center align-items-center"
        style="gap: 10px; min-height: 40px;">
        <span class="mx-1" id="turno_siguiente_${idVentanilla}_${i}"
            style="min-width: 70px; text-align: center; display: inline-block; font-weight: bold;">`;



            html += ``;



            html += `           
        </li>
                    `;
        }


    }

    html += `  </ul>`;

    html += `   </div>
        </div>
    `;

    // Se asume que existe un contenedor padre en el HTML para las ventanillas, por ejemplo:
    // <div id="contenedor-ventanillas"></div>
    // $("#contenedor-ventanillas").empty();
    $("#contenedor-ventanillas").append(html);
}


// function crearVentanilla_x_id_venta(turnos, idVenta) {
//     // let v1 = $(`#v_actual_${i}`);



//     let v1 = $(`#v_actual_${idVenta}`).empty();;


//     // if (v1.length === 0) {
//     //     console.warn(`No se encontró el elemento #v_actual_${idVenta}`);
//     //     return;
//     // }


//     // Array para almacenar los turnos en espera
//     let turnos_en_espera = [];

//     // Recorrer los turnos filtrados
//     turnos.forEach(t => {
//         if (t.id_est_turn == 2) {
//             console.log();

//             // Si el turno está en atención, se muestra en el contenedor principal
//             v1.append(`
//                 <div id="turno-${t.id_turn}">
//                     <span style="color: blue;">${t.turn_code}</span>
//                 </div>
//             `);
//         } else {
//             // Si no está en atención, se agrega a la lista de espera
//             turnos_en_espera.push(t);
//         }
//     });

//     turnos_en_espera = turnos_en_espera.slice(0, 3);

//     for (let j = 1; j <= 3; j++) {
//         $(`#turno_siguiente_${idVenta}_${j}`).empty();
//     }

//     // Insertar los turnos en espera en sus contenedores correspondientes
//     for (let j = 0; j < turnos_en_espera.length; j++) {
//         let v2 = $(`#turno_siguiente_${idVenta}_${j + 1}`);
//         v2.append(`
//             <div id="turno-v-${turnos_en_espera[j].id_turn}">
//                 <span>${turnos_en_espera[j].turn_code}</span>
//             </div>
//         `);
//     }

// }

function crearVentanillas_nueva(idVentanilla) {




    // Crea el HTML de la ventanilla usando las clases de Bootstrap
    let turnos_en_espera = [];

    let html = `
        <div class="ventanilla" id="ventanilla_${idVentanilla}">
            <div class="card text-center shadow p-3 sub_ventanilla">
                <h3 class="card-title">Ventanilla ${idVentanilla}</h3> `;
    html += `<div class="turno-actual">
                <span class="badge bg-primary fs-5" style="text-align: center; display: inline-block; font-weight: bold;">
                    <span id="v_actual_${idVentanilla}" class="tamaño_turno_actual">`;



    html += `      </span>
        </span>
    </div> `;
    // Limitar la lista de turnos en espera a los primeros 3
    turnos_en_espera = turnos_en_espera.slice(0, 3);
    // Seleccionamos el contenedor principal de la ventanilla (se asume que están numerados: #v_actual_1, #v_actual_2, …)

    // Limpiar el DOM del contenedor antes de agregar los turnos

    html += `   <ul class="list-group mt-3 siguiente" id="v_${idVentanilla}_siguiente">`;



    for (let j = 1; j <= 3; j++) {

        // v2.append(1)
        html += `
             <li class="list-group-item turno-pendiente d-flex justify-content-center align-items-center"
             style="gap: 10px; min-height: 40px;">
             <span class="mx-1" id="turno_siguiente_${idVentanilla}_${j}"
                 style="min-width: 70px; text-align: center; display: inline-block; font-weight: bold;"> `;
        if (j = 1) {


            html += `      <h2>   </h2>`;
        }



        html += `            </span>
             </li>
                         `;
    }



    html += `  </ul>`;

    html += `   </div>
        </div>
    `;

    // Se asume que existe un contenedor padre en el HTML para las ventanillas, por ejemplo:
    // <div id="contenedor-ventanillas"></div>
    $("#contenedor-ventanillas").append(html);
}



function crearVentanilla_x_id_venta(turnos, idVenta) {
    // let v1 = $(`#v_actual_${i}`);



    let v1 = $(`#v_actual_${idVenta}`).empty();;


    // if (v1.length === 0) {
    //     console.warn(`No se encontró el elemento #v_actual_${idVenta}`);
    //     return;
    // }


    // Array para almacenar los turnos en espera
    let turnos_en_espera = [];

    // Recorrer los turnos filtrados
    turnos.forEach(t => {
        if (t.id_est_turn == 2) {
            // Si el turno está en atención, se muestra en el contenedor principal
            v1.append(`
                <div id="turno-v-${t.id_turn}">
                    <span style="color: blue;">${t.turn_code}</span>
                </div>
            `);
        } else {
            // Si no está en atención, se agrega a la lista de espera
            turnos_en_espera.push(t);
        }
    });

    turnos_en_espera = turnos_en_espera.slice(0, 3);

    for (let j = 1; j <= 3; j++) {
        $(`#turno_siguiente_${idVenta}_${j}`).empty();
    }

    // Insertar los turnos en espera en sus contenedores correspondientes
    for (let j = 0; j < turnos_en_espera.length; j++) {
        let v2 = $(`#turno_siguiente_${idVenta}_${j + 1}`);
        v2.append(`
            <div id="turno-v-${turnos_en_espera[j].id_turn}">
                <span>${turnos_en_espera[j].turn_code}</span>
            </div>
        `);
    }

}




function mostrarTurnos(turnos, turno_id_actual) {
    let v1 = $("#v1");
    let v1_siguiente = $("#v1_siguiente");

    // Limpiar el DOM antes de agregar los turnos actualizados
    v1.empty();
    // v1_siguiente.empty();

    let turnos_en_espera = [];

    turnos.forEach(t => {
        if (t.id_turn === turno_id_actual) {
            // Si hay un turno en atención, lo mostramos en la ventanilla
            v1.append(`
                <div id="turno-v1-${t.id_turn}">
                    <span>${t.turn_code}</span>
                </div>
            `);
        } else {
            // Si no está en atención, lo agregamos a la lista de espera
            turnos_en_espera.push(t);
        }
    });

    // Solo mostramos los primeros 3 turnos en espera
    turnos_en_espera = turnos_en_espera.slice(0, 3);

    let turno_v1_siguiente_1 = $("#turno_v1_siguiente_1");
    let turno_v1_siguiente_2 = $("#turno_v1_siguiente_2");
    let turno_v1_siguiente_3 = $("#turno_v1_siguiente_3");

    // Limpiar antes de agregar nuevos turnos (opcional)
    turno_v1_siguiente_1.empty();
    turno_v1_siguiente_2.empty();
    turno_v1_siguiente_3.empty();

    // Verificamos si hay turnos antes de intentar acceder a ellos
    if (turnos_en_espera.length > 0) {
        turno_v1_siguiente_1.append(`
        <div id="turno-v1-${turnos_en_espera[0].id_turn}">
            <span>${turnos_en_espera[0].turn_code}</span>
        </div>
    `);
    }
    if (turnos_en_espera.length > 1) {
        turno_v1_siguiente_2.append(`
        <div id="turno-v1-${turnos_en_espera[1].id_turn}">
            <span>${turnos_en_espera[1].turn_code}</span>
        </div>
    `);
    }
    if (turnos_en_espera.length > 2) {
        turno_v1_siguiente_3.append(`
        <div id="turno-v1-${turnos_en_espera[2].id_turn}">
            <span>${turnos_en_espera[2].turn_code}</span>
        </div>
    `);
    }

    // .forEach(t => {
    //     v1_siguiente.append(`
    //         <li id="turno-v1-siguiente-${t.id_turn}" class="list-group-item turno-pendiente">
    //             <span>Turno: ${t.turn_code}</span>
    //         </li>
    //     `);
    // });
}

function actualizarEstadoTurno(turno) {
    let id_turn = turno.id_turn;
    let turn_code = turno.turn_code;

    // Si hay un turno en atención, reemplázalo por el nuevo
    let v1 = $("#v1");
    v1.empty();
    v1.append(`
        <div id="turno-v1-${id_turn}">
            <span>${turn_code}</span>
        </div>
    `);

    // Remover el turno de la lista de espera sin llamar a mostrarTurnos()
    $(`#turno-v1-siguiente-${id_turn}`).remove();

    ws.send(JSON.stringify({ action: "LISTA_TURNOS" }));

}

function resaltarTurno(turnoId) {
    const turno = document.getElementById(`turno-v-${turnoId}`);


    if (turno) {
        turno.classList.add("llamado");


        // Remover la clase después de 3000 milisegundos (3 segundos)
        setTimeout(() => {
            turno.classList.remove("llamado");
        }, 3000);



    }
}


function removerTurno(turno_id) {
    $(`#turno-v-${turno_id}`).remove();
 
}
