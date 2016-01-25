/**
 * This directive adds the <my-playlist> directive, which inserts the playlist as an element
 */

angular.module('PlaylistDirective', [])
  .controller('Controller', ['$scope', function($scope) {
  }])
  .directive('myPlaylist', function() {
    return {
      restrict: 'E',
      templateUrl: 'playlist/playlist.html'
    };
  });

