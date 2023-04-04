const boom = require('@hapi/boom');
const client = require("../clients/postgres");
class VehiculoController {
    constructor() {
        this.client = client;
    }

    async getAll(){
        try {
            const query = "SELECT * FROM Vehiculo";
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
            const query = "SELECT * FROM Vehiculo WHERE id = $1";
            const res = await this.client.query(query, [id]);
            if(res.rows.length === 0) throw boom.notFound("Vehículo no encontrado");
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
                tipo,
                matricula_id
            } = data;
            if(["automovil", "moto", "carro pesado"].indexOf(tipo.toLowerCase()) === -1) throw boom.badRequest("Tipo de vehículo no valido");
            const query = "INSERT INTO Vehiculo (tipo, matricula_id) VALUES ($1, $2) RETURNING *";
            const res = await this.client.query(query, [tipo.toLowerCase(), matricula_id]);
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
                tipo,
                matricula_id
            } = data;
            if(tipo){
                if(["automovil", "moto", "carro pesado"].indexOf(tipo.toLowerCase()) === -1) throw boom.badRequest("Tipo de vehículo no valido");
            }
            const vehiculo = await this.getOne(id);
            
            tipo = tipo || vehiculo.tipo;
            matricula_id = matricula_id || vehiculo.matricula_id;

            const query = "UPDATE Vehiculo SET tipo = $1, matricula_id = $2 WHERE id = $3 RETURNING *";
            const res = await this.client.query(query, [tipo.toLowerCase(), matricula_id, id]);
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
            const query = "DELETE FROM Vehiculo WHERE id = $1";
            const res = await this.client.query(query, [id]);
            if(res.rowCount === 0) throw boom.notFound("Vehículo no encontrado");
            return {message: "Vehículo eliminado"};
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

module.exports = new VehiculoController();