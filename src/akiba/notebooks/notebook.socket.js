const { notebook, companyaccountsHistorys, componyaccounts } = require("../../../db.provider");
const { generatePrefixedUUID, generateRandomString } = require("../../helper/uuid");

const NoteBookWebSocket = async (io) => {
    io.on("create_notebook", async (data) => {
        console.log('note book creation mode',data);
        if (!data.member ||
            !data.nature_id ||
            !data.account_id ||
            !data.type_id ||
            !data.created_by ||
            !data.bringby ||
            !data.money ||
            !data.amount) {
            io.emit("create_notebook", {
                message: "error occured",
                error: null,
                data: null
            });
        }

       
        try {
            if (!data.uuid) {
                data.uuid = generatePrefixedUUID('NB')
            }
            console.log('note book created',data);
            const result = await notebook.create(data);
            if (result) {
                // console.log('result type',result.created_by.type);
                let creation_status = 'pending';

                if (data.created_by.type === 'sensibilisator' || data.created_by.type == 'cashier') {
                    creation_status = 'pending';
                }

                if (data.created_by.type == 'manager') {
                    let existingAccount = await componyaccounts.findOne({ money: result.money });
                    console.log('tub finded',existingAccount);
                    let newSold = result.amount;
                    if (existingAccount) {
                        newSold += existingAccount.sold;
                    }
                    creation_status = 'validated';
                    let companyaccount = {
                        sold: newSold,
                    };
                    await componyaccounts.findByIdAndUpdate(existingAccount._id, companyaccount);
                }

                let companyaccountsHistory = {
                    uuid: generatePrefixedUUID('CAH'),
                    operation: data.operation,
                    money: result.money,
                    type_operation: 'created_book',
                    amount: result.amount,
                    done_by: result.created_by,
                    done_at: result.done_at,
                    mouvment: 'entry',
                    creation_status: creation_status,
                    validated_by: result.created_by
                }
                // console.log(companyaccountsHistory);


                await companyaccountsHistorys.create(companyaccountsHistory);
                io.emit("create_notebook", {
                    message: "success",
                    error: null,
                    data: result,
                });
            }
        } catch (error) {
            // console.log(error)
            io.emit("create_notebook", {
                message: "error occured",
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


