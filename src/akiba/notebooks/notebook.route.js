const NotebooksController = require("./notebook.controller");
const router = require("express").Router();

router.get("/all", NotebooksController.getAll);
router.get("/:id", NotebooksController.getSingleNetbook);
router.get("/user/:member_id", NotebooksController.getFilteredNotebooks);
router.post("/", NotebooksController.create);
router.put("/:id", NotebooksController.updataNotebook);
router.delete("/:id", NotebooksController.deleteNotebook);
module.exports = router;
