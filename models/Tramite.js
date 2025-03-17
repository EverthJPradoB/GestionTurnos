

const { query } = require('../config/conexion');


class Tramite {

    static async get_tramites_activos() {
        const sql = `
            SELECT * FROM bd_gestion_turnos.tm_tramite WHERE tra_estado = 1
            `;

        const resultado = await query(sql);

        return resultado;
    }

    static async insert_tramites(tra_nom, tra_descrip, tra_tiem_esti) {
        const sql = `
       INSERT INTO bd_gestion_turnos.tm_tramite (tra_nom, tra_descrip , tra_tiem_esti ) VALUES (?, ?, ?)
            `;
        await query(sql, [tra_nom, tra_descrip , tra_tiem_esti]);
    }


    static async get_tramite_activo_x_id(id_tra) {
        const sql = `
            SELECT * FROM  bd_gestion_turnos.tm_tramite WHERE id_tra = ?
            `;
        const resultado = await query(sql,[id_tra]);

        return resultado[0];
    }

    static async update_tramites(tra_nom, tra_descrip, tra_tiem_esti, id_tra)
    {

        const sql = `
        UPDATE bd_gestion_turnos.tm_tramite SET tra_nom = ?, tra_descrip = ? , tra_tiem_esti = ? WHERE id_tra = ?
            `;
        await query(sql, [tra_nom, tra_descrip, tra_tiem_esti , id_tra]);
    }


    ///// inactivamos tramite y la ventanilla unida a un tramite
    static async delete_tramite_x_id(id_tra)
    {
        //inactivamos tramite
        const sql = `
        UPDATE bd_gestion_turnos.tm_tramite SET tra_estado = 0 WHERE id_tra = ?
            `;
        await query(sql, [id_tra]);

        // inactivamos  la ventanilla unida a un tramite
        const sql1 = `
        UPDATE bd_gestion_turnos.tm_tramite_ventanilla SET tra_venta_estado = 0 WHERE id_tra = ?
            `;
        await query(sql1, [id_tra]);

    }





}




module.exports = Tramite;
