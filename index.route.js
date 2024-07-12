const router = require("express").Router();

router.use("/users", require("./src/users/user.route"));
router.use("/groups", require("./src/groups/group.route"));
router.use("/teams", require("./src/akiba/teams/team.route"));
router.use("/accounts", require("./src/akiba/accounts/account.route"));
router.use("/agencies", require("./src/akiba/agences/agence.route"));
router.use("/moneys", require("./src/akiba/moneys/money.route"));
router.use("/accountnatures", require("./src/akiba/naturesaccount/natureaccount.route"));
router.use("/accountstypes", require("./src/akiba/typesaccount/typeaccount.route"));
router.use("/notebook", require("./src/akiba/notebooks/notebook.route"));
router.use("/companyaccounts", require("./src/akiba/companyaccounts/companyaccount.route"));
router.use("/companyaccountsHistory", require("./src/akiba/companyaccountHistory/companyaccountHistory.route"));
module.exports = router;