const TeamController = require("./team.controller");
const router = require("express").Router();

router.get("/all",TeamController.getAll);
router.get("/:id",TeamController.getSingle);
router.post("/",TeamController.create);
router.put("/:id", TeamController.update);
router.delete("/:id", TeamController.delete);

module.exports = router;