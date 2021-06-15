"use strict"

const bcryptjs = require("bcryptjs")
const comparePass =  (storepass, inputpass) => bcryptjs.compare(inputpass, storepass)


class AuthService  {
    constructor(Model){
        this.Model = Model;
    }

    async SignUp(DatafromBody){
        const {username, email, password, dateofbirth} = DatafromBody
        const CheckIsEmailExist = await this.Model.findOne({"email" : email}).lean()
        if(CheckIsEmailExist){
           return{

               ErrorMessage : "Email has already been used", code : 403, error : true
           }
           }    
        else{

            const createUser = await this.Model.create({
                username,
                email, 
               password : await bcryptjs.hash(password, 12),
                
               dateofbirth
            })
            
            return {
                error : false,
                 data : {
                     userid : createUser._id,
                 }
            };
        } 
}

async Login(DatafromBody) {
    const {email, password} = DatafromBody;  
    const findemail = await this.Model.findOne({ email}).select('+password').lean()
    if(!findemail ) {
        return {
        notfoundmessage : "Email not found", code : 404, error : true
    }}
    const passwordgenerate =await comparePass(findemail.password, password)
    if(!passwordgenerate) {
        return {
            notfoundmessage : "Invalid Password", code : 404, error : true
        }
    }
   
    return {
        error : false,
        data : findemail
    }
}

async findMe(userid){
    return await this.Model.findById({_id : userid}).lean()
    
    
}

async findUserWithRole(userid , role, variablename){
    let data = variablename;

    const findUser = await this.Model.findById({_id : userid}).lean()
      const v1 = findUser[data]
      console.log(v1)
    return !(role.includes(findUser.role)) ? false: true
}
async getAllData(query){
    return await this.Model.find(query).lean().sort({createdAt : -1})
}

async checkCurrentPassword(userid, currentPassword){

    const findUser = await this.Model.findById({_id : userid}).select('+password').lean()
    const passwordCheck =await comparePass(findUser.password, currentPassword)
    if(!passwordCheck) {
        return {
            notfoundmessage : "Invalid Password", code : 404, error : true
        }
    }
return ""
}

async updateInfo(userid, updateobjectdata){

 

   const updatedata = await this.Model.findByIdAndUpdate({_id : userid}, updateobjectdata , {
    new : true,
    runValidators : true,

})
return updatedata
}

async updateField(packageid, userid){
    const IsuserareadySubscribed = await this.Model.findOne({_id : packageid, userlist : userid})
    
    if(IsuserareadySubscribed) {return{

        ErrorMessage : "You already subscribed this package", code : 403, error : true
    }}
    const updateUserActiveRole = await this.Model.findByIdAndUpdate({_id : packageid}, {"$push":{userlist: userid}})

    if(!updateUserActiveRole) console.log("No, something wrong")
    
    return "Account has been deactivated successfully"
}

async updateRequest(_id){
    // const updateUserActiveRole = await this.Model.findOne({"contract_Info"})
    const updateUserActiveRole = await this.Model.findOneAndUpdate({ _id}, {role: "admin"},{
        new : true,
        runValidators : true,
    })  
    if(!updateUserActiveRole) console.log("Account has not been updated")  
    return "Account has been Updated"
}
async deleteUser(_id){
    const updateUserActiveRole = await this.Model.findOneAndDelete({_id})
    if(!updateUserActiveRole) console.log("Account has not been updated")  
    return "User has been deleted"
}

async createPackage(datafrombody){
    const {packagename, slug, description } = datafrombody
    console.log("package is what ? ",packagename )
    const isPackageExist = await this.Model.findOne({slug}).lean()
    if(isPackageExist){
        return{

            ErrorMessage : "This Package has already been exist", code : 403, error : true
        }
        }else{

            console.log("notexist")
            const create = await this.Model.create({packagename, slug, description })
        }
    
    

    return  "A new Package has been created"
}
}

 

module.exports = AuthService
