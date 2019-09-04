/*
    Search and get the movie cover from themoviedb.org
*/
const request           =   require("request-promise");

// Config themoviedb.org
const THEMOVIEDB_URL    =   "http://api.themoviedb.org/3/search/movie?api_key=a9f2be5942a892db2895af26a2dbbe03&language=pt-BR&query=";
const THEMOVIEDB_IMG_URL=   "https://image.tmdb.org/t/p/w500";

// Cover from The Movie DB
const getCover = async ( name ) => {
    // console.log("getCover > " + name );
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
                try{
                    for( let i in body.results ){
                        let str_movie_name  =   body.results[i].title;
                        str_movie_name      =   str_movie_name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();

                        if( str_movie_name == name )
                            str_cover_url = THEMOVIEDB_IMG_URL + body.results[i].poster_path;
                    }
                } catch( ex ){}
            }
        })
        .then(function ( resp ){
            // console.log("getCover > Cover found : " + str_cover_url );
            return resolve(str_cover_url);
        })
        .catch(function(error){
        });
    });
}

module.exports = getCover;