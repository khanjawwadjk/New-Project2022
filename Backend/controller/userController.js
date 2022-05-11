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
    }
}

module.exports = userController;