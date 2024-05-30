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
            //creating accounts for the User
            
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


    io.on("update_user", async (data) => {
        console.log("socket for updating");
        if (!data._id) {
            io.emit("update_user_error", {
                message: "id required",
                error: null,
                data: null
            });
        }

        try {

            if (data.password) {
                data.password = bcript.hashSync(data.password, 10);
            }

            let result = await user.findByIdAndUpdate(data._id,data.data);
            //updating User
            if (!result) {
                res.status(404).send({ 
                    message: "not found", 
                    error: null, 
                    data:null
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