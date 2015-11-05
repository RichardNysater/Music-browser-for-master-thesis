var serve = require('koa-static');
var koa = require('koa');
var app = koa();
var router = require('koa-router')();
var bodyParser = require('koa-bodyparser');
var mysql = require('mysql-co');
var mysqlHelper = require('mysql');
var fs = require('fs');
var DATABASE_DETAIL_FILEPATH = 'DATABASE_DETAILS.json';

/**
 * Reads and parses the database details.
 * @returns A json object with the database details from the external file.
 */
var getDatabaseDetails = function(){
    return JSON.parse(fs.readFileSync(DATABASE_DETAIL_FILEPATH, 'utf8'));
}

/**
 * Starts a connection with the database.
 * @param databaseDetails The details for the database
 */
var connectToDatabase = (function*(databaseDetails){
    var con = mysql.createConnection({
        host: databaseDetails.host,
        user: databaseDetails.user,
        password: databaseDetails.password,
        database: databaseDetails.database
    });

    con.connect(function(err){
        if(err){
            console.log('Error connecting to the database');
            return;
        }
    });
    return con;
});

/**
 * Create a query-string for the songs matching the perceptual features given
 * @param con The database connection
 * @param features The list of min-max values of features
 * @param databaseDetails The database details
 * @returns {string} The string which should be used to query songs
 */
var createQueryForSongs = function(con,features,databaseDetails){

    var query = "SELECT * FROM ?? WHERE ";
    var inserts = [databaseDetails.database+"."+databaseDetails.songtable];

    if(features.length > 1) {
        for (var i = 0; i < features.length - 1; i++) {
            inserts.push(features[i].feature.id, features[i].minvalue, features[i].maxvalue);
            query += "?? BETWEEN ? AND ? AND "
        }
    }
    inserts.push(features[features.length-1].feature.id, features[features.length-1].minvalue, features[features.length-1].maxvalue);
    query += "?? BETWEEN ? AND ? LIMIT 10";

    query = mysqlHelper.format(query, inserts);
    return query;
}

/**
 * This function searches the database for songs matching the range of features given to it.
 * @param features An array of features to match a song to, syntax: [{ feature: {id:"Feature name"}, minvalue: x, maxvalue: y}, ...]
 * @returns {*[]} An array of songs matching the features.
 */
var findSongs = (function*(features){
    var databaseDetails = getDatabaseDetails();
    var con = yield connectToDatabase(databaseDetails);
    var query = createQueryForSongs(con,features,databaseDetails);
    return yield con.query(query);
});

/**
 * A post request is sent here when the client wants to find songs matching selected features.
 * The matching songs is sent back in the response body.
 */
router.post('/app/api/songrequest', function *(next) {
    var features = this.request.body.features;
    this.response.status = 200;
    try {
        var res = yield findSongs(features);
    }catch(err){
        console.log(err);
        this.response.body = "Request error";
        return;
    }
    this.response.body = res[0];
});


app.use(bodyParser());
app.use(serve('.'));

app.use(router.routes())
    .use(router.allowedMethods());
app.listen(3000);