const AkibaHistoryController = require("./akibahistory.controller");
const router = require("express").Router();

router.get("/all",AkibaHistoryController.getAll);
router.get("/:id",AkibaHistoryController.getSingle);
router.post("/",AkibaHistoryController.create);
router.put("/:id", AkibaHistoryController.update);
router.delete("/:id", AkibaHistoryController.delete);

module.exports = router;