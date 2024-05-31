let database = {};
database.user = require("./src/users/user.model");
database.group= require("./src/groups/group.model");
database.team= require("./src/akiba/teams/team.model");
database.account= require("./src/akiba/accounts/account.model");
database.agency= require("./src/akiba/agences/agence.model");
database.money= require("./src/akiba/moneys/money.model");
database.agencymember= require("./src/akiba/agencemembers/agencemember.model");
database.accountnature= require("./src/akiba/naturesaccount/natureaccount.model");
database.typeaccount= require("./src/akiba/typesaccount/typeaccount.model");
module.exports = database;