const {account } = require("../../../db.provider");

const AccountSocket = async (io) => {

    io.on("create_account", async (data) => {
        console.log("inside account socket");
        if (!data.member_id) {
            io.emit("create_account", {
                message: "fields required",
                error: null,
                data: null
            });
        }

        try {
            let result=[];
            if (data.criteria==="all") {
                result = await account.create(
                    {
                        code: "XCDF-D" + data.member_id,
                        member_id: data.member_id,
                        money_id: "CDF",
                        sold: 0
                    },
                    {
                        code: "XUSD-D" + data.member_id,
                        member_id: data.member_id,
                        money_id: "USD",
                        sold: 0
                    },
                );
            }
            
            if (data.criteria==="CDF") {
                const response = await account.create(
                    {
                        code: "XCDF-D" + data.member_id,
                        member_id: data.member_id,
                        money_id: "CDF",
                        sold: 0
                    }
                );

                result.push(response);
            }   
            
            if (data.criteria==="USD") {
                const response = await account.create(
                    {
                        code: "XUSD-D" + data.member_id,
                        member_id: data.member_id,
                        money_id: "USD",
                        sold: 0
                    });

                result.push(response);
            }

            io.emit("create_account", {
                status: 200,
                message: "success",
                error: null,
                data: result
            });

        } catch (error) {
            console.log(error);
            io.emit("create_account", {
                status: 500,
                message: "error occured",
                error: error,
                data: null
            });
        }
    });

    io.on("delete_account", async (data) => {
        try {
            if (!data.id) {
                io.emit("delete_account", {
                    message: "id required",
                    error: null,
                    data: null,
                });
                return;
            }
            let result = await user.findByIdAndDelete(data._id);
            if (!result) {
                res.status(404).send({
                    message: "not found",
                    error: null,
                    data: null
                });
                return;
            }
            io.emit("delete_user", {
                status: 200,
                message: "success",
                data: null,
                error: null,
            })

        } catch (error) {
            io.emit("delete_use", {
                status: 500,
                message: "error occured",
                error: error,
                data: null
            })
        }

    });

    io.on("update_account", async (data) => {
        console.log("socket for updating");
        if (!data._id) {
            io.emit("update_account", {
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
            console.log("account updated");
            io.emit("update_account", {
                status: 200,
                message: "success",
                error: null,
                data: await user.findById(data._id)
            });
        } catch (error) {
            console.log(error);
            io.emit("create_account", {
                status: 500,
                message: "error occured",
                error: error,
                data: null
            });
        }
    });

    io.on("get_all_accounts", async () => {
        try {
            const users = await accound.find({});
            io.emit("get_all_accounts", {
                status: 200,
                message: "success",
                error: null,
                data: users
            }


            );
        } catch (error) {

            io.emit("get_all_accounts", {
                status: 500,
                message: "error",
                error: error,
                data: null
            });
        }

    })



};

module.exports = AccountSocket;