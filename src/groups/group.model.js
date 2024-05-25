const mongoose = require("mongoose");
const schema = require("mongoose").Schema;
const bcrypt = require('bcrypt');

const groupSchema = new schema({
    fullname:{
        type: String,
        required :[true,"please provide a full name"],
        unique:true
    },
    description:{
        type:String,
        required:false
    },
    type:{
        type:String,
        default:"public"
    },
    createdby:{
        type:String,
       required:true
    },
    currency:{
        type:String,
        default:"CDF",
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    paymentdeadline:{
        type:String,
        default:"month"
    },
    hasmembershipfee:{
        type:Boolean,
        required:false
    } ,
    membershipfee:{
        type:Number,
        required:false
    },
    hasaffiliationfee:{
        type:Boolean,
        required:false
    } ,
    affiliationfee:{
        type:Number,
        required:false
    },
    affiliationtype:{
        type:String,
        required:false
    },
    affiliationpercent:{
        type:Number,
        required:false
    }
});

module.exports = mongoose.model("groups",groupSchema);