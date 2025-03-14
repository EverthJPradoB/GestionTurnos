
const { query } = require('../config/conexion');

// await pool.execute
class Kiosko {



    static async get_ventanilla_tramite_kiosko() {
        const sql = `
      SELECT  v.id_venta  ,v.venta_nom  FROM  
            bd_gestion_turnos.tm_tramite t 
            INNER JOIN  bd_gestion_turnos.tm_tramite_ventanilla tv ON t.id_tra = tv.id_tra
            INNER JOIN  bd_gestion_turnos.tm_ventanilla v ON v.id_venta = tv.id_venta
            INNER JOIN bd_gestion_turnos.tm_persona_ventanilla pv ON pv.id_venta = v.id_venta
            WHERE tv.tra_venta_estado = 1 AND t.tra_estado = 1 AND v.venta_estado = 1 
            AND pv.per_venta_estado = 1
            
        `;

        const ventanilla_tramite_kiosko = await query(sql);

        // Retorna el ID de la ventanilla o null si no hay resultado
        return ventanilla_tramite_kiosko;
    }


    static async get_tramite_x_ventanilla(id_venta) {
        const sql = `
                SELECT t.id_tra, t.tra_nom  ,t.tra_descrip  
                FROM bd_gestion_turnos.tm_tramite t 
                INNER JOIN bd_gestion_turnos.tm_tramite_ventanilla tv ON t.id_tra = tv.id_tra
                INNER JOIN bd_gestion_turnos.tm_ventanilla v ON v.id_venta = tv.id_venta
                  INNER JOIN bd_gestion_turnos.tm_persona_ventanilla pv ON pv.id_venta = v.id_venta
                  
                WHERE tv.tra_venta_estado = 1 
                  AND t.tra_estado = 1 
                  AND v.venta_estado = 1 
                   AND pv.per_venta_estado = 1
                  AND v.id_venta = ?
            
        `;

        const tramite = await query(sql, [id_venta]);

        // Retorna el ID de la ventanilla o null si no hay resultado
        return tramite[0];
    }

    static async get_cantidad_ventanilla_tramite(   id_venta, id_tra) {
        const sql = `
        SELECT count(*) as cantidad FROM bd_gestion_turnos.tm_turno WHERE  id_venta = ? AND id_tra = ? 
            
        `;

        const cantidad = await query(sql, [id_venta, id_tra]);

        // Retorna el ID de la ventanilla o null si no hay resultado
        return cantidad[0]?.cantidad ?? 0; 
    }

    static async insert_turno(turn_code, id_venta, id_tra) {
        const sql = "INSERT INTO bd_gestion_turnos.tm_turno (turn_code, id_venta, id_tra) VALUES (?, ?, ?);";
        const params = [ turn_code, id_venta, id_tra];
        const result = await query(sql, params);
        return result.insertId;
    }


    static async get_cantidad_restante(id_venta,id_turn) {
        const sql = `
                    SELECT turn_code, turn_fecha_crea, 
                    (SELECT GREATEST(COUNT(*) - 1, 0) 
                     FROM tm_turno tu
                     INNER JOIN bd_gestion_turnos.tm_tramite t ON tu.id_tra = t.id_tra
                     INNER JOIN bd_gestion_turnos.tm_tramite_ventanilla tv ON t.id_tra = tv.id_tra
                     INNER JOIN bd_gestion_turnos.tm_ventanilla v ON v.id_venta = tv.id_venta
                     WHERE tv.tra_venta_estado = 1 
                       AND t.tra_estado = 1 
                       AND v.venta_estado = 1 
                       AND tu.id_est_turn = 1 AND v.id_venta = ? ) AS turnos_espera
                FROM tm_turno 
                WHERE id_turn = ?;
            
        `;

        const cantidad = await query(sql, [id_venta,id_turn]);

        return cantidad[0] ?? null; 
    }



}

module.exports = Kiosko
