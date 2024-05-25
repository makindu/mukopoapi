const {user} = require("../../db.provider");
const bcript = require("bcrypt");
const UserController = {};

UserController.getAll = async (req, res)=>{
    try {
        const users = await user.find({});
        res.status(200).send({
            message:"success",
            error:null,
            data:users
        });
    } catch (error) {
        res
        .status(500)
        .send({ 
            message: "error occured", 
            error: error,
            data:[]
        });
    }
}

UserController.create = async (req, res) =>{
    if (!req.body.fullname || !req.body.phone) {
        res
        .status(400)
        .send({ 
            message: "fullname or phone required", 
            error: null,
            data:null
        });
    }

    try {
        if (req.body.password) {
            req.body.password=bcript.hashSync(req.body.password,10);
        }
   
        const result = await user.create(req.body);
        res.status(200).send({
            message:"success",
            error:null,
            data:result
        });
    } catch (error) {
        res
        .status(500)
        .send({ 
            message: "error occured", 
            error: error,
            data:null 
        });
    }
}

UserController.getSingleUser = async (req, res) => {

    if (!req.params.id) {
      res
        .status(400)
        .send({ message: "error", error: "No data found", data:null});
      return;
    }
    try {
      const data = await user.findById(req.params.id);
      res.status(200).send({ message: "success", error: null, data: data });
    } catch (error) {
      res
        .status(400)
        .send({ message: "error occured", error: error, data:null });
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
            req.body.password=bcript.hashSync(req.body.password,10);
        }
        let result = await user.findByIdAndUpdate(req.params.id,req.body);
        if (!result) {
            res.status(404).send({ 
                message: "not found", 
                error: null, 
                data:null
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
                data:null
            }); 
        }
        res.status(200).send({ 
            message: "success", 
            error: null, 
            data:result
        });
    } catch (error) {
      res
        .status(500)
        .send({ message: "error", error: error, data: null });
    }
  };

  UserController.login = async (res,req)=>{
    try {
      const result = await user.findUser(req.body.phone, req.body.password);
        res.status(200).send({ 
          message: "success", 
          error: null, 
          data:result
      });
    } catch (error) {
          res
          .status(400)
          .send({ message: "error", error: error, data: null });
      } 
  };

module.exports = UserController;