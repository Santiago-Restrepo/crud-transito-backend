const boom = require('@hapi/boom');
const client = require("../clients/postgres");
class PropietarioController {
    constructor() {
        this.client = client;
    }

    async getAll(){
        try {
            const query = "SELECT * FROM Propietario";
            const res = await this.client.query(query);
            return res.rows;
        } catch (error) {
            const message = error.message;
            if(message){
                throw boom.badRequest(message);
            }else{
                throw boom.boomify(error);
            }
        }
    }

    async getOne(id){
        try {
            const query = "SELECT * FROM propietario WHERE id = $1";
            const res = await this.client.query(query, [id]);
            if(res.rows.length === 0) throw boom.notFound("Propietario no encontrado");
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

    async create(data){
        try {
            const {
                nombre,
                direccion,
                tipo,
            } = data;
            if(["persona", "empresa"].indexOf(tipo.toLowerCase()) === -1) throw boom.badRequest("Tipo de propietario no valido");
            const query = "INSERT INTO Propietario (nombre, direccion, tipo) VALUES ($1, $2, $3) RETURNING *";
            const res = await this.client.query(query, [nombre, direccion, tipo.toLowerCase()]);
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
            const message = error.message;
            if(message){
                throw boom.badRequest(message);
            }else{
                throw boom.boomify(error);
            }
        }
    }

    async delete(id){
        try {
            const query = "DELETE FROM Propietario WHERE id = $1";
            const res = await this.client.query(query, [id]);
            if(res.rowCount === 0) throw boom.notFound("Propietario no encontrado");
            return {message: "Propietario eliminado"};
        } catch (error) {
            const message = error.message;
            if(message){
                throw boom.badRequest(message);
            }else{
                throw boom.boomify(error);
            }
        }
    }
}

module.exports = new PropietarioController();