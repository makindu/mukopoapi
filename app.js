require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const http = require("http");

const server = http.createServer(app);
const IO = require("socket.io")(server, { cors: { origin: "*" } });
const UserSocket = require("./src/users/user.socket");
const NoteBookWebSocket = require("./src/akiba/notebooks/notebook.socket");
const AccountsSocket = require("./src/akiba/accounts/account.socket");
const NotebookOperationSocket = require("./src/akiba/history/history.socket");
const companyaccountSocket = require("./src/akiba/companyaccounts/company.socket");


app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use("/api", require("./index.route"));

IO.on("connection", (socket) => {
    socket.emit("welcome", { message: "welcome to cero likelemba socket" });
    console.log("new user conntected");
    UserSocket(socket);
    NoteBookWebSocket(socket);
    AccountsSocket(socket);
    NotebookOperationSocket(socket);
    companyaccountSocket(socket);
});


mongoose.connect(process.env.MONGO_URL, {}).then((result) => {
    console.log("database connected");
    server.listen(3000);
    console.log("App lunched at 3000");
}

).catch((err) => {
    console.log(err);
    console.log("Erreur lors de la connexion avec la base de donnees.");
    process.exit(-1);
});

