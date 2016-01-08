var serveFolder = require('koa-static-folder');
var serve = require('koa-static');
var koa = require('koa');
var app = koa();
var router = require('koa-router')();
var bodyParser = require('koa-bodyparser');
var mysql = require('mysql-co');
var mysqlHelper = require('mysql');
var fs = require('fs');

const DATABASE_DETAIL_FILEPATH = 'DATABASE_DETAILS.json';
const MAX_SONGS_RETURNED = 10;

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
  return mysql.createConnection({
    host: databaseDetails.host,
    user: databaseDetails.user,
    password: databaseDetails.password,
    database: databaseDetails.database
  });
});

/**
 * Create a query-string for the songs matching the perceptual features given
 * @param con The database connection
 * @param features The list of min-max values of features
 * @param databaseDetails The database details
 * @returns {string} A string which can be used to query for input songs
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
  } catch (err) {
    console.log('Error formatting songrequest query!');
  }
  return query;
};

/**
 * Creates a timestamp of the current time
 * @returns {string} A MySQL-formatted timestamp containing the current time in UTC+1 (Stockholm)
 */
var getTimestamp = function () {
  var date = new Date();
  date.setUTCHours(date.getUTCHours()+1); // Stockholm is UTC +1.
  return date.toISOString().slice(0, 19).replace('T', ' '); // Gets a MySQL-formatted timestamp from current time;
};

/**
 * Create a query-string for submitting feedback
 * @param con The database connection
 * @param feedback User feedback containing userID, questionID and rating or comment
 * @param databaseDetails The database details
 * @returns {string} A string which can be used to submit the given feedback
 */
var createSubmitFeedbackQuery = function (con, feedback, databaseDetails) {
  var query = "INSERT INTO ?? (userID,timestamp,questionID,rating,comment) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE " +
    "timestamp = VALUES(timestamp)," +
    "rating = VALUES(rating)," +
    "comment = VALUES(comment)";
  var inserts = [databaseDetails.database + "." + databaseDetails.feedbacktable];

  inserts.push(feedback.userID);
  inserts.push(getTimestamp());
  inserts.push(feedback.questionID);
  inserts.push(feedback.rating);
  inserts.push(feedback.comment);

  try {
    query = mysqlHelper.format(query, inserts);
  } catch (err) {
    console.log('Error formatting feedback query!');
  }
  return query;
};

/**
 * A post request is sent here when the client wants to find songs matching selected features.
 * The matching songs is sent back in the response body.
 */
router.post('/api/songrequest', function *(next) {
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


/**
 * A post request is sent here when a client sends feedback.
 * The feedback is inserted into the database
 */
router.post('/api/feedbacksubmit', function *(next) {
  var feedback = this.request.body.feedback;
  if (feedback.userID && feedback.questionID && (feedback.rating || feedback.comment)) {
    this.response.status = 200;
    try {
      var databaseDetails = getDatabaseDetails();
      var con = yield connectToDatabase(databaseDetails);
      var q = createSubmitFeedbackQuery(con, feedback, databaseDetails);
      yield con.query(q);
      con.end();
      this.response.body = "Successfully submitted feedback, thank you!";
    } catch (err) {
      console.log(err);
      this.response.body = "Request error";
      this.status = err.status || 500;
      this.body = err.message;
    }
  }
  else {
    this.response.status = 400;
    this.response.body = "Error, missing feedback parameters";
  }
});


app.use(bodyParser());
app.use(serveFolder('./node_modules/bootstrap/dist')); //Serve the bootstrap dist folder
app.use(serve('app/')); //Serve the application folder

app.use(router.routes())
  .use(router.allowedMethods());
app.listen(3000);