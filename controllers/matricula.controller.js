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
            const query = "SELECT * FROM Matricula WHERE id = $1";
            const res = await this.client.query(query, [id]);
            if(res.rows.length === 0) throw boom.notFound("Matricula no encontrada");
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
                placa,
                marca,
                fecha_matricula,
                propietario_id,
            } = data;
            const matricula = await this.getOne(id);
            
            placa = placa || matricula.placa;
            marca = marca || matricula.marca;
            fecha_matricula = fecha_matricula || matricula.fecha_matricula;
            propietario_id = propietario_id || matricula.propietario_id;

            const query = "UPDATE Matricula SET placa = $1, marca = $2, fecha_matricula = $3, propietario_id = $4 WHERE id = $5 RETURNING *";
            const res = await this.client.query(query, [placa, marca, fecha_matricula, propietario_id, id]);
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
            const query = "DELETE FROM Matricula WHERE id = $1";
            const res = await this.client.query(query, [id]);
            if(res.rowCount === 0) throw boom.notFound("Matricula no encontrada");
            return {message: "Matricula eliminada"};
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

module.exports = new MatriculaController();