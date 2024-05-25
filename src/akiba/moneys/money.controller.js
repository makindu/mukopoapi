const {money} = require("../../../db.provider");
const MoneyController = {};

MoneyController.getAll = async (req, res)=>{
    try {
        const moneys = await money.find({});
        res.status(200).send({
            message:"success",
            error:null,
            data:moneys
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

MoneyController.create = async (req, res) =>{
    if (
        !req.body.name || 
        !req.body.abreviation
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
        const result = await money.create(req.body);
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

MoneyController.getSingle = async (req, res) => {

    if (!req.params.id) {
      res
        .status(400)
        .send({ message: "error", error: "No data found", data:null});
      return;
    }
    try {
      const data = await money.findById(req.params.id);
      res.status(200).send({ message: "success", error: null, data: data});
    } catch (error) {
      res
        .status(400)
        .send({ message: "error occured", error: error, data:null });
    }
  };

  MoneyController.update= async (req, res) => {
    if (!req.params.id) {
      res
        .status(400)
        .send({ message: "error", error: "any id provided", data: null });
      return;
    }
  
    try {
    
        let result = await money.findByIdAndUpdate(req.params.id,req.body);
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
            data: await money.findById(req.params.id) 
        });
    } catch (error) {
      res
        .status(500)
        .send({ message: "error", error: error, data: null });
    }
  }; 
  
  MoneyController.delete = async (req, res) => {
    if (!req.params.id) {
      res
        .status(400)
        .send({ message: "error", error: "any id provided", data: null });
      return;
    }
  
    try {
      
        let result = await money.findByIdAndDelete(req.params.id);
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

module.exports = MoneyController;