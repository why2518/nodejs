var mysql = require("mysql")


var pool = mysql.createPool({
    host:'localhost',
    port:3306,
    user:"root",
    password:'123456',
    database:"db-student",
    multipleStatements:true
    //支持多语句查询
})


module.exports = pool;