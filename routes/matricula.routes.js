const {Router} = require("express");
const router = Router();

const matriculaController = require("../controllers/matricula.controller");

router.get("/", async (req, res, next) => {
    try {
        const result = await matriculaController.getAll();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const result = await matriculaController.getOne(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const result = await matriculaController.create(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        const result = await matriculaController.update(req.params.id, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const result = await matriculaController.delete(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
