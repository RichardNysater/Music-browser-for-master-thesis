var serve = require('koa-static');
var koa = require('koa');
var app = koa();
var router = require('koa-router')();
var bodyParser = require('koa-bodyparser');
var mysql = require('mysql-co');
var mysqlHelper = require('mysql');
var fs = require('fs');

var DATABASE_DETAIL_FILEPATH = 'DATABASE_DETAILS.json';
var MAX_SONGS_RETURNED = 10;

/**
 * Reads and parses the database details.
 * @returns A json object with the database details from the external file.
 */
var getDatabaseDetails = function () {
  return JSON.parse(fs.readFileSync(DATABASE_DETAIL_FILEPATH, 'utf8'));
};

/**
 * Starts a connection with the database.
 * @param databaseDetails The details for the database
 */
var connectToDatabase = (function*(databaseDetails) {
  var con = mysql.createConnection({
    host: databaseDetails.host,
    user: databaseDetails.user,
    password: databaseDetails.password,
    database: databaseDetails.database
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
var createQueryForSongs = function (con, features, databaseDetails) {

  var query = "SELECT * FROM ?? WHERE ";
  var inserts = [databaseDetails.database + "." + databaseDetails.songtable];

  if (features.length > 1) {
    for (var i = 0; i < features.length - 1; i++) {
      inserts.push(features[i].feature.id, features[i].minvalue, features[i].maxvalue);
      query += "?? BETWEEN ? AND ? AND "
    }
  }
  inserts.push(features[features.length - 1].feature.id, features[features.length - 1].minvalue, features[features.length - 1].maxvalue);
  query += "?? BETWEEN ? AND ? ORDER BY RAND() LIMIT " + MAX_SONGS_RETURNED;

  try {
    query = mysqlHelper.format(query, inserts);
  }catch(err){
    console.log('Error formatting query!');
  }
  return query;
};

/**
 * A post request is sent here when the client wants to find songs matching selected features.
 * The matching songs is sent back in the response body.
 */
router.post('/app/api/songrequest', function *(next) {
  var features = this.request.body.features;
  this.response.status = 200;
  try {
    var databaseDetails = getDatabaseDetails();
    var con = yield connectToDatabase(databaseDetails);
    var q = createQueryForSongs(con, features, databaseDetails);
    var res = yield con.query(q);
    con.end();
    } catch (err) {
    console.log(err);
    this.response.body = "Request error";
    this.status = err.status || 500;
    this.body = err.message;
  }
  this.response.body = res[0];
});


app.use(bodyParser());
app.use(serve('.'));

app.use(router.routes())
  .use(router.allowedMethods());
app.listen(3000);