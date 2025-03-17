const { query } = require('../config/conexion');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class Usuario {

    static async login(username, password) {
        const sql = `
        SELECT p.id_per, p.per_nom, p.per_ape_pa, p.per_ape_ma, p.id_rol, v.id_venta, id_cred, c.password_
        FROM tm_persona AS p
        INNER JOIN tm_credencial AS c ON c.id_per = p.id_per
        LEFT JOIN tm_persona_ventanilla AS pv ON pv.id_per = p.id_per  AND pv.per_venta_estado = 1
        LEFT JOIN tm_ventanilla AS v ON pv.id_venta = v.id_venta AND v.venta_estado = 1
        LEFT JOIN tm_rol AS r ON r.id_rol = p.id_rol
        WHERE p.per_estado = 1
        AND c.username_ = ?
       
        `;

        // Obtén los datos del usuario
        const user_validado = await query(sql, [username]);

        // Verificar si el usuario existe
        if (user_validado.length === 0) {
            console.log('Usuario no encontrado');
            return null;
        }


        // await Usuario.generarContraseñaSegura();

        // Verifica la contraseña
        const match = await bcrypt.compare(password, user_validado[0].password_);

        if (!match) {
            console.log('Contraseña incorrecta');
            return null;
        }

        return user_validado; // Devuelve el usuario si la contraseña es válida
    }

    static async get_total_personas_mnt() {
        const sql = `
            SELECT 

                p.id_per AS id_per,
                p.per_nom AS per_nom,
                p.per_ape_pa  AS per_ape_pa,
                p.per_ape_ma  AS per_ape_ma,  
                p.per_correo AS per_correo,  
                p.per_telef AS per_telef,  
                r.rol_nom,
                r.id_rol, 
                v.venta_nom AS venta_nom
                FROM tm_persona p
                INNER JOIN tm_rol r ON r.id_rol = p.id_rol
                INNER JOIN tm_credencial c ON c.id_per= p.id_per
                
                LEFT JOIN tm_persona_ventanilla pv ON p.id_per = pv.id_per AND pv.per_venta_estado = 1
                LEFT JOIN tm_ventanilla v ON v.id_venta = pv.id_venta AND  v.venta_estado = 1 
                WHERE p.per_estado = 1 AND r.id_rol BETWEEN 2 AND 3 ;
            `;

        const personas_disponibles_mnt = await query(sql);




        return personas_disponibles_mnt;
    }

    ///// SOLO PARA TRANSACCIONES GRACES NECESITO USAR TRY CATH EN EL MODEL (PORQUE SON VARIAS SENTENCIAS QUE VAN UNIDAS)


    static async insertPersona(per_nom, per_ape_pa, per_ape_ma, per_correo, per_telef, id_rol) {
        const sql = "INSERT INTO `bd_gestion_turnos`.`tm_persona` (per_nom, per_ape_pa, per_ape_ma, per_correo, per_telef, id_rol) VALUES (?, ?, ?, ?, ?, ?)";
        const params = [per_nom, per_ape_pa, per_ape_ma, per_correo, per_telef, id_rol];
        const result = await query(sql, params);
        return result.insertId;
    }


    static async asociar_ventanilla(id_venta, id_per) {
        const sql = "INSERT INTO bd_gestion_turnos.tm_persona_ventanilla (id_venta, id_per) VALUES (?, ?)";
        const params = [id_venta, id_per];
        await query(sql, params);
    }

    // validar si existe el rol ingresado, no necesario
    static async getRolPorIdCombo(id_rol) {

        const sql = "SELECT id_rol FROM `bd_gestion_turnos`.`tm_rol` WHERE rol_estado = 1 AND id_rol = ?";
        const [rows] = await query(sql, [id_rol]);

        return rows.length > 0 ? rows[0].id_rol : null; // Retorna el id_rol o null si no hay resultado

    }


    static async getRolesActivos() {

        const sql = `
                SELECT * FROM bd_gestion_turnos.tm_rol 
                WHERE rol_estado = 1 
                AND id_rol BETWEEN 2 AND 3;
            `;

        const roles_disponibles = await query(sql);

        return [roles_disponibles].length > 0 ? roles_disponibles : null; // Retorna los roles o null si no hay

    }

    static async get_ventanilla_x_id_persona(id_per) {
        const sql = `
            SELECT v.id_venta 
            FROM tm_ventanilla v
            LEFT JOIN tm_persona_ventanilla pv ON v.id_venta = pv.id_venta AND pv.per_venta_estado = 1
            LEFT JOIN tm_persona t ON pv.id_per = t.id_per AND t.per_estado = 1 
            WHERE v.venta_estado = 1 AND t.id_per = ?
        `;

        const venta_disponible = await query(sql, [id_per]);

        // Retorna el ID de la ventanilla o null si no hay resultado
        return venta_disponible.length > 0 ? venta_disponible[0].id_venta : null;
    }

    static async get_ventanillas_activas_disponibles(id_persona_actual, ventanilla_actual) {

        // Base de la consulta
        let sql = `
                SELECT v.id_venta, v.venta_nom 
                FROM tm_ventanilla v
                WHERE v.venta_estado = 1
            `;

        let params = [];

        if (ventanilla_actual) {
            sql += ` AND (v.id_venta = ? 
                            OR v.id_venta NOT IN (
                                SELECT pv.id_venta 
                                FROM tm_persona_ventanilla pv 
                                WHERE pv.id_per <> ? AND pv.per_venta_estado = 1
                            ))`;
            params.push(ventanilla_actual, id_persona_actual);
        } else {
            sql += ` AND v.id_venta NOT IN (
                            SELECT pv.id_venta 
                            FROM tm_persona_ventanilla pv  
                            WHERE pv.per_venta_estado = 1
                        )`;
        }

        // Ejecutar consulta
        const ventanillasDisponibles = await query(sql, params);


        return [ventanillasDisponibles].length > 0 ? ventanillasDisponibles : null;

    }

    static async insertCredenciales(id_per, per_nom, per_ape_pa, per_ape_ma) {
        const username_ = Usuario.generarCredenciales(per_nom, per_ape_pa, per_ape_ma);

        // Generar una contraseña aleatoria segura
        const password_ = username_;

        // Hacer hash de la contraseña antes de guardarla en la base de datos
        const hashedPassword = await bcrypt.hash(password_, saltRounds);



        const sql = "INSERT INTO `bd_gestion_turnos`.`tm_credencial` (username_, password_, id_per) VALUES (?, ?, ?)";
        const params = [username_, hashedPassword, id_per];
        await query(sql, params);
    }


    static async generarContraseñaSegura() {
        const hashedPassword = await bcrypt.hash("admin", saltRounds);
        console.log("admin: " + hashedPassword);
    }


    // static async generarContraseñaSegura() {
    //     // Generar una contraseña aleatoria y segura
    //     const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    //     let contraseña = '';
    //     for (let i = 0; i < 12; i++) {
    //         contraseña += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    //     }
    //     return contraseña;
    // }

    static async get_persona_x_id(id_per) {

        const sql = `
                SELECT 
                 p.id_per AS id_per,
                p.per_nom AS per_nom,
                p.per_ape_pa  AS per_ape_pa,
                p.per_ape_ma  AS per_ape_ma,  
                p.per_correo AS per_correo,  
                p.per_telef AS per_telef,  
                r.id_rol,
                r.rol_nom, 
                v.venta_nom AS venta_nom
                FROM tm_persona p
                 INNER JOIN tm_rol r ON r.id_rol = p.id_rol
                LEFT JOIN tm_persona_ventanilla pv ON p.id_per = pv.id_per AND pv.per_venta_estado = 1
                LEFT  JOIN tm_ventanilla v ON v.id_venta = pv.id_venta AND  v.venta_estado = 1 
                WHERE p.per_estado = 1 AND  p.id_per = ?`;


        const persona_x_id = await query(sql, [id_per]);

        return persona_x_id[0];

    }


    ///////////////////// UPDATE PERSONA VENTANILLLA ///////////////////////////

    static async update_persona(id_per, per_nom, per_ape_pa, per_ape_ma, per_correo, per_telef) {
        const sql = `
            UPDATE bd_gestion_turnos.tm_persona 
            SET per_nom = ?, per_ape_pa = ?, per_ape_ma = ?, per_correo = ?, per_telef = ?
            WHERE id_per = ? `;

        await query(sql, [
            per_nom, per_ape_pa, per_ape_ma, per_correo, per_telef, id_per
        ]);
    }

    static async verificar_tramite_ventanilla(id_per) {
        const sqlCheck = `
            SELECT COUNT(*) AS count , id_venta
            FROM bd_gestion_turnos.tm_persona_ventanilla
            WHERE id_per = ? AND per_venta_estado = 1`;


        const verificar = await query(sqlCheck, [id_per]);
        return verificar.length > 0 ? verificar[0] : null;

        // Retorna true si existe un trámite asignado
    }

    static async update_tramite(id_venta, id_per) {
        const sqlUpdate = `
            UPDATE bd_gestion_turnos.tm_persona_ventanilla
            SET id_venta = ?
            WHERE id_per = ? AND per_venta_estado = 1`;

        await query(sqlUpdate, [id_venta, id_per]);
    }

    static async get_priorizacion() {
        const sql = `SELECT * FROM bd_gestion_turnos.tm_priorizacion WHERE pri_estado = 1`;

        const priorizaciones = await query(sql);

        return priorizaciones;
    }

    static async asociar_ventanilla(id_per, id_venta) {
        const sql = "INSERT INTO `bd_gestion_turnos`.`tm_persona_ventanilla` (id_venta, id_per) VALUES (?, ?)";
        const params = [id_venta, id_per];
        await query(sql, params);
    }


    static generarCredenciales(nombre, apellidoPaterno, apellidoMaterno) {
        nombre = nombre.toLowerCase().trim();
        apellidoPaterno = apellidoPaterno.toLowerCase().trim();
        apellidoMaterno = apellidoMaterno.toLowerCase().trim();

        // Eliminamos caracteres especiales y espacios
        nombre = nombre.replace(/[^a-z]/g, '');
        apellidoPaterno = apellidoPaterno.replace(/[^a-z]/g, '');
        apellidoMaterno = apellidoMaterno.replace(/[^a-z]/g, '');

        // Tomamos 3 letras del nombre, 3 del apellido paterno y 2 del materno
        let usuario = (nombre.substring(0, 3) || '') +
            (apellidoPaterno.substring(0, 3) || '') +
            (apellidoMaterno.substring(0, 2) || '');

        return usuario;
    }


    static async delete_usuario_x_id(id_per) {
        //inactivamos tramite
        const sql = `
         UPDATE bd_gestion_turnos.tm_persona SET per_estado = 0 WHERE id_per = ?
            `;
        await query(sql, [id_per]);

        // inactivamos  la ventanilla unida a un tramite
        const sql1 = `
          UPDATE bd_gestion_turnos.tm_persona_ventanilla SET per_venta_estado = 0 WHERE id_per = ?
            `;
        await query(sql1, [id_per]);

    }



    static async desvincular_ventanilla(id_per) {

        // inactivamos  la ventanilla unida a un tramite
        const sql1 = `
          UPDATE bd_gestion_turnos.tm_persona_ventanilla SET per_venta_estado = 0 WHERE id_per = ?
            `;
        await query(sql1, [id_per]);

    }



    static async get_perfil_x_id(id_per) {
        const sql = `
        SELECT * FROM  bd_gestion_turnos.tm_persona WHERE id_per = ? AND per_estado = 1
           `;

        const perfil = await query(sql, [id_per]);

        return perfil[0];
    }


    static async update_perfil(per_nom = '', per_ape_pa = '', per_ape_ma = '', per_correo = '', per_telef = '', id_per) {
        const sql = `
          UPDATE bd_gestion_turnos.tm_persona 
            SET per_nom = ? , 
                per_ape_pa = ? , 
                per_ape_ma = ? , 
                per_correo = ? , 
                per_telef = ? 
            WHERE id_per = ?
            `;

        await query(sql, [
            per_nom, per_ape_pa, per_ape_ma, per_correo, per_telef, id_per
        ]);
    }

}

module.exports = Usuario;