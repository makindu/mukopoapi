const {notebookoperation} = require("../../../db.provider");

const NotebookOperationSocket = async (io) => {
    io.on("new_notebook_operation", async (data) => {

        try {

            let result = await notebookoperation.create(data);
            if (result) {
                io.emit("new_notebook_operation", {
                    status: 200,
                    message: "success",
                    error: null,
                    data: result
                });
            }

        } catch (error) {
            console.log(error);
            io.emit("new_notebook_operation", {
                status: 500,
                message: "error occured",
                error: error,
                data: null
            });
        }
    });
};

module.exports =NotebookOperationSocket;