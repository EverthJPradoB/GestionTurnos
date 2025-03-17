const { query } = require('../config/conexion');

// await pool.execute
class Ventanilla {

    static async get_ventanilla_activos_model() {

        const sql = `  SELECT 
                    v.id_venta as id_venta,
                    v.venta_nom as venta_nom, 
                     v.venta_descrip as venta_descrip , 
                    t.tra_nom as tra_nom
                FROM tm_ventanilla v
                LEFT JOIN tm_tramite_ventanilla vt ON v.id_venta = vt.id_venta AND vt.tra_venta_estado = 1
                LEFT JOIN tm_tramite t ON vt.id_tra = t.id_tra AND  t.tra_estado = 1 
                WHERE v.venta_estado = 1;`;
            

                
        const ventanillas_disponibles = await query(sql);

        return ventanillas_disponibles; // 
    }



    static async insert_ventanilla(venta_nom, venta_descrip) {
        const sql = "INSERT INTO bd_gestion_turnos.tm_ventanilla (venta_nom, venta_descrip) VALUES (?, ?)";
        const params = [venta_nom, venta_descrip];
        const result = await query(sql, params);
        return result.insertId;
    }
    

    
    static async get_ventanilla_x_id_combo(id_venta) {
        const sql = `
           SELECT t.id_tra 
            FROM bd_gestion_turnos.tm_ventanilla v
            LEFT JOIN tm_tramite_ventanilla vt ON v.id_venta = vt.id_venta AND vt.tra_venta_estado = 1
            LEFT JOIN tm_tramite t ON vt.id_tra = t.id_tra AND t.tra_estado = 1 
            WHERE v.venta_estado = 1 AND v.id_venta = ?
        `;

        const tra_disponible = await query(sql, [id_venta]);

        // Retorna el ID de la ventanilla o null si no hay resultado
        return tra_disponible.length > 0 ? tra_disponible[0].id_tra : null;
    }



    static async get_tramites_activas_disponibles(id_ventanilla_actual, tramite_actual) {

        // Base de la consulta
        let sql = `
           SELECT t.id_tra, t.tra_nom 
                FROM tm_tramite t
                WHERE t.tra_estado = 1
            `;

        let params = [];

        if (tramite_actual) {
            sql += ` AND (t.id_tra = ? 
                        OR t.id_tra NOT IN (
                            SELECT vt.id_tra 
                            FROM tm_tramite_ventanilla vt 
                            WHERE vt.id_venta <> ? AND vt.tra_venta_estado = 1)) `;
            params.push(tramite_actual, id_ventanilla_actual);
        } else {
            sql += `         
                         AND t.id_tra NOT IN (
                        SELECT vt.id_tra 
                        FROM tm_tramite_ventanilla vt
                        WHERE vt.tra_venta_estado = 1)           
                        `;
        }

        // Ejecutar consulta
        const tramitesDisponibles = await query(sql, params);


        return [tramitesDisponibles].length > 0 ? tramitesDisponibles : null;

    }


    static async get_ventanilla_x_id(id_venta) {
        const sql = `
         SELECT  
               v.id_venta , 
               v.venta_nom , 
               v.venta_descrip 

                FROM tm_ventanilla v
                LEFT JOIN tm_tramite_ventanilla vt ON v.id_venta = vt.id_venta and vt.tra_venta_estado = 1
                LEFT JOIN tm_tramite t ON vt.id_tra = t.id_tra AND  t.tra_estado =1
                WHERE v.venta_estado = 1 AND  v.id_venta = ?
        `;

        const ventanilla_x_id = await query(sql, [id_venta]);

        // Retorna el ID de la ventanilla o null si no hay resultado
        return ventanilla_x_id[0];
    }

    //////////////////// UPDATE VENTANILLA 


    static async update_ventanilla( venta_nom, venta_descrip, id_venta) {
        const sql = `
        UPDATE bd_gestion_turnos.tm_ventanilla SET venta_nom = ?, venta_descrip = ?  where  id_venta = ?;
            `;

        await query(sql, [venta_nom,venta_descrip,id_venta]);
    }

    static async verificar_tramite_ventanilla(id_venta) {
        const sqlCheck = `
      SELECT COUNT(*) as count , id_tra FROM bd_gestion_turnos.tm_tramite_ventanilla
                              WHERE id_venta = ? and tra_venta_estado = 1`;


        const verificar = await query(sqlCheck, [id_venta]);
        return verificar.length > 0 ? verificar[0] : null;
    }

    static async update_tramite( id_tra ,id_venta) {
        const sqlUpdate = `
         UPDATE bd_gestion_turnos.tm_tramite_ventanilla
         SET id_tra = ? WHERE id_venta = ? and tra_venta_estado = 1
            
            `;

        await query(sqlUpdate, [id_tra, id_venta]);
    }


    static async asociar_ventanilla_tramite(id_venta, id_tra ) {
        const sql = "INSERT INTO bd_gestion_turnos.tm_tramite_ventanilla (id_venta, id_tra) VALUES (?, ?)";
        const params = [id_venta, id_tra];
        await query(sql, params);
    }


    static async delete_ventanilla_x_id(id_venta)
    {
        // 1 Inactivar la ventanilla
        const sql = `
            UPDATE bd_gestion_turnos.tm_ventanilla
                SET venta_estado = 0 
                WHERE id_venta = ?
            `;
        await query(sql, [id_venta]);

        // 2 Inactivar los trámites asociados a la ventanilla
        const sql1 = `
            UPDATE bd_gestion_turnos.tm_tramite_ventanilla 
                SET tra_venta_estado = 0 
                WHERE id_venta = ?
            `;
        await query(sql1, [id_venta]);


        const sql2 = `
            UPDATE bd_gestion_turnos.tm_persona_ventanilla
                SET per_venta_estado = 0 
                WHERE id_venta = ?
        `;
            await query(sql2, [id_venta]);

    }


    
    static async desvincular_tramite(id_venta) {

        // inactivamos  la ventanilla unida a un tramite
        const sql1 = `
          UPDATE bd_gestion_turnos.tm_tramite_ventanilla SET tra_venta_estado = 0 WHERE id_venta = ?
            `;
        await query(sql1, [id_venta]);

    }



}

module.exports = Ventanilla
