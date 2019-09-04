const mysql =   require("mysql");
const conn  =   mysql.createConnection({
    host        :   "",
    port        :   3306,
    user        :   "",
    password    :   "",
    database    :   ""
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