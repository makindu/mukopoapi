const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { user, account } = require("../../db.provider");
const bcript = require("bcrypt");
const generatePrefixedUUID = require("../../src/helper/uuid");

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
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (data.password) {
                data.password = bcript.hashSync(data.password, 10);
            }
            data.uuid = generatePrefixedUUID('M');
            let result = await user.create(data);
            if (result.email != null || result.email != '' && emailRegex.test(result.email)) {
                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com', // Votre serveur SMTP
                    port: 587, // Port SMTP
                    secure: false, // true pour le port 465, false pour les autres ports
                    auth: {
                        user: 'wekaakibac@gmail.com', // Votre adresse e-mail
                        pass: 'wekaakiba2024' // Votre mot de passe
                    },
                    tls: {
                        rejectUnauthorized: true,
                        minVersion: "TLSv1.2"
                    }
                });

                // Définir les options de l'e-mail
                const mailOptions = {
                    from: 'wekaakibac@gmail.com', // Adresse de l'expéditeur
                    to: result.email.trim(), // Adresse du destinataire
                    subject: 'Creation compte Akiba', // Sujet de l'e-mail
                    text: 'This is a test email sent from Nodemailer', // Contenu textuel de l'e-mail
                    html: '<p>This is a test email sent from <b>Nodemailer</b></p>' // Contenu HTML de l'e-mail
                };

                try {
                    // Envoyer l'e-mail
                    await transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('E-mail sent: ' + info.response);
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
                        member_id: result._id,
                        money_id: "CDF",
                        sold: 0

                    },
                    {
                        code: "GOM-USD" + result._id,
                        member_id: result._id,
                        money_id: "USD",
                        sold: 0
                    },
                );
                result = {
                    ...result.toObject(),
                    accounts: accounts
                };
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