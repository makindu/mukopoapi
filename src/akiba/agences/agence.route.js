const AgencyController = require("./agence.controller");
const router = require("express").Router();

router.get("/all",AgencyController.getAll);
router.get("/:id",AgencyController.getSingle);
router.post("/",AgencyController.create);
router.put("/:id", AgencyController.update);
router.delete("/:id", AgencyController.delete);

module.exports = router;