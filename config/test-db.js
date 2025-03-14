

const { query } = require('./conexion');

async function testConnection() {
    try {
        const result = await query('SELECT * from tm_rol');
        console.log('✅ Conexión exitosa. Resultado:', result);
    } catch (error) {
        console.error('❌ Error en la conexión a MySQL:', error);
    }
}

testConnection();


// const mysql = require('mysql2');

// const connection = mysql.createConnection({
//     host: '34.173.175.205',
//     user: 'ejprab',
//     password: '123',
//     database: 'bd_gestion_turnos'
// });

// connection.connect(err => {
//     if (err) {
//         console.error('❌ Error en la conexión a MySQL:', err);
//         return;
//     }
//     console.log('✅ Conexión exitosa a MySQL');

//     connection.query('SELECT * from tm_rol', (err, results) => {
//         if (err) {
//             console.error('❌ Error en la consulta:', err);
//         } else {
//             console.log('✅ Consulta ejecutada correctamente:', results);
//         }
//         connection.end();
//     });
// });
