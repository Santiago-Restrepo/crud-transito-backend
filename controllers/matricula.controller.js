const boom = require('@hapi/boom');
const client = require("../clients/postgres");
class MatriculaController {
    constructor() {
        this.client = client;
    }

    async getAll(){
        try {
            const query = "SELECT * FROM Matricula";
            const res = await this.client.query(query);
            return res.rows;
        } catch (error) {
            throw boom.boomify(error);
        }
    }

    async getOne(id){
        try {
            const query = "SELECT * FROM Matricula WHERE id = $1";
            const res = await this.client.query(query, [id]);
            if(res.rows.length === 0) throw boom.notFound("Matricula no encontrada");
            return res.rows[0];
        } catch (error) {
            throw boom.boomify(error);
        }
    }

    async create(data){
        try {
            const {
                placa,
                marca,
                fecha_matricula,
                propietario_id,
            } = data;
            if(!placa || !marca || !propietario_id || !fecha_matricula) throw boom.badRequest("Faltan datos");
            const query = "INSERT INTO Matricula (placa, marca, fecha_matricula, propietario_id) VALUES ($1, $2, $3, $4) RETURNING *";
            const res = await this.client.query(query, [placa, marca, fecha_matricula, propietario_id]);
            return res.rows[0];
        } catch (error) {
            const message = error.message;
            if(message){
                throw boom.badRequest(message);
            }else{
                throw boom.boomify(error);
            }
        }
    }

    async update(id, data){
        try {
            let {
                nombre,
                direccion,
                tipo,
            } = data;
            if(tipo){
                if(["persona", "empresa"].indexOf(tipo.toLowerCase()) === -1) throw boom.badRequest("Tipo de propietario no valido");
            }
            const propietario = await this.getOne(id);
            nombre = nombre || propietario.nombre;
            direccion = direccion || propietario.direccion;
            tipo = tipo || propietario.tipo;

            const query = "UPDATE Propietario SET nombre = $1, direccion = $2, tipo = $3 WHERE id = $4 RETURNING *";
            const res = await this.client.query(query, [nombre, direccion, tipo?.toLowerCase(), id]);
            return res.rows[0];
        } catch (error) {
            throw boom.boomify(error);
        }
    }

    async delete(id){
        try {
            const query = "DELETE FROM Propietario WHERE id = $1";
            const res = await this.client.query(query, [id]);
            if(res.rowCount === 0) throw boom.notFound("Propietario no encontrado");
            return {message: "Propietario eliminado"};
        } catch (error) {
            throw boom.boomify(error);
        }
    }
}

module.exports = new MatriculaController();