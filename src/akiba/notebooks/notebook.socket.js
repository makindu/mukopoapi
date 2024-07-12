const { notebook, companyaccountsHistorys, componyaccounts } = require("../../../db.provider");
const { generatePrefixedUUID, generateRandomString } = require("../../helper/uuid");

const NoteBookWebSocket = async (io) => {
    io.on("create_notebook", async (data) => {

        if (!req.body.member_id ||
            !req.body.nature_id ||
            !req.body.account_id ||
            !req.body.type_id ||
            !req.body.created_by ||
            !req.body.bringby ||
            !req.body.money_id ||
            !req.body.amount) {
            io.emit("create_notebook", {
                message: "error occured",
                error: null,
                data: null
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
            io.emit("create_notebook", {
                message: "error ocured",
                error: null,
                data: null
            })
        }
    });

    io.on("delete_notebook", async (data) => {
        try {
            if (!data.id) {
                io.emit("delete_notebook", {
                    message: "id required",
                    error: null,
                    data: null
                });
                return;
            }
            let result = await notebook.findOneAndDelete(data._id);
            if (!result) {
                res.status(404).send({
                    message: "not found",
                    error: null,
                    data: null
                });
                return;
            }
            io.emit("delete_notebook", {
                status: 200,
                message: "success",
                error: null,
                data: result,
            })
        } catch (error) {
            io.emit("delete_notebook", {
                status: 500,
                message: "error occured",
                data: null,
                error: error.message,
            })
        }
    })

    io.on("update_notebook", async (data) => {
        try {
            if (!data._id) {
                io.emit("update_notebook", {
                    message: "id required",
                    error: null,
                    data: null
                });
                return;
            }
            let result = await notebook.findOneAndUpdate(data._id);
            if (!result) {
                res.status(404).send({
                    message: "not found",
                    error: null,
                    data: null
                });
                return;
            }
            io.emit("update_notebook", {
                status: 200,
                message: "success",
                error: null,
                data: result
            })
        } catch (error) {
            io.emit("update_notebook", {
                status: 500,
                message: "error occured",
                error: error,
                data: null
            })
        }

    });

    io.on("get_all_notebook", async () => {
        try {
            const books = await notebook.find({})
            io.emit("notebget_all_notebookook", {
                status: 200,
                message: "sucess",
                error: null,
                data: books
            })
        } catch (error) {
            io.emit("get_all_notebook", {
                status: 500,
                message: "error",
                error: error,
                data: null
            })
        }
    });
};
module.exports = NoteBookWebSocket;


