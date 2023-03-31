const {Router} = require("express");
const router = Router();

const infraccionController = require("../controllers/infraccion.controller");

router.get("/", async (req, res, next) => {
    try {
        const result = await infraccionController.getAll();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const result = await infraccionController.getOne(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const result = await infraccionController.create(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        const result = await infraccionController.update(req.params.id, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const result = await infraccionController.delete(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
