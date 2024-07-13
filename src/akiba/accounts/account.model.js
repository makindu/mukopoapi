const mongoose = require("mongoose");
const schema = require("mongoose").Schema;

const accountSchema = new schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    member: {
        type: String,
        required: true
    },
    money: {
        type: String,
        required: true
    },
    sold: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("accounts", accountSchema);