const mongoose = require("mongoose");
const schema = require("mongoose").Schema;
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const generatePrefixedUUID = require("../../src/helper/uuid");
// const validator = require('validator');

const userSchema = new schema({
    uuid: {
        type: String,
        // default: generatePrefixedUUID('M'),
        unique: true
    },
    fullname: {
        type: String,
        required: [true, "please provide a full name"],
        unique: true
    },
    phone: {
        type: String,
        required: [true, "please provide a full name"],
        unique: true
    },
    description: {
        type: String,
        required: false
    },
    type: {
        type: String,
        default: "member"
    },
    email: {
        type: String,
        required: false,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        // required: true,
        // unique: true,
        default: bcrypt.hashSync("likelemba1234", 5)
    },
    manager_id: {
        type: String,
        required: false
    },
});



// const mongoose = require("mongoose");
// const schema = require("mongoose").Schema;
// const bcrypt = require('bcrypt');
// const jwt = require("jsonwebtoken");
// // const validator = require('validator');

// const userSchema = new schema({
//     fullname:{
//         type: String,
//         required :[true,"please provide a full name"],
//         unique:true
//     },
//     phone:{
//         type:String,
//         required :[true,"please provide a full name"],
//         unique:true
//     },
//     description:{
//         type:String,
//         required:false
//     },
//     type:{
//         type:String,
//         default:"member"
//     },
//     email:{
//         type:String,
//         required:false,
//         lowercase:true,
//         trim:true,
//         validate(v){
//             if(!validator.isEmail(v)) throw new Error('E-mail not valide');
//         }
//     },
//     password:{
//         type:String,
//         required:true,
//         unique:true,
//         validate(v){
//             if(!validator.isLength(v,{min:4, max:20})) throw new Error('passowrd should be between 4 and 20 caracters');
//         }
//         // default:bcrypt.hashSync("likelemba1234",5)
//     }, 
//     manager_id:{
//         type:String,
//         required:false
//     },
//     authTokens:[{
//         authToken:{
//             type: String,
//             required:true
//         }
//     }]
// });

// userSchema.methods.generateAuthTokenAndSaveUser = async function(){
//     const authToken = jwt.sign({_id:this._id.toString()},'ceroakiba2024');
//     this.authTokens.push({authToken});
//     await this.save();
//     return authToken;
// }

// userSchema.statics.save = async function (){
//     try {

//     } catch (error) {

//     }
// }

// userSchema.statics.findUser = async (phone, password) => {
//     const user = User.findOne({phone});

//     if(!user) throw new Error("identification failed");
//     const isPasswordValid = await bcrypt.compare(password,user.password);
//     if(!isPasswordValid) throw new Error("authentification failed");
//     return user;
// }

// userSchema.pre('save', async function(){
//     if(this.isModified('password')) this.password = await bcrypt.hashSync(this.password,10);
// });

// const User = mongoose.model("users", userSchema);

module.exports = mongoose.model("users", userSchema);