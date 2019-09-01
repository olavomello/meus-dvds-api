const conn = require("../db.js");

const Movies = {
        /* MOVIE LIST */
        getAll: function (req, res) {
            // let pathname = req._parsedUrl.pathname.split('/');
            // let section  = pathname[1];
            let SQL     =   "SELECT * FROM tab_dvds ORDER BY str_nome ASC";
            conn.query( SQL, function (error, results, fields) {

                if (error) {
                    // Error 
                    let apiResult       =   {};
                    apiResult.total     =   0;
                    apiResult.movies    =   [];
                    // Return
                    res.json(apiResult);
                }
                
                let resultJson      =   JSON.stringify(results);
                resultJson          =   JSON.parse(resultJson);
                let apiResult       =   {};
                apiResult.total     =   resultJson.length;
                apiResult.movies    =   resultJson;
                // Return
                res.json(apiResult);
            });            
        },
        /* FIND MOVIE BY ID */
        getId: function ( req, res ) {

            let pathname    =   req._parsedUrl.pathname.split('/');
            let id          =   pathname[2];

            let SQL     =   "SELECT * FROM tab_dvds WHERE num_id = '"+ id +"' LIMIT 1";
            conn.query( SQL, function (error, results, fields) {
                if (error) {
                    // Error 
                    // console.error(error);
                    let apiResult       =   {};
                    apiResult.total     =   0;
                    apiResult.movies    =   [];
                    // Return
                    res.json(apiResult);
                }
                
                let resultJson      =   JSON.stringify(results);
                resultJson          =   JSON.parse(resultJson);
                let apiResult       =   {};
                apiResult.total     =   resultJson.length;
                apiResult.movies    =   resultJson;
                // Return
                res.json(apiResult);
            });
        },  
        /* FIND MOVIE BY NAME */
        getFind: function ( req, res ) {

            let pathname    =   req._parsedUrl.pathname.split('/');
            let nome        =   decodeURI(pathname[3]);

            let SQL     =   "SELECT * FROM tab_dvds WHERE str_nome LIKE '%"+ nome +"%' ORDER BY str_nome ASC";
            
            conn.query( SQL, function (error, results, fields) {
                if (error) {
                    // Error 
                    // console.error(error);
                    let apiResult       =   {};
                    apiResult.total     =   0;
                    apiResult.movies    =   [];
                    // Return
                    res.json(apiResult);
                }
                
                let resultJson      =   JSON.stringify(results);
                resultJson          =   JSON.parse(resultJson);
                let apiResult       =   {};
                apiResult.total     =   resultJson.length;
                apiResult.movies    =   resultJson;
                // Return
                res.json(apiResult);
            });
        },
        /* MOVIES FROM GENRE */
        getGenre: function ( req, res ) {

            let pathname    =   req._parsedUrl.pathname.split('/');
            let genre       =   decodeURI(pathname[3]);
            
            let SQL     =   "SELECT * FROM tab_dvds WHERE str_genero = '"+genre+"' ORDER BY str_nome ASC";
            let results = conn.query( SQL, function (error, results, fields) {
                if (error) {
                    // Error 
                    // console.error(error);
                    let apiResult       =   {};
                    apiResult.total     =   0;
                    apiResult.movies    =   [];
                    // Return
                    res.json(apiResult);
                }
                
                let resultJson      =   JSON.stringify(results);
                resultJson          =   JSON.parse(resultJson);
                let apiResult       =   {};
                apiResult.total     =   resultJson.length;
                apiResult.movies    =   resultJson;
                // Return
                res.json(apiResult);
            });
        },
        /* GENRES LIST */
        getGenres: function ( req, res ) {
            let SQL     =   "SELECT DISTINCT(str_genero) AS str_genero FROM tab_dvds GROUP BY str_genero ORDER BY str_genero ASC";

            conn.query( SQL, function (error, results, fields) {
                if (error) {
                    // Error 
                    let apiResult       =   {};
                    apiResult.totall    =   0;
                    apiResult.genres    =   [];
                    // Return
                    res.json(apiResult);
                }
                let resultJson      =   JSON.stringify(results);
                resultJson          =   JSON.parse(resultJson);

                let apiResult       =   {};
                apiResult.totall    =   resultJson.length;
                apiResult.genres    =   resultJson;
                // Return
                res.json(apiResult);
            });
        },                                    
    };

    module.exports = Movies;