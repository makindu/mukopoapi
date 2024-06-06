const {akibahistory } = require("../../../db.provider");

const AkibaHistorySocket = async (io) => {

    io.on("create_akibahistory", async (data) => {
    
        try {

            const result = await akibahistory.create(data);
            io.emit("create_akibahistory", {
                status: 200,
                message: "success",
                error: null,
                data: result
            });

        } catch (error) {
            console.log(error);
            io.emit("create_akibahistory", {
                status: 500,
                message: "error occured",
                error: error,
                data: null
            });
        }
    });

    io.on("delete_akibahistory", async (data) => {
        try {
            if (!data.id) {
                io.emit("delete_akibahistory", {
                    message: "id required",
                    error: null,
                    data: null,
                });
                return;
            }
            let result = await akibahistory.findByIdAndDelete(data._id);
            if (!result) {
                res.status(404).send({
                    message: "not found",
                    error: null,
                    data: null
                });
                return;
            }
            io.emit("delete_akibahistory", {
                status: 200,
                message: "success",
                data: null,
                error: null,
            });

        } catch (error) {
            io.emit("delete_akibahistory", {
                status: 500,
                message: "error occured",
                error: error,
                data: null
            });
        }

    });

    io.on("update_akibahistory", async (data) => {
        console.log("socket for updating");
        if (!data._id) {
            io.emit("update_akibahistory", {
                message: "id required",
                error: null,
                data: null
            });
        }

        try {

            let result = await akibahistory.findByIdAndUpdate(data._id, data.data);
            //updating User
            if (!result) {
                res.status(404).send({
                    message: "not found",
                    error: null,
                    data: null
                });
            }
           
            io.emit("update_akibahistory", {
                status: 200,
                message: "success",
                error: null,
                data: await akibahistory.findById(data._id)
            });
        } catch (error) {
            io.emit("update_akibahistory", {
                status: 500,
                message: "error occured",
                error: error,
                data: null
            });
        }
    });

    io.on("get_all_akibahistories", async () => {
        try {
            const data = await akibahistory.find({});
            io.emit("get_all_akibahistories", {
                status: 200,
                message: "success",
                error: null,
                data: data
            });
        } catch (error) {

            io.emit("get_all_akibahistories", {
                status: 500,
                message: "error",
                error: error,
                data: null
            });
        }
    })
};

module.exports = AkibaHistorySocket;