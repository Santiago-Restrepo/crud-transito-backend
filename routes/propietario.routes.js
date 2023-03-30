const {Router} = require("express");
const router = Router();

const propietarioController = require("../controllers/propietario.controller");

router.get("/", async (req, res, next) => {
    try {
        const result = await propietarioController.getAll();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const result = await propietarioController.create(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
