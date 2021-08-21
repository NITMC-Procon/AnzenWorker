const mysql = require("mysql");

exports.connectDB = function(host, user, password) {
    const connection = mysql.createConnection({
        host: host,
        user: user,
        password: password 
    });

    connection.connect(err =>{
        if(err) {
            console.log("DB: Connection failed: " + err.stack);
            return;
        }
        console.log("DB: Connected as id: " + connection.threadId);
    });
}


