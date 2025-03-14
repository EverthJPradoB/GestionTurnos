const mysql = require('mysql2');

const IP = "localhost";

const pool = mysql.createPool({
    host: IP,
    port: 3307,  // Agrega el puerto aquí
    user: 'root',
    password: '',
    database: 'bd_gestion_turnos'
}).promise(); // 🔥 Agrega `.promise()` aquí

async function query(sql, params = []) {
    try {
        const [rows] = await pool.execute(sql, params); // Ahora sí soporta `execute`
        return rows;
    } catch (error) {
        throw new Error('Error en la consulta: ' + error.message);
    }
}

module.exports = { query , pool};
