var SongRequestService = angular.module('SongRequestService', ['ngResource']);

/**
 * Handle the sending of requests for songs to the server
 */
SongRequestService.service('SongRequestService', ['$resource', '$http', 'angularPlayer', 'PlayerService',
  function ($resource, $http, angularPlayer, PlayerService) {
    var volume = PlayerService.getVolume();
    var requestAmount = 0;
    const MUSIC_FORMAT = "mp3";

    /**
     * Sends a request to the server for songs matching the input features with the given requestType
     * @param featureList The features to match
     * @param requestType The type of request to make
     * @returns {*} A promise which contains the songs if successfull
     */
    this.sendRequest = function (featureList, requestType) {
      var req = {
        method: 'POST',
        url: '/api/songrequest',
        data: {
          features: featureList,
          requestType: requestType
        }
      };
      requestAmount++;
      return $http(req);
    };

    /**
     * Returns the amount of requests gotten
     * @returns {number} An integer with containing the amount of requests done
     */
    this.getRequestAmount = function(){
      return requestAmount
    };

    /**
     * Sets the current volume
     * @param vol The volume to play music at (0-100)
     */
    this.setVolume = function(vol){
      volume = vol;
      applyVolume();
    };

    /**
     * Because volume is individually set per song, this function sets the current chosen volume to all songs in playlist
     */
    var applyVolume = function(){
      for(var i = 0; i < window.soundManager.soundIDs.length; i++) {
        var mySound = window.soundManager.getSoundById(window.soundManager.soundIDs[i]);
        mySound.setVolume(volume);
      }
    };

    /**
     * Adds the given songs to the current playlist.
     * Also starts playing the songs unless music is already playing.
     * @param songs The songs to add to the playlist
     */
    var addSongs = function (songs) {
      var key = null;
      for (var i = 0; i < songs.length; i++) {
        var id = songs[i].songID;
        var url = "/api/music/"+id+"."+MUSIC_FORMAT;

        var tmp = angularPlayer.addTrack({
          "title": id,
          "id": id,
          "url": url
        });

        if (key === null) {
          key = tmp;
        }
      }
      applyVolume();
      angularPlayer.playTrack(key);
      if(!PlayerService.getAutoPlay()) {
        angularPlayer.pause();
      }
    };

    /**
     * Sends a request to the server for all songs matching the input features
     * and adds them to the playlist.
     *
     * @param featureList The features to match
     * @param callback Call the optional callback with the results as parameter
     * @param requestType The request type to give to the server for the query
     */
    this.playMatchingSongs = function (featureList, callback, requestType) {

      var request = this.sendRequest(featureList, requestType);

      request.then(function successCallback(response) {
        var res = response.data;
        if (res.length > 0) {
          if (angularPlayer.getPlaylist().length > 0) { // Clear the playlist if needed
            angularPlayer.clearPlaylist(function (param) {
              addSongs(res);
            });
          }
          else {
            addSongs(res);
          }
        }
        if (callback) { // Only call the callback if it exists
          callback(res);
        }
      }, function errorCallback() {
        console.log("Failed to query for songs.");
      });
    }

  }
]);

