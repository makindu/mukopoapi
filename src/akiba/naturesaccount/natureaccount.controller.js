const {accountnature} = require("../../../db.provider");
const AccountNatureController = {};

AccountNatureController.getAll = async (req, res)=>{
    try {
        const natures = await accountnature.find({});
        res.status(200).send({
            message:"success",
            error:null,
            data:natures
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

AccountNatureController.create = async (req, res) =>{
    if (
        !req.body.name || 
        !req.body.isgroup ||
        !req.body.typetransaction || 
        !req.body.isclosed 
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
        const result = await accountnature.create(req.body);
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

AccountNatureController.getSingle = async (req, res) => {

    if (!req.params.id) {
      res
        .status(400)
        .send({ message: "error", error: "No data found", data:null});
      return;
    }
    try {
      const data = await accountnature.findById(req.params.id);
      res.status(200).send({ message: "success", error: null, data: data});
    } catch (error) {
      res
        .status(400)
        .send({ message: "error occured", error: error, data:null });
    }
  };

  AccountNatureController.update= async (req, res) => {
    if (!req.params.id) {
      res
        .status(400)
        .send({ message: "error", error: "any id provided", data: null });
      return;
    }
  
    try {
    
        let result = await accountnature.findByIdAndUpdate(req.params.id,req.body);
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
            data: await accountnature.findById(req.params.id) 
        });
    } catch (error) {
      res
        .status(500)
        .send({ message: "error", error: error, data: null });
    }
  }; 
  
  AccountNatureController.delete = async (req, res) => {
    if (!req.params.id) {
      res
        .status(400)
        .send({ message: "error", error: "any id provided", data: null });
      return;
    }
  
    try {
      
        let result = await accountnature.findByIdAndDelete(req.params.id);
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

module.exports = AccountNatureController;