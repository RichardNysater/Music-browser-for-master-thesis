var serve = require('koa-static');
var koa = require('koa');
var app = koa();
var router = require('koa-router')();
var bodyParser = require('koa-bodyparser');

/**
 * This function searches the database for songs matching the range of features given to it.
 * @param features An array of features to match a song to, syntax: [{ feature: {id:"Feature name"}, minvalue: x, maxvalue: y}, ...]
 * @returns {*[]} An array of songs matching the features.
 */
var findSongs = function(features){
    //TODO: Implement finding songs
    var foundSongs = [{id:null, url:null, title:null, artist:null}];
    return foundSongs;
};

/**
 * A post request is sent here when the client wants to find songs matching selected features.
 */
router.post('/app/api/songrequest', function *(next) {
    var features = this.request.body.features;
    console.log(features);

    this.response.status = 200;
    this.response.body = findSongs(features);
});

app.use(bodyParser());
app.use(serve('.'));

app.use(router.routes())
    .use(router.allowedMethods());
app.listen(3000);