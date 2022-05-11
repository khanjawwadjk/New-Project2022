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
    }
}

module.exports = userModels;