var SongRequestService = angular.module('SongRequestService', ['ngResource']);

/**
 * Handle the sending of requests for songs to the server
 */
SongRequestService.service('SongRequestService', ['$resource','$http',
    function($resource,$http) {

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
        }

    }
]);

