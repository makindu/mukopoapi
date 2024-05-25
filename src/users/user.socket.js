const { user } = require("../../db.provider");
const bcript = require("bcrypt");

const UserSocket = async (io) => {
    io.on("create_user", async (data) => {

        if (!data.fullname || !data.phone) {
            io.emit("create_user_error", {
                message: "fullname or phone required",
                error: null,
                data: null
            });
        }

        try {

            if (data.password) {
                data.password = bcript.hashSync(data.password, 10);
            }
            const result = await user.create(data);
            io.emit("create_user", {
                status: 200,
                message: "success",
                error: null,
                data: result
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