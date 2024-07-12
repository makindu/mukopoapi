const { companyaccount } = require("../../../db.provider");

const companyaccountSocket = async (io) => {

    io.on("create_cn_account", async (data) => {
        if (!data.code && !data.manager) {
            io.emit("create_cn_companyaccount", {
                message: "fields required",
                error: null,
                data: null
            });
        }
        try {
            let result = await companyaccount.create(
                {
                    code: "AKIBA-CDF",
                    manager: data.manager,
                    money_id: "CDF",
                    sold: 0
                },
                {
                    code: "AKIBA-USD",
                    manager: data.manager,
                    money_id: "USD",
                    sold: 0
                },
            );

            io.emit("create_cn_companyaccount", {
                status: 200,
                message: "success",
                error: null,
                data: result
            });

        } catch (error) {
            console.log(error);
            io.emit("create_cn_companyaccount", {
                status: 500,
                message: "error occured",
                error: error,
                data: null
            });
        }
    });


    io.on("update_companyaccount", async (data) => {
        console.log("socket for updating");
        if (!data._id) {
            io.emit("update_companyaccount", {
                message: "id required",
                error: null,
                data: null
            });
        }

        try {

            if (data.password) {
                data.password = bcript.hashSync(data.password, 10);
            }

            let result = await user.findByIdAndUpdate(data._id, data.data);
            if (!result) {
                res.status(404).send({
                    message: "not found",
                    error: null,
                    data: null
                });
            }
            console.log("companyaccount updated");
            io.emit("update_companyaccount", {
                status: 200,
                message: "success",
                error: null,
                data: await user.findById(data._id)
            });
        } catch (error) {
            console.log(error);
            io.emit("create_cn_companyaccount", {
                status: 500,
                message: "error occured",
                error: error,
                data: null
            });
        }
    });

    io.on("get_all_companyaccounts", async () => {
        try {
            const users = await accound.find({});
            io.emit("get_all_companyaccounts", {
                status: 200,
                message: "success",
                error: null,
                data: users
            }
            );
        } catch (error) {

            io.emit("get_all_companyaccounts", {
                status: 500,
                message: "error",
                error: error,
                data: null
            });
        }

    })



};

module.exports = companyaccountSocket;