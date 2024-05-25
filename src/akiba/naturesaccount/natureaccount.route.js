const AccountNatureController = require("./natureaccount.controller");
const router = require("express").Router();

router.get("/all",AccountNatureController.getAll);
router.get("/:id",AccountNatureController.getSingle);
router.post("/",AccountNatureController.create);
router.put("/:id", AccountNatureController.update);
router.delete("/:id", AccountNatureController.delete);

module.exports = router;