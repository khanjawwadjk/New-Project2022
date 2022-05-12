const bcrypt = require('bcrypt'),
      jwt = require('jsonwebtoken'),
      validator = require('validator');

var userModels = require('../models/userModel')
var isEmpty = require('../controller/isEmpty')

var userController = {
    getUsers: (req, res) => {
        let allData = [];

        async function getAllDBUsers(){
            try{
                let result1 =await userModels.totalUsers();
                console.log('result1---->',result1.rows)

                for(let i=0; i<result1.rows.length; i++){
                    totData = {
                        "userID":result1.rows[i]['user_id'],
                        "fullName":result1.rows[i]['first_name'] + ' ' + result1.rows[i]['last_name'],
                        "emailID":result1.rows[i]['email_id'],
                    }
                    allData.push(totData)
                }                

                res.status(200).send({
                    status: true,
                    data: allData
                })
            }catch(err){
                console.log(err.message);
            }
        }
        getAllDBUsers();
    },

    loginByEmail:(req, res)=>{
        var userData = req.body;
        var lowerEmail = userData.email.toLowerCase();
        const passcode = userData.password;
        console.log('lowerEmail---->',lowerEmail);
        console.log('passcode---->',passcode);
        async function userLogin(){
            try{
                userModels.verifyEmail(lowerEmail, function(err, result){
                    if(err){
                        res.status(500).send({
                            status:false,
                            message:"Internal server errror !!"
                        })
                    }else{
                        if(result.rows.length > 0){
                            var decodedPass = (passcode, result.rows[0]['password']);
                            if(decodedPass){//passcode === result.rows[0]['password']
                                var token = jwt.sign({
                                    id: result.rows[0]['user_id']
                                },process.env.SECRET_KEY)

                                res.status(200).send({
                                    status:true,
                                    message:"Login successfull",
                                    token: token
                                })
                            }else{
                                res.status(302).send({
                                    status:false,
                                    message:"Invalid credentials !!"
                                })
                            }
                        }else{
                            res.status(404).send({
                                status:false,
                                message:"Data not found !!"
                            })
                        }

                    }
                })
            }catch(err){
                res.status(404).send({
                    status: false,
                    message: err.message
            })
        }
    }
        userLogin();
    },   

    userRegistration:(req, res)=>{
        var regData = req.body;
        var fname = regData.first_name; 
        var lname = regData.last_name; 
        var pass = regData.password; 
        var email = regData.email; 
        let errors = {};

        if(validator.isEmpty(fname)) {
            errors.firstName = "first name is required !!"
        }
        if(validator.isEmpty(lname)) {
            errors.lastName = "last name is required !!"
        }
        if(validator.isEmpty(email)) {
            errors.firstName = "email is required !!"
        }
        if(!validator.isEmail(email,{
            min:2,
            max:15
        })){
            errors.email = "Invalid email"
        }
        var lowerEmail = email.toLowerCase();

        if(Object.keys(errors).length > 0){
            res.status(402).send({
                status: false,
                message: "Invalid credentials",
                data: errors
            })
        }else{
            userModels.verifyEmail(lowerEmail, function(err, result){
                if(err){
                    res.status(500).send({
                        status:false,
                        message:"Internal server error"
                    })
                }else{
                    if(result.rows.length > 0){
                        res.status(403).send({
                            status:false,
                            message:"Email ID already registered !"
                        })
                    }else{
                        const hashedPass = bcrypt.hashSync(pass, 12);
                        console.log("hashedPass----->", hashedPass)
                        userModels.userRegister(regData, lowerEmail, hashedPass,function(err, result){
                            if(err){
                                res.status(500).send({
                                    status:false,
                                    message:"Internal server error"
                                })
                            }else if(result.rows.length > 0){
                                res.status(200).send({
                                    status:true,
                                    message:"Registration done successfully !!"
                                })
                            }else{
                                res.status(400).send({
                                    status:false,
                                    message:"something went wrong"
                                })
                            }
                        })
                    }
                }
            })
        }

    },
}

module.exports = userController;