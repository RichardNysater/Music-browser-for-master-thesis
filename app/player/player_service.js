var PlayerService = angular.module('PlayerService', ['ngCookies']);

/**
 * The player service stores values relevant to the player footer
 */
PlayerService.service('PlayerService', ['$cookies', function ($cookies) {

  /**
   * Returns the volume this user has set or the default volume
   * @returns {*} A volume value (0-100)
   */
  this.getVolume = function () {
    if ($cookies.get('userVolume')) {
      return parseFloat($cookies.get('userVolume'));
    }
    else {
      return 100;
    }
  };

  /**
   * Saves the volume for this user
   * @param volume The volume to save
   */
  this.saveVolume = function (volume) {
    $cookies.put('userVolume', volume);
  };

  /**
   * Returns the autoplay the user has set or the default autoplay
   * @returns {*} true if autoplay is on, false otherwise
   */
  this.getAutoPlay = function(){
    var autoPlay = $cookies.get('userAutoPlay');
    if(autoPlay === 'true'){
      return true;
    }
    else {
      return false;
    }
  };

  /**
   * Saves the autoplay for this user
   * @param autoPlay true if autoplay is on, false otherwise
   */
  this.saveAutoPlay = function(autoPlay){
    $cookies.put('userAutoPlay', autoPlay);
  };

}]);