const mongoose = require("mongoose");
const schema = require("mongoose").Schema;

const companyaccountSchema = new schema({
    description: {
        type: String,
    },
    money: {
        type: String,
        required: true
    },
    sold: {
        type: Number,
        default: 0,
        required: true
    },
});

module.exports = mongoose.model("companyaccounts", companyaccountSchema);