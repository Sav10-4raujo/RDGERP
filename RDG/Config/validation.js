let validationErrors = [];
module.exports = {

  errors:validationErrors,

  validationRequired : (data, res)=>{

    if(!data){
      const msg = "Check that all items have been completed";
      res.json({ msg });
      validationErrors.push({msg});
      return
    }
  
  },

  validationLength : (data, res, max, min, name)=>{

    if(data){

      if(data.length > max || data.length < min){

        const msg = `The ${name} field must be between ${min} and ${max} characters`;
        res.json({msg});
        validationErrors.push({msg});
        return

      }

    }    

  },

  validationType : (data, type, res, name )=>{

    if(typeof(data) !== type){

      const msg = `The ${name} field must be a ${type}`;
      res.json({msg});
      validationErrors.push({msg});
      return

    } 

  }

}