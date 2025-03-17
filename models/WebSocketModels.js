const { query } = require('../config/conexion');


class WebSocketModels {


    static async get_turnos_pendientes_slider_x_id_venta(id_venta) {

        const sql = `
            SELECT *
            FROM tm_turno tu  
            INNER JOIN bd_gestion_turnos.tm_estado_turno e ON e.id_est_turn = tu.id_est_turn
            INNER JOIN bd_gestion_turnos.tm_tramite t ON tu.id_tra = t.id_tra
            INNER JOIN bd_gestion_turnos.tm_tramite_ventanilla tv ON t.id_tra = tv.id_tra
            INNER JOIN bd_gestion_turnos.tm_ventanilla v ON v.id_venta = tv.id_venta
            WHERE 
                tv.tra_venta_estado = 1 
                AND t.tra_estado = 1 
                AND v.venta_estado = 1 
                AND tu.id_est_turn = 1  /* SOLO LOS PENDIENTES */ 
                AND v.id_venta = ?
            ORDER BY  tu.turn_priori  DESC ,tu.turn_fecha_pri ASC
        `;

        const turnos_pendientes_slider = await query(sql, [id_venta]);

        return turnos_pendientes_slider;
    }


    static async get_cantidad_pendientes(id_venta) {

        const sql = `
                SELECT COUNT(*)  as cantidad
                FROM tm_turno tu
                INNER JOIN bd_gestion_turnos.tm_tramite t ON tu.id_tra = t.id_tra
                INNER JOIN bd_gestion_turnos.tm_tramite_ventanilla tv ON t.id_tra = tv.id_tra
                INNER JOIN bd_gestion_turnos.tm_ventanilla v ON v.id_venta = tv.id_venta
                WHERE tv.tra_venta_estado = 1 
                AND t.tra_estado = 1 
                AND v.venta_estado = 1 
                AND tu.id_est_turn = 1 
                AND v.id_venta = ?  `;

        const cantidad_restante = await query(sql, [id_venta]);

        return cantidad_restante[0]?.cantidad ?? 0;
    }


    static async get_turnos_x_id_venta(id_venta) {

        const sql = `
            SELECT *
            FROM tm_turno tu  
            INNER JOIN bd_gestion_turnos.tm_estado_turno e ON e.id_est_turn = tu.id_est_turn
            INNER JOIN bd_gestion_turnos.tm_tramite t ON tu.id_tra = t.id_tra
            INNER JOIN bd_gestion_turnos.tm_tramite_ventanilla tv ON t.id_tra = tv.id_tra
            INNER JOIN bd_gestion_turnos.tm_ventanilla v ON v.id_venta = tv.id_venta
            WHERE 
                tv.tra_venta_estado = 1 
                AND t.tra_estado = 1 
                AND v.venta_estado = 1 
                AND tu.id_est_turn  = 2
                AND v.id_venta = ?
            ORDER BY tu.id_est_turn DESC LIMIT 1
        `;

        const turnos = await query(sql, [id_venta]);

        return turnos;
    }

    static async get_turnos_totales_pantalla() {
        // SOLO ADMITE VENTNAILLAS ACTIVAS UNIDAD A UN TRAMITE ACTIVO Y CON 
        // UN RECEPCIONISTA ASIGANADO
        const sql = `
                       SELECT id_venta, id_turn, id_est_turn, id_tra, turn_code, tra_nom, tra_descrip, venta_nom, turn_priori
            FROM (
                SELECT 
                    v.id_venta, 
                    tu.id_turn, 
                    tu.id_est_turn, 
                    tu.id_tra, 
                    tu.turn_code,
                    t.tra_nom, 
                    t.tra_descrip, 
                    v.venta_nom, 
                    tu.turn_priori,
                    ROW_NUMBER() OVER (PARTITION BY v.id_venta ORDER BY tu.turn_priori DESC ,tu.turn_fecha_pri ASC  ) AS row_num
                FROM bd_gestion_turnos.tm_ventanilla v  
                LEFT JOIN bd_gestion_turnos.tm_persona_ventanilla pv ON v.id_venta = pv.id_venta
                LEFT JOIN bd_gestion_turnos.tm_tramite_ventanilla tv ON v.id_venta = tv.id_venta
                LEFT JOIN bd_gestion_turnos.tm_tramite t ON tv.id_tra = t.id_tra
                LEFT JOIN bd_gestion_turnos.tm_turno tu ON tu.id_tra = t.id_tra
                    AND tu.id_est_turn IN (2, 1) -- Solo turnos pendientes y en atención
  
                WHERE 
                    v.venta_estado = 1 
                    AND t.tra_estado = 1   
                    AND tv.tra_venta_estado = 1 
                    AND pv.per_venta_estado = 1
            ) AS subquery
            WHERE row_num <= 3 OR row_num IS NULL 

        `;
              /*LEFT JOIN bd_gestion_turnos.tm_estado_turno e ON e.id_est_turn = tu.id_est_turn*/
        const turnos = await query(sql);

        return turnos;
    }


    static async get_turno_en_atencion_actual(id_venta) {

        const sql = `
                    SELECT COUNT(*) en_atencion
                    FROM tm_turno tu  
                    INNER JOIN bd_gestion_turnos.tm_estado_turno e ON e.id_est_turn = tu.id_est_turn
                    INNER JOIN bd_gestion_turnos.tm_tramite t ON tu.id_tra = t.id_tra
                    INNER JOIN bd_gestion_turnos.tm_tramite_ventanilla tv ON t.id_tra = tv.id_tra
                    INNER JOIN bd_gestion_turnos.tm_ventanilla v ON v.id_venta = tv.id_venta
                    WHERE 
                    tv.tra_venta_estado = 1 
                    AND t.tra_estado = 1 
                    AND v.venta_estado = 1 and tu.id_est_turn = 2
                     AND v.id_venta = ?

                    ORDER BY id_turn ASC
                    
                     LIMIT 1
        `;

        const en_atencion = await query(sql, [id_venta]);

        return en_atencion[0]?.en_atencion ?? 0;
    }

    static async get_turno_disponible(id_venta) {

        const sql = `
            SELECT tu.id_turn 
            FROM tm_turno tu  
            INNER JOIN bd_gestion_turnos.tm_estado_turno e ON e.id_est_turn = tu.id_est_turn
            INNER JOIN bd_gestion_turnos.tm_tramite t ON tu.id_tra = t.id_tra
            INNER JOIN bd_gestion_turnos.tm_tramite_ventanilla tv ON t.id_tra = tv.id_tra
            INNER JOIN bd_gestion_turnos.tm_ventanilla v ON v.id_venta = tv.id_venta
            WHERE 
                tv.tra_venta_estado = 1 
                AND t.tra_estado = 1 
                AND v.venta_estado = 1 
                AND tu.id_est_turn = 1 
                AND v.id_venta = ?
               ORDER BY turn_priori DESC , turn_fecha_pri ASC, tu.id_turn 
            LIMIT 1
        `;

        const disponibles = await query(sql, [id_venta]);

        return disponibles[0]?.id_turn ?? 0;

    }

    static async update_pendientes_x_en_atencion(id_turn) {

        const sql = `
        UPDATE bd_gestion_turnos.tm_turno SET id_est_turn = 2 , turn_fecha_aten = NOW() WHERE id_turn = ? AND id_est_turn = 1
        `;

        await query(sql, [id_turn]);
    }

    static async get_turno_nuevo_actual(id_turn) {

        const sql = `
                    SELECT *
                    FROM bd_gestion_turnos.tm_turno tu  
                    INNER JOIN bd_gestion_turnos.tm_estado_turno e ON e.id_est_turn = tu.id_est_turn
                    INNER JOIN bd_gestion_turnos.tm_tramite t ON tu.id_tra = t.id_tra
                    INNER JOIN bd_gestion_turnos.tm_tramite_ventanilla tv ON t.id_tra = tv.id_tra
                    INNER JOIN bd_gestion_turnos.tm_ventanilla v ON v.id_venta = tv.id_venta
                    WHERE 
                        tv.tra_venta_estado = 1 
                        AND t.tra_estado = 1 
                        AND v.venta_estado = 1 
                        AND tu.id_est_turn = 2 
                        and tu.id_turn = ?
                    `;

        const disponibles = await query(sql, [id_turn]);

        return disponibles; // Retorna el id del primer turno o null si no hay

    }

    static async get_datos_patanlla_x_ventana(id_venta) {


        const sql = `
                SELECT *
                            FROM tm_turno tu  
                            INNER JOIN bd_gestion_turnos.tm_estado_turno e ON e.id_est_turn = tu.id_est_turn
                            INNER JOIN bd_gestion_turnos.tm_tramite t ON tu.id_tra = t.id_tra
                            INNER JOIN bd_gestion_turnos.tm_tramite_ventanilla tv ON t.id_tra = tv.id_tra
                            INNER JOIN bd_gestion_turnos.tm_ventanilla v ON v.id_venta = tv.id_venta
                            WHERE 
                                tv.tra_venta_estado = 1 
                                AND t.tra_estado = 1 
                                AND v.venta_estado = 1 
                                AND tu.id_est_turn IN (2, 1)
                                AND v.id_venta = ?
                            ORDER BY turn_priori DESC  , turn_fecha_pri ASC ,tu.id_turn 
                            LIMIT 4
                `;

        const resultado = await query(sql, [id_venta]);

        return resultado; // Retorna el id del primer turno o null si no hay

    }

    static async cantidad_restantes_pendientes(id_venta) {
        const sql = `
            SELECT COUNT(*) AS cantidad_restante
            FROM tm_turno tu
            INNER JOIN bd_gestion_turnos.tm_tramite t ON tu.id_tra = t.id_tra
            INNER JOIN bd_gestion_turnos.tm_tramite_ventanilla tv ON t.id_tra = tv.id_tra
            INNER JOIN bd_gestion_turnos.tm_ventanilla v ON v.id_venta = tv.id_venta
            WHERE tv.tra_venta_estado = 1 
            AND t.tra_estado = 1 
            AND v.venta_estado = 1 
            AND tu.id_est_turn = 1 
            AND v.id_venta = ?
            `;
        const resultado = await query(sql, [id_venta]);
        return resultado[0]?.cantidad_restante ?? 0; // Retorna el id del primer turno o null si no hay
    }

    static async update_en_atencion_x_en_finalizado(id_turn) {

        const sql = `
      UPDATE bd_gestion_turnos.tm_turno SET id_est_turn = 3 WHERE id_turn = ? AND id_est_turn = 2
        `;

        await query(sql, [id_turn]);

    }

    static async update_en_atencion_x_en_cancelado_anulado(id_est_turn, id_per_accion, id_turn) {
        const sql = `
            UPDATE bd_gestion_turnos.tm_turno 
            SET id_est_turn = ?, id_per_accion = ? 
            WHERE id_turn = ? AND id_est_turn = 2
        `;
    
        await query(sql, [id_est_turn, id_per_accion, id_turn]);
    }


    static async get_turn_fecha_aten(id_turn) {

        const sql = `
            SELECT turn_fecha_aten FROM bd_gestion_turnos.tm_turno  WHERE id_est_turn = 3 AND id_turn = ?
        `;

        const turn_fecha_aten = await query(sql, [id_turn]);

        return turn_fecha_aten[0]?.turn_fecha_aten ?? 0;
    }



    static async update_pioridad_turno(id_pri, id_turn) {
        const sql = `
            UPDATE bd_gestion_turnos.tm_turno SET turn_priori = 1 , id_pri = ? , turn_fecha_pri = NOW() WHERE id_turn = ?
        `;
        await query(sql, [id_pri, id_turn]);
    }
    static async select_turn_code_x_id_turn(id_turn) {
        const sql = `
            SELECT turn_code FROM bd_gestion_turnos.tm_turno WHERE id_turn = ?
        `;
        const turn_code = await query(sql, [id_turn]);

        return turn_code[0]?.turn_code ?? 0;
    }


    static async insert_atendidos(atem_fecha_inicio, id_turn,id_per) {
        const sql = `
           INSERT INTO bd_gestion_turnos.tm_atencion (atem_fecha_inicio, id_turn, id_per) VALUES (?, ?, ?);

            `;
        await query(sql, [atem_fecha_inicio, id_turn,id_per]);
    }


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


    static async datos_estaditicos_finalizados_cancelados_ausentes(id_rol, id_venta) {
            const sql = `
                SELECT 
                    COALESCE(SUM(CASE WHEN tu.id_est_turn = 3 THEN 1 ELSE 0 END), 0) AS finalizados,
                    COALESCE(SUM(CASE WHEN tu.id_est_turn = 4 THEN 1 ELSE 0 END), 0) AS cancelados,
                    COALESCE(SUM(CASE WHEN tu.id_est_turn = 5 THEN 1 ELSE 0 END), 0) AS ausentes
                FROM tm_turno tu  
                INNER JOIN bd_gestion_turnos.tm_estado_turno e ON e.id_est_turn = tu.id_est_turn
                INNER JOIN bd_gestion_turnos.tm_tramite t ON tu.id_tra = t.id_tra
                INNER JOIN bd_gestion_turnos.tm_tramite_ventanilla tv ON t.id_tra = tv.id_tra
                INNER JOIN bd_gestion_turnos.tm_ventanilla v ON v.id_venta = tv.id_venta
                WHERE 
                    tv.tra_venta_estado = 1 
                    AND t.tra_estado = 1 
                    AND v.venta_estado = 1 
                    AND ( ? = 3 OR v.id_venta = ? )
                    AND DATE(tu.turn_fecha_crea) = CURDATE();
                `;

        const resultado = await query(sql, [id_rol, id_venta]);

        return resultado[0] ?? { finalizados: 0, cancelados: 0, ausentes: 0 };

    }

}

module.exports = { WebSocketModels };