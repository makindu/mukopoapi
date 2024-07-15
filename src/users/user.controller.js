const { user, account, notebook } = require("../../db.provider");
const bcript = require("bcrypt");
const UserController = {};
const { generatePrefixedUUID, generateRandomString } = require("../../src/helper/uuid");
const { emailing, findHtmlFile } = require("../helper/mail_sender");

UserController.AttachAccount = async (userId) => {
  const accounts = await account.find({ member: userId });
  const accountswithnotbooks = await Promise.all(accounts.map(async (element) => {
    const account = await UserController.AccountNotebooks(element._id);
    return {
      ...element.toObject(),
      notebooks: account
    };
  }));

  return accountswithnotbooks;
};

UserController.getAll = async (req, res) => {
  try {
    const users = await user.find({});

    const usersWithAccounts = await Promise.all(users.map(async (element) => {
      const accounts = await UserController.AttachAccount(element._id);
      return {
        ...element.toObject(),
        accounts: accounts
      };
    }));

    res.status(200).send({
      message: "success",
      error: null,
      data: usersWithAccounts
    });
  } catch (error) {
    return res.status(500).send({
      message: "error occurred",
      error: error,
      data: []
    });
  }
};


UserController.create = async (req, res) => {
  if (!req.body.fullname || !req.body.phone || !req.body.done_at) {
    res
      .status(400)
      .send({
        message: "fullname or phone required",
        error: null,
        data: null
      });
  }




  try {
    // Vérifier si l'utilisateur existe déjà
    // const existingUsermail = await user.findOne({
    //   $or: [
    //     { email: req.body.email },

    //   ]
    // });
    // const existingUserphone = await user.findOne({
    //   $or: [
    //     { phone: req.body.phone },


    //   ]
    // });
    // const existingUserfullname = await user.findOne({
    //   $or: [
    //     { fullname: req.body.fullname },


    //   ]
    // });

    // if (existingUsermail) {
    //   return res.status(500).send({
    //     message: "cet email existe déjà",
    //     error: 'mail_exist',
    //     data: null
    //   });

    // }
    // if (existingUserphone) {
    //   return res.status(500).send({
    //     message: "ce numero de téléphone existe déjà",
    //     error: 'phone_exist',
    //     data: null
    //   });
    // }
    // if (existingUserfullname) {
    //   return res.status(500).send({
    //     message: "ce nom existe déjà",
    //     error: 'naame_exist',
    //     data: null
    //   });
    // }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var passowrd = req.body.password;
    if (req.body.password) {
      req.body.password = bcript.hashSync(req.body.password, 10);
    }
    req.body.uuid = generatePrefixedUUID('M');
    let result = await user.create(req.body);
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
          sold: 0

        },
        {
          code: "GOM-USD" + result._id,
          member: result._id,
          money: "USD",
          sold: 0
        },
      );
      let resultdata = {
        ...result.toObject(),
        accounts: accounts
      };
      return res.status(200).send({
        message: "success",
        error: null,
        data: resultdata
      });
    }

  } catch (error) {
    console.error('Error creating user or accounts:', error);
    return res
      .status(500)
      .send({
        message: "error occured",
        error: error,
        data: null
      });
  }
}
UserController.mailSender = async (req, res) => {
  if (!req.body.mail) {
    res
      .status(400)
      .send({
        message: "fullname or phone required",
        error: null,
        data: null
      });
  }

  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (req.body.email != null || req.body.email != '' && emailRegex.test(req.body.email)) {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // Votre serveur SMTP
        port: 587, // Port SMTP
        secure: false, // true pour le port 465, false pour les autres ports
        auth: {
          user: 'wekaakibac@gmail.com', // Votre adresse e-mail
          pass: 'svpi sjzp rjsz pvtm' // Votre mot de passe
        },
        tls: {
          rejectUnauthorized: true,
          minVersion: "TLSv1.2"
        }
      });

      // Définir les options de l'e-mail
      const mailOptions = {
        from: 'wekaakibac@gmail.com', // Adresse de l'expéditeur
        to: req.body.email, // Adresse du destinataire
        subject: 'Creation compte Akiba', // Sujet de l'e-mail
        text: 'This is a test email sent from Nodemailer', // Contenu textuel de l'e-mail
        html: '<p>This is a test email sent from <b>Nodemailer</b></p>' // Contenu HTML de l'e-mail
      };

      try {
        // Envoyer l'e-mail
        var result = await transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log('E-mail sent: ' + info.response);
        });
      } catch (error) {
        console.log(error);
      }

      return res.status(200).send({
        message: "successsssssssssss",
        error: 'data',
        data: 'res'
      });
    }
  } catch (error) {
    return res
      .status(500)
      .send({
        message: "error occured",
        error: error,
        data: null
      });
  }
}

UserController.getSingleUser = async (req, res) => {

  if (!req.params.id) {
    res
      .status(400)
      .send({ message: "error", error: "No data found", data: null });
    return;
  }
  try {
    const data = await user.findById(req.params.id);
    res.status(200).send({ message: "success", error: null, data: data });
  } catch (error) {
    res
      .status(400)
      .send({ message: "error occured", error: error, data: null });
  }
};

UserController.updateUser = async (req, res) => {
  if (!req.params.id) {
    res
      .status(400)
      .send({ message: "error", error: "any ID provided", data: null });
    return;
  }

  try {
    if (req.body.password) {
      req.body.password = bcript.hashSync(req.body.password, 10);
    }
    let result = await user.findByIdAndUpdate(req.params.id, req.body);
    if (!result) {
      res.status(404).send({
        message: "not found",
        error: null,
        data: null
      });
    }
    res.status(200).send({
      message: "success",
      error: null,
      data: await user.findById(req.params.id)
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "error", error: error, data: null });
  }
};

UserController.deleteUser = async (req, res) => {
  if (!req.params.id) {
    res
      .status(400)
      .send({ message: "error", error: "any ID provided", data: null });
    return;
  }

  try {

    let result = await user.findByIdAndDelete(req.params.id);
    if (!result) {
      res.status(404).send({
        message: "not found",
        error: null,
        data: null
      });
    }
    res.status(200).send({
      message: "success",
      error: null,
      data: result
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "error", error: error, data: null });
  }
};

UserController.login = async (res, req) => {
  try {
    const result = await user.findUser(req.body.phone, req.body.password);
    res.status(200).send({
      message: "success",
      error: null,
      data: result
    });
  } catch (error) {
    res
      .status(400)
      .send({ message: "error", error: error, data: null });
  }
};

UserController.AccountNotebooks = async (account_id) => {
  return await notebook.find({ account_id: account_id });
}
module.exports = UserController;