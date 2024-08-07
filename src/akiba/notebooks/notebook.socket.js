const { notebook } = require('../../../db.provider');
const creatingNotebook = require('./methods');

const NoteBookWebSocket = async (io) => {
    io.on("create_notebook", async (data) => {

        if (!data.member ||
            !data.nature_id ||
            !data.account_id ||
            !data.type_id ||
            !data.created_by ||
            !data.bringby ||
            !data.money ||
            !data.amount) {
            console.log('error');
            io.emit("create_notebook", {
                message: "error occured",
                error: null,
                data: null
            });
        }


        try {
            console.log('created begeen');
            const result = await creatingNotebook(data);
            console.log('created pass');
            console.log(result);
            if (result.message == 'success') {

                console.log('created');
                return io.emit("create_notebook", {
                    message: "success",
                    error: null,
                    data: result.data
                })
            }
            else {
                console.log('message error');
                return io.emit("create_notebook", {
                    message: "error occured",
                    error: null,
                    data: result.error
                })
            }

        } catch (error) {
            console.log(error)
            io.emit("create_notebook", {
                message: "error occured",
                error: error,
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


