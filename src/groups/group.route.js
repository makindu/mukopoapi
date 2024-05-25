const GroupController = require("./group.controller");
const router = require("express").Router();

router.get("/all",GroupController.getAll);
router.get("/:id",GroupController.getSinglegroup);
router.post("/",GroupController.create);
router.put("/:id", GroupController.updategroup);
router.delete("/:id", GroupController.deletegroup);

module.exports = router;