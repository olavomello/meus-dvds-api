const conn = require("../db.js");

var Movies = {
        getAll: function (req, res) {
            // let pathname = req._parsedUrl.pathname.split('/');
            // let section  = pathname[1];
            let SQL     =   "SELECT * FROM tab_dvds ORDER BY str_nome ASC";
            var results = conn.query( SQL, function (error, results, fields) {

                if (error) {
                    // Error 
                    var apiResult       =   {};
                    apiResult.total     =   0;
                    apiResult.movies    =   [];
                    // Return
                    res.json(apiResult);
                }
                
                var resultJson      =   JSON.stringify(results);
                resultJson          =   JSON.parse(resultJson);
                var apiResult       =   {};
                apiResult.total     =   resultJson.length;
                apiResult.movies    =   resultJson;
                // Return
                res.json(apiResult);
            });            
        },
        getId: function ( req, res ) {

            let pathname    =   req._parsedUrl.pathname.split('/');
            let id          =   pathname[2];

            let SQL     =   "SELECT * FROM tab_dvds WHERE num_id = '"+ id +"' LIMIT 1";
            var results = conn.query( SQL, function (error, results, fields) {
                if (error) {
                    // Error 
                    // console.error(error);
                    var apiResult       =   {};
                    apiResult.total     =   0;
                    apiResult.movies    =   [];
                    // Return
                    res.json(apiResult);
                }
                
                var resultJson      =   JSON.stringify(results);
                resultJson          =   JSON.parse(resultJson);
                var apiResult       =   {};
                apiResult.total     =   resultJson.length;
                apiResult.movies    =   resultJson;
                // Return
                res.json(apiResult);
            });
        },  
        getFind: function ( req, res ) {

            let pathname    =   req._parsedUrl.pathname.split('/');
            let nome        =   decodeURI(pathname[3]);

            let SQL     =   "SELECT * FROM tab_dvds WHERE str_nome LIKE '%"+ nome +"%' ORDER BY str_nome ASC";
            var results = conn.query( SQL, function (error, results, fields) {
                if (error) {
                    // Error 
                    // console.error(error);
                    var apiResult       =   {};
                    apiResult.total     =   0;
                    apiResult.movies    =   [];
                    // Return
                    res.json(apiResult);
                }
                
                var resultJson      =   JSON.stringify(results);
                resultJson          =   JSON.parse(resultJson);
                var apiResult       =   {};
                apiResult.total     =   resultJson.length;
                apiResult.movies    =   resultJson;
                // Return
                res.json(apiResult);
            });
        },                
    };

    module.exports = Movies;