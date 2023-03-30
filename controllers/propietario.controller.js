const boom = require('@hapi/boom');
const client = require("../clients/postgres");
class PropietarioController {
    constructor() {
        this.client = client;
    }

    async getAll(){
        try {
            const query = "SELECT * FROM propietario";
            const res = await this.client.query(query);
            return res.rows;
        } catch (error) {
            throw boom.boomify(error);
        }
    }

    async create(data){
        try {
            const {
                nombre,
                apellido,
                tipo,
            } = data;
            const query = "INSERT INTO Propietario (nombre, direccion, tipo) VALUES ($1, $2, $3) RETURNING *";
            const res = await this.client.query(query, [nombre, apellido, tipo]);
            return res.rows[0];
        } catch (error) {
            throw boom.boomify(error);
        }
    }
}

module.exports = new PropietarioController();