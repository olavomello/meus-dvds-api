const mysql =   require("mysql");
const conn  =   mysql.createConnection({
    host        :   "68.233.247.70",
    port        :   3306,
    user        :   "dvds",
    password    :   "vGN@PhG1IId39nO",
    database    :   "dvds"
});

try{
    conn.connect( (err) =>{
        if( err )
        console.error("DB error : " + err );
    });
} catch(ex){}

conn.on('error', (err) =>{
    console.error("Conn error : " + err );
});

module.exports = conn;