const db = require('../config/connectDB')

var userModels = {
    totalUsers: function(){
        return new Promise((resolve, reject)=>{
            db.query("select * from users",(err, result)=>{
                if(err) return reject(err);
                return resolve(result);
            })
        })
    },

    verifyEmail: function(email, callback){
        db.query("select * from users where email_id = $1", [email], callback)
    },

    userRegister: function(regData, lowerEmail, password,callback){
        db.query("insert into users(first_name, last_name, email_id, password) values ($1, $2, $3, $4) returning user_id",[regData.first_name, regData.last_name, lowerEmail, password],callback);
    }
}

module.exports = userModels;