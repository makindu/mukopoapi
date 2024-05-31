const { user, account } = require("../../db.provider");
const bcript = require("bcrypt");

const UserSocket = async (io) => {
    io.on("create_user", async (data) => {

        if (!data.fullname || !data.phone) {
            io.emit("create_user", {
                message: "fullname or phone required",
                error: null,
                data: null
            });
        }

        try {

            if (data.password) {
                data.password = bcript.hashSync(data.password, 10);
            }
            let result = await user.create(data);
            if (result) {

                //creating accounts for the User
                const accounts = await account.create(
                    {
                        code: "XCDF-D" + result._id,
                        member_id: result._id,
                        money_id: "CDF",
                        sold: 0

                    },
                    {
                        code: "XUSD-D" + result._id,
                        member_id: result._id,
                        money_id: "USD",
                        sold: 0
                    },
                );
                result = {
                    accounts: accounts, ...result,

                }
                io.emit("create_user", {
                    status: 200,
                    message: "success",
                    error: null,
                    data: result
                });






            }

        } catch (error) {
            console.log(error);
            io.emit("create_user", {
                status: 500,
                message: "error occured",
                error: error,
                data: null
            });
        }
    });
    io.on("delete_user", async (data) => {
        try {
            if (!data.id) {
                io.emit("delete_user", {
                    message: "id required",
                    error: null,
                    data: [],
                });
                let result = await user.findByIdAndDelete(data._id);
                if (!result) {
                    res.status(404).send({
                        message: "not found",
                        error: null,
                        data: null
                    });
                }
                io.emit("delete_user", {
                    status: 200,
                    message: "success",
                    data: null,
                    error: null,
                })
            }
        } catch (error) {
            io.emit("delete_use", {
                status: 500,
                message: "error occured",
                error: error,
                data: null
            })
        }

    })

    io.on("update_user", async (data) => {
        console.log("socket for updating");
        if (!data._id) {
            io.emit("update_user", {
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
            //updating User
            if (!result) {
                res.status(404).send({
                    message: "not found",
                    error: null,
                    data: null
                });
            }
            console.log("user updated");
            io.emit("update_user", {
                status: 200,
                message: "success",
                error: null,
                data: await user.findById(data._id)
            });
        } catch (error) {
            console.log(error);
            io.emit("create_user", {
                status: 500,
                message: "error occured",
                error: error,
                data: null
            });
        }
    });

    io.on("get_all_users", async () => {
        try {
            const users = await user.find({});
            io.emit("get_all_users", {
                status: 200,
                message: "success",
                error: null,
                data: users
            }


            );
        } catch (error) {

            io.emit("get_all_users_error", {
                status: 200,
                message: "success",
                error: error,
                data: []
            });
        }

    })



};

module.exports = UserSocket;