const {account} = require("../../../db.provider");
const AccountControllerr = {};

AccountControllerr.getAll = async (req, res)=>{
    try {
        const accounts = await account.find({});
        res.status(200).send({
            message:"success",
            error:null,
            data:accounts
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

AccountControllerr.create = async (req, res) =>{
    if (
        !req.body.code || 
        !req.body.member_id ||
        !req.body.money_id 
    ) {
        res
        .status(400)
        .send({ 
            message: "fields required", 
            error: null,
            data:null
        });
    }

    try { 
        const result = await account.create(req.body);
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

AccountControllerr.getSingle = async (req, res) => {

    if (!req.params.id) {
      res
        .status(400)
        .send({ message: "error", error: "No data found", data:null});
      return;
    }
    try {
      const data = await account.findById(req.params.id);
      res.status(200).send({ message: "success", error: null, data: data});
    } catch (error) {
      res
        .status(400)
        .send({ message: "error occured", error: error, data:null });
    }
  };

  AccountControllerr.update= async (req, res) => {
    if (!req.params.id) {
      res
        .status(400)
        .send({ message: "error", error: "any id provided", data: null });
      return;
    }
  
    try {
    
        let result = await account.findByIdAndUpdate(req.params.id,req.body);
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
            data: await account.findById(req.params.id) 
        });
    } catch (error) {
      res
        .status(500)
        .send({ message: "error", error: error, data: null });
    }
  }; 
  
  AccountControllerr.delete = async (req, res) => {
    if (!req.params.id) {
      res
        .status(400)
        .send({ message: "error", error: "any id provided", data: null });
      return;
    }
  
    try {
      
        let result = await account.findByIdAndDelete(req.params.id);
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

module.exports = AccountControllerr;