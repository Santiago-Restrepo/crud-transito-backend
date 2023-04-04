const boom = require('@hapi/boom');
const client = require("../clients/postgres");
class InfraccionController {
    constructor() {
        this.client = client;
    }

    async getAll(){
        try {
            const query = "SELECT * FROM Infraccion";
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
            const query = "SELECT * FROM Infraccion WHERE id = $1";
            const res = await this.client.query(query, [id]);
            if(res.rows.length === 0) throw boom.notFound("Infraccion no encontrada");
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
                fecha_infraccion,
                accionada_por,
                descripcion,
                valor,
                vehiculo_id
            } = data;
            if(!accionada_por) throw boom.badRequest("Tipo de infracción no valida");
            if(["agente de tránsito", "cámara de detecciones"].indexOf(accionada_por.toLowerCase()) === -1) throw boom.badRequest("Tipo de infracción no valida");
            const query = "INSERT INTO Infraccion (fecha_infraccion, accionada_por, descripcion, valor, vehiculo_id) VALUES ($1, $2, $3, $4, $5) RETURNING *";
            const res = await this.client.query(query, [fecha_infraccion, accionada_por, descripcion, valor, vehiculo_id]);
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
                fecha_infraccion,
                accionada_por,
                descripcion,
                valor,
                vehiculo_id
            } = data;
            
            if(accionada_por && ["agente de tránsito", "cámara de detecciones"].indexOf(accionada_por.toLowerCase()) === -1) throw boom.badRequest("Tipo de infracción no valida");
            const infraccion = await this.getOne(id);
            fecha_infraccion = fecha_infraccion || infraccion.fecha_infraccion;
            accionada_por = accionada_por || infraccion.accionada_por;
            descripcion = descripcion || infraccion.descripcion;
            valor = valor || infraccion.valor;
            vehiculo_id = vehiculo_id || infraccion.vehiculo_id;

            const query = "UPDATE Infraccion SET fecha_infraccion = $1, accionada_por = $2, descripcion = $3, valor = $4, vehiculo_id = $5 WHERE id = $6 RETURNING *";
            const res = await this.client.query(query, [fecha_infraccion, accionada_por, descripcion, valor, vehiculo_id, id]);
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

module.exports = new InfraccionController();