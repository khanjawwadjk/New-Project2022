const db = require('../config/connectDB')

var userModels = {
    totalUsers: function(){
        return new Promise((resolve, reject)=>{
            db.query("select * from users",(err, result)=>{
                if(err) return reject(err);
                return resolve(result);
            })
        })
    }
}

module.exports = userModels;