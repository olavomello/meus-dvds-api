const conn      =   require("../db.js");
const request   =   require("request-promise");

// Config themoviedb.org
const THEMOVIEDB_URL    =   "http://api.themoviedb.org/3/search/movie?api_key=a9f2be5942a892db2895af26a2dbbe03&language=pt-BR&query=";
const THEMOVIEDB_IMG_URL=   "https://image.tmdb.org/t/p/w500";

// Cover from The Movie DB
const getCover = async ( name ) => {
    return new Promise( function(resolve , reject ){
        // Response
        let str_cover_url   =   "";

        // Remove accents
        name                =  name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
        // Cover URL
        let str_movie_url   =   THEMOVIEDB_URL + encodeURI(name);

        if( !name ) return;

        // Find movie data from The Movie DB
        var result =  request({
            url : str_movie_url,
            json: true
        }, function (error, response, body) {
            if ( !error && response.statusCode === 200 ) {
                // Ok
                try{
                    for( let i in body.results ){
                        //console.log("body.results[i].poster_path : " + body.results[i].poster_path);
                        let str_movie_name  =   body.results[i].title;
                        str_movie_name      =   str_movie_name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();

                        //console.log("str_movie_name : " + str_movie_name );
                        //console.log("name : " + name );
                        // console.log("match : " +  ( str_movie_name == name ) );
                        if( str_movie_name == name ){
                            str_cover_url = THEMOVIEDB_IMG_URL + body.results[i].poster_path;
                            // console.log("Cover found : " + str_cover_url);
                        }
                    }
                } catch( ex ){}
            }
        })
        .then(function ( resp ){
            // console.log("getCover > output : " + str_cover_url);
            return resolve(str_cover_url);
        })
        .catch(function(error){
        });
    });
}

// Sync data with The Movie DB updating data
const Update = async ( resultJson ) =>{
    // Cover data
    // console.log(resultJson);
    // Run json results
    for (let i in resultJson){
        // Movie Data
        let num_movie_id        =   resultJson[i].num_id;
        let num_themoviedb_id   =   resultJson[i].num_themoviedb_id;
        let str_movie_name      =   resultJson[i].str_nome;
        let str_movie_cover     =   resultJson[i].str_cover_url;

        if( str_movie_name && ( !str_movie_cover || str_movie_cover == null ) ){
            // Cover
            //console.log("Search cover to movie : ["+str_movie_name+"]");
            str_movie_cover = await getCover( str_movie_name ).then( function ( str_movie_cover ){

                // console.log("Cover read :" + str_movie_cover  );
                if( str_movie_cover ){
                    // Add cover
                    console.log("Cover found : ["+str_movie_cover+"]");
                    
                    // Update str_cover_url on result json
                    resultJson[i].str_cover_url =   str_movie_cover;
                    console.log("JSON cover["+i+"] : ["+resultJson[i]+"]");
                    console.log("JSON cover["+i+"].str_cover_url : ["+resultJson[i].str_cover_url+"]");

                    // Salve Movie Cover on DB
                    let SQL     =   "UPDATE tab_dvds SET str_cover_url = '"+str_movie_cover+"'WHERE num_id ='"+num_movie_id+"' LIMIT 1";
                    /*
                    conn.query( SQL, function (error, results, fields) {
                        if( error )
                            console.warn("Cover save error ");
                    });
                    */
                }                        
            });
            // console.log("Cover : ["+str_movie_cover+"]");
        } else {
            // Cover exists
            // console.log("Cover Exists : ["+str_movie_cover+"]");
        }

        console.log("Movie ID : " + num_movie_id);
        console.log("Movie Name : " + str_movie_name);
        console.log("Movie Cover : " + str_movie_cover);
        console.log("Movie ID on Movie DB : " + num_themoviedb_id);       
    }    
}

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
            let name        =   decodeURI(pathname[3]);

            let SQL     =   "SELECT * FROM tab_dvds WHERE str_nome LIKE '%"+ name +"%' ORDER BY str_nome ASC";
            
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
                
                // Movie Data
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
                    apiResult.total     =   0;
                    apiResult.genres    =   [];
                    // Return
                    res.json(apiResult);
                }
                
                let resultJson      =   JSON.stringify(results);
                resultJson          =   JSON.parse(resultJson);
                
                let arr             =   [];

                for (var i in resultJson) 
                    arr.push(resultJson[i].str_genero);  

                let apiResult       =   {};
                apiResult.total     =   arr.length;
                apiResult.genres    =   arr;
                // Return
                res.json(apiResult);
            });
        },                                    
    };

    module.exports = Movies;