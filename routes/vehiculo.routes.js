const {Router} = require("express");
const router = Router();

const vehiculoController = require("../controllers/vehiculo.controller");

router.get("/", async (req, res, next) => {
    try {
        const result = await vehiculoController.getAll();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const result = await vehiculoController.getOne(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const result = await vehiculoController.create(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        const result = await vehiculoController.update(req.params.id, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const result = await vehiculoController.delete(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
