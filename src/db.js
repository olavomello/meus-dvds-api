const mysql =   require("mysql");
const conn  =   mysql.createConnection({
    host        :   "68.233.247.70",
    port        :   3306,
    user        :   "dvds",
    password    :   "vGN@PhG1IId39nO",
    database    :   "dvds"
});

conn.connect( (err) =>{
    if( err ){
        // DB Error
        console.error("DB error : " + err );
    }
});
module.exports = conn;