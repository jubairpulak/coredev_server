const mongoose = require('mongoose');

const UserSchema =  new mongoose.Schema({

        username :{
            type : String,
            required : true,
            trim : true
        },
        
       
        password : {
            type : String,
            required : true,
            min: 6,
            select : false,
           
        },
        dateofbirth : {
            type : Date,
            required : true,
           
        },
        
            email : {
                type : String,
                required : true,
                unique : true,
               
                
            },
            
        role :{
            type : String,
            default : "user",
            enum : ["admin", "user" ],
        },
       
        
       
    }, {timestamps : true})

    UserSchema.index({email : 1, password : 1})

    


module.exports = mongoose.model("UserSchema", UserSchema)