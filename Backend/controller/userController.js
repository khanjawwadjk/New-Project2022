const bcrypt = require('bcrypt'),
      jwt = require('jsonwebtoken');
var userModels = require('../models/userModel')


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
                            // var decodedPass = (passcode, result.rows[0]['password']);
                            if(passcode === result.rows[0]['password']){
                                var token = jwt.sign({
                                    id: result.rows[0]['user_id']
                                },"secretKeyJK@123")

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
}

module.exports = userController;