const conn              =   require("../db.js");
const getCover          =   require("../utils/movieCover.js");

// Default movie fields
const MOVIE_FIELDS      =   "num_id AS  id, str_nome AS  name, str_genero AS  genre, str_ano AS  year, num_classificacao AS  rating, str_cover_url AS  cover, dte_cadastro AS  date, dte_atualizacao AS  updated";

// Sync data with The Movie DB updating data
const Update = async ( resultJson ) =>{
    for (let i in resultJson){
        // Movie Data
        let num_movie_id        =   resultJson[i].id;
        let str_movie_name      =   resultJson[i].name;
        let str_movie_cover     =   resultJson[i].cover; 

        if( str_movie_name && ( !str_movie_cover || str_movie_cover == null ) ){
            // Cover
            str_movie_cover = await getCover( str_movie_name ).then( function ( str_movie_cover ){
                if( str_movie_cover ){
                    // Add cover to DB and Update str_cover_url on result json
                    resultJson[i].cover =   str_movie_cover;
                    // Save Movie Cover on DB
                    let SQL     =   "UPDATE tab_dvds SET str_cover_url = '"+str_movie_cover+"'WHERE num_id ='"+num_movie_id+"' LIMIT 1";
                    conn.query( SQL, function (error, results, fields) {
                        if( error ) console.warn("Cover save error");
                    });
                }                        
            });
        }   
    } // end if for
    return resultJson;
}

const Movies = {
    /* MOVIE LIST */
    getAll: function (req, res) {
        // Query
        let SQL     =   "SELECT "+MOVIE_FIELDS+" FROM tab_dvds ORDER BY str_nome ASC";
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

            // Update
            Update(resultJson).then(function( request, response ){
                let apiResult       =   {};
                apiResult.total     =   resultJson.length;
                apiResult.movies    =   resultJson;
                // Return
                res.json(apiResult);
            });
        });            
    },
    /* FIND MOVIE BY ID */
    getId: function ( req, res ) {
        let id      =   conn.escape(req.params.id);
        let SQL     =   "SELECT "+MOVIE_FIELDS+" FROM tab_dvds WHERE num_id = "+ id +" LIMIT 1";
        
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

            // Update
            Update(resultJson).then(function( request, response ){
                let apiResult       =   {};
                apiResult.total     =   resultJson.length;
                apiResult.movies    =   resultJson;
                // Return
                res.json(apiResult);
            });
        });
    },  
    /* FIND MOVIE BY NAME */
    getFind: function ( req, res ) {

        let name        =   conn.escape("%"+req.params.name+"%");
        let SQL         =   "SELECT "+MOVIE_FIELDS+" FROM tab_dvds WHERE str_nome LIKE "+ name +" ORDER BY str_nome ASC";
        
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
            
            // Movie Data ok
            let resultJson          =   JSON.stringify(results);
            resultJson              =   JSON.parse(resultJson);

            // Update
            Update(resultJson).then(function( request, response ){
                let apiResult       =   {};
                apiResult.total     =   resultJson.length;
                apiResult.movies    =   resultJson;
                // Return
                res.json(apiResult);
            });
        });
    },
    /* MOVIES FROM GENRE */
    getGenre: function ( req, res ) {

        let name    =   conn.escape(req.params.name);
        let SQL     =   "SELECT "+MOVIE_FIELDS+" FROM tab_dvds WHERE str_genero = "+name+" ORDER BY str_nome ASC";
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
            // Update
            Update(resultJson).then(function( request, response ){
                let apiResult       =   {};
                apiResult.total     =   resultJson.length;
                apiResult.movies    =   resultJson;
                // Return
                res.json(apiResult);
            });
        });
    },
    /* GENRES LIST */
    getGenres: function ( req, res ) {
        let SQL     =   "SELECT DISTINCT(str_genero) AS genre FROM tab_dvds GROUP BY str_genero ORDER BY str_genero ASC";

        conn.query( SQL, function (error, results, fields) {
            if (error) {
                // Error 
                let apiResult       =   {};
                apiResult.total     =   0;
                apiResult.genres    =   [];
                // Return
                res.json(apiResult);
            }
            
            let resultJson      =   JSON.stringify(results);
            resultJson          =   JSON.parse(resultJson);
            
            let arr             =   [];

            for (var i in resultJson) 
                arr.push(resultJson[i].genre);  

            let apiResult       =   {};
            apiResult.total     =   arr.length;
            apiResult.genres    =   arr;
            // Return
            res.json(apiResult);
        });
    },                                    
};

module.exports = Movies;