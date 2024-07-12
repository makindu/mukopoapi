const companyaccountHistoryHistory = require("./companyaccountHistory.controller");
const router = require("express").Router();

router.get("/all", companyaccountHistoryHistory.getAll);
router.get("/:id", companyaccountHistoryHistory.getSingle);
router.post("/", companyaccountHistoryHistory.create);
router.put("/:id", companyaccountHistoryHistory.update);
router.delete("/:id", companyaccountHistoryHistory.delete);

module.exports = router;