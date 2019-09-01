const conn = require("../db.js");

var Movie = {
    getAllItems: function (req, res) {
            // let pathname = req._parsedUrl.pathname.split('/');
            // let section  = pathname[1];
            let SQL     =   "SELECT * FROM tab_dvds ORDER BY str_nome ASC";
            var results = conn.query( SQL, function (error, results, fields) {
                if (error) {
                    // Error 
                    // console.error(error);
                    var apiResult = {};
                    
                    apiResult.meta = {
                        page: 1,
                        total_pages: 1,
                        total: 0
                    }
                    apiResult.data = [];
                    res.json(apiResult);
                }
                
                var resultJson = JSON.stringify(results);
                resultJson = JSON.parse(resultJson);
                var apiResult = {};

               // rs
                apiResult.meta = {
                    page: 1,
                    total_pages: 1,
                    total: resultJson.length
                }
                apiResult.data = resultJson;
                res.json(apiResult);
            });
        },
    };

    module.exports = Movie;