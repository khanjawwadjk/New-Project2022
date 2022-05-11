const Pool = require('pg').Pool;

const connection = new Pool({

    user: 'postgres',
    host:'localhost',
    port: process.env.DB_PORT,
    database: 'users_DB',
    password: process.env.DB_PASS,
})

connection.connect(function(err){
    if(err){
        console.log(err.message);
    }else{
        console.log("connected to database")
    }
})

module.exports = connection;