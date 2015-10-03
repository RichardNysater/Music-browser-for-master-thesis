'use strict';

var MusicServices = angular.module('MusicServices', ['ngResource']);

/**
 * Handle the music stored on the server
 */
MusicServices.factory('Api', ['$resource',
    function($resource) {
        return {
            Music: $resource('api/music/:musicId.json', {}, {
                query: {method: 'GET', params: {musicId: 'music'}, isArray: true} //Return all music
            }),

            Labels: $resource('api/labels/:labelId.json',{},{
                query: {method:'GET',params:{labelId:'labels'},isArray:true} //Return all labels
            })
        };
    }]);
