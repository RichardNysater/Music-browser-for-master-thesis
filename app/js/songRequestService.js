var SongRequestService = angular.module('SongRequestService', ['ngResource']);

/**
 * Handle the sending of requests for songs to the server
 */
SongRequestService.service('SongRequestService', ['$resource','$http','angularPlayer',
    function($resource,$http,angularPlayer) {

        /**
         * Sends a request to the server for songs matching the input features
         * @param featurelist The features to match
         * @returns {*} A promise which contains the songs if successfull
         */
        this.sendRequest = function(featurelist){
            var req = {
                method: 'POST',
                url: '/app/api/songrequest',
                data: {
                    features: featurelist
                }
            };
            return $http(req);
        };

        /**
         * Sends a request to the server for all songs matching the input features
         * and adds them to the playlist.
         *
         * @param featurelist The features to match
         */
        this.playMatchingSongs = function(featurelist){
            var request = this.sendRequest(featurelist);

            request.then(function successCallback(response) {
                var res = response.data;
                for(var i = 0; i<res.length;i++){
                    var id =res[i].songID;
                    angularPlayer.addTrack({"title":id,"id":id,"url":"/app/api/music/"+id+".ogg"});
                }
                angularPlayer.play();
            }, function errorCallback() {
                console.log("Failed to query for songs.");
            });
        }
    }
]);

