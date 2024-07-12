const { notebook, companyaccountsHistorys, componyaccounts } = require("../../../db.provider");
const { generatePrefixedUUID, generateRandomString } = require("../../helper/uuid");
// const {companyaccountHistoryControllerr} = require("../companyaccountHistory/companyaccountHistory.controller");
const NotebooksController = {};

NotebooksController.getAll = async (req, res) => {
    try {
        const notebooks = await notebook.find({});
        res.status(200).send({
            message: 'success',
            error: null,
            data: notebooks,
        });
    } catch (error) {
        res.status().send({
            message: "error occured",
            error: error,
            data: [],
        });
    }
}
NotebooksController.create = async (req, res) => {
    if (!req.body.member_id ||
        !req.body.nature_id ||
        !req.body.account_id ||
        !req.body.type_id ||
        !req.body.created_by ||
        !req.body.bringby ||
        !req.body.money_id ||
        !req.body.amount) {
        return res.status(400).send({
            message: "Complete all required fields then continue",
            error: null,
            data: null,
        });
    }
    if (!req.body.uuid) {
        req.body.uuid = generatePrefixedUUID('NB')
    }

    try {
        const result = await notebook.create(req.body);
        if (result) {

            if (result.created_by.type == 'sensibilisator' || result.type == 'cashier') {
                var creation_status = 'pending';
            }

            if (result.created_by.type == 'manager') {
                let existingAccount = await componyaccounts.findOne({ money: result.money_id });

                let newSold = result.amount;
                if (existingAccount) {
                    newSold += existingAccount.sold;
                }
                var creation_status = 'validated';
                let companyaccount = {
                    sold: newSold,
                };
                await componyaccounts.findByIdAndUpdate(existingAccount._id, companyaccount);
            }

            let companyaccountsHistory = {
                uuid: generatePrefixedUUID('CAH'),
                operation: result._id,
                money_id: result.money_id,
                type_operation: 'created_book',
                amount: result.amount,
                done_by: result.created_by,
                done_at: result.done_at,
                mouvment: 'entry',
                creation_status: creation_status,
                valideted_by: ''
            }


            await companyaccountsHistorys.create(companyaccountsHistory);
            return res.status(200).send({
                message: "Success",
                error: null,
                data: result,
            });
        }
    } catch (error) {
        return res.status(500).send({
            message: "Error occurred",
            error: error.message,
            data: null,
        });
    }
};


NotebooksController.getSingleNetbook = async (req, res) => {
    if (!req.params.id) {
        res.status().send({
            message: "error",
            error: "No data found",
            data: null,
        });
        return;
    }
    try {
        const data = await notebook.findById(req.params.id);
        res.status(200).send({
            message: "success",
            error: null,
            data: data,
        });
    } catch (error) {
        res.status(500).send({
            message: "error occured",
            error: error,
            data: null
        })
    }
}

NotebooksController.updataNotebook = async (req, res) => {
    if (!req.params.id) {

        res.status(400).send({
            message: "error",
            error: "any ID provided",
            data: null,
        });
        return;
    }
    try {
        let result = await notebook.findByIdAndUpdate(req.params.id, req.body);
        if (!result) {
            res.status(404).send({
                message: "not found",
                error: null,
                data: null
            });

        }
        res.status(200).send({
            message: "success",
            error: null,
            data: await notebook.findById(req.params.id)

        });

    } catch (error) {
        res.status(200).send({
            message: "error",
            error: error,
            data: null
        });
    }
}
NotebooksController.deleteNotebook = async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "error",
            error: "any ID provided",
            data: null
        });
        return;
    }
    try {
        let result = await notebook.findByIdAndDelete(req.params.id);
        if (!result) {
            res.status(404).send({
                message: "not found",
                error: null,
                data: null

            });
            res.status(200).send({
                message: "success",
                error: null,
                data: result

            });
        }
    } catch (error) {
        res.status(200).send({
            message: "error",
            error: error,
            data: null

        });
    }
};

NotebooksController.getFilteredNotebooks = async (req, res) => {
    // const { member_id } = req.query;

    try {
        const notebooks = await notebook.find({
            $where: function () {
                return this.member_id == "13"
            }
        });

        return res.status(200).send({
            message: "success",
            error: null,
            data: notebooks,
        });
    } catch (error) {
        return res.status(500).send({
            message: "Error occurred",
            error: error.message,
            data: null,
        });
    }
};

module.exports = NotebooksController;