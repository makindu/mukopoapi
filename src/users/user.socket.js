const bcrypt = require('bcrypt');
const { user, account } = require("../../db.provider");
const bcript = require("bcrypt");
const path = require('path');
const { generatePrefixedUUID, generateRandomString } = require("../../src/helper/uuid");
const { emailing, findHtmlFile } = require("../helper/mail_sender");
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
            // Vérifier si l'utilisateur existe déjà
            // const existingUsermail = await user.findOne({
            //     $or: [
            //         { email: data.email },

            //     ]
            // });
            // const existingUserphone = await user.findOne({
            //     $or: [
            //         { phone: data.phone },


            //     ]
            // });
            // const existingUserfullname = await user.findOne({
            //     $or: [
            //         { fullname: data.fullname },


            //     ]
            // });

            // if (existingUsermail) {
            //     return io.emit("create_user", {
            //         message: "diplicated email",
            //         error: null,
            //         data: null
            //     });
            // }
            // if (existingUserphone) {
            //     return io.emit("create_user", {
            //         message: "diplicated phone",
            //         error: null,
            //         data: null
            //     });
            // }
            // if (existingUserfullname) {
            //     return io.emit("create_user", {
            //         message: "diplicated fullname",
            //         error: null,
            //         data: null
            //     });
            // }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            var passowrd = data.password;
            if (data.password) {
                data.password = bcript.hashSync(data.password, 10);
            }
            data.uuid = generatePrefixedUUID('M');
            let result = await user.create(data);
            if (typeof result.email !== null && emailRegex.test(result.email)) {
                try {
                    // Chemin de départ pour la recherche
                    const baseDirectory = path.join(__dirname, '../helper/mailHtml');
                    const fileName = 'welcome.html';

                    // Chercher et envoyer l'email
                    findHtmlFile(baseDirectory, fileName, async (err, filePath) => {
                        if (err) {
                            console.error('Erreur lors de la recherche du fichier HTML :', err);
                        } else if (filePath) {
                            const replacements = {
                                username: result.fullname,
                                password: passowrd,
                            };
                            await emailing(result.email, "BIENVENUE SUR WEKA AKIBA", filePath, replacements, '');
                        } else {
                            console.log('Fichier HTML non trouvé');
                        }
                    });

                } catch (error) {
                    console.log(error);
                }
            }
            if (result) {

                //creating accounts for the User
                const accounts = await account.create(
                    {
                        code: "GOM-CDF" + result._id,
                        member: result._id,
                        money: "CDF",
                        sold: 0,

                    },
                    {
                        code: "GOM-USD" + result._id,
                        member: result._id,
                        money: "USD",
                        sold: 0,
                    },
                );
                let resultdata = {
                    ...result.toObject(),
                    accounts: accounts
                };
                io.emit("create_user", {
                    status: 200,
                    message: "success",
                    error: null,
                    data: resultdata
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
                status: 500,
                message: "error",
                error: error,
                data: null
            });
        }

    })



};

module.exports = UserSocket;