'use strict';

angular.module('myApp.emotions', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/emotions', {
      templateUrl: 'emotions/emotions.html',
      controller: 'EmotionsCtrl'
    });
  }])

  /**
   * The Emotion plane controller handles the interactions within the emotion plane.
   * The emotion plane allows a user to click somewhere in a 2d-plane with four emotions in each corner,
   * the application will then create a playlist based on the distance to each emotion.
   */
  .controller('EmotionsCtrl', ['$scope', 'ResourcesService', 'SongRequestService', 'EmotionsService','$timeout',
    function ($scope, ResourcesService, SongRequestService, EmotionsService,$timeout) {
      var DISPLAY_SONGS = false;

      /**
       * Calculate the min-max values of each feature based on the distance between the click and the corners
       * @param x_coord The x-coordinate inside the plane.
       * @param y_coord The y-coordinate inside the plane.
       * @param plane_width The total width of the plane
       * @param plane_height The total height of the plane
       * @returns {Array} An array with each feature's min and max value calculated
       */
      var calcFeatures = function (x_coord, y_coord, plane_width, plane_height) {
        var feature_list = [];

        /* Scale the coordinate system to be between -1 and 1 */
        var x = 2 * ((x_coord / plane_width) - 0.5);
        var y = 2 * (0.5 - (y_coord / plane_height));

        /* Interpolate the features based on the distance to each emotion
         See http://www.speech.kth.se/prod/publications/files/1344.pdf for the algorithm used */
        for (var i = 0; i < $scope.emotions[0].features.length; i++) {
          var tr_max = $scope.topright.features[i].maxvalue;
          var tl_max = $scope.topleft.features[i].maxvalue;
          var bl_max = $scope.bottomleft.features[i].maxvalue;
          var br_max = $scope.bottomright.features[i].maxvalue;

          var tr_min = $scope.topright.features[i].minvalue;
          var tl_min = $scope.topleft.features[i].minvalue;
          var bl_min = $scope.bottomleft.features[i].minvalue;
          var br_min = $scope.bottomright.features[i].minvalue;

          var max_val = Math.round((0.25 * y * (x * (tr_max - tl_max - br_max + bl_max) + tr_max + tl_max - br_max - bl_max))
            + (0.25 * ((x * (tr_max - tl_max + br_max - bl_max)) + tr_max + tl_max + br_max + bl_max)));
          max_val = Math.min($scope.feature_variance + max_val, 100); // Limit max to 100

          var min_val = Math.round(0.25 * y * (x * (tr_min - tl_min - br_min + bl_min)
            + tr_min + tl_min - br_min - bl_min) + 0.25 * (x * (tr_min - tl_min + br_min - bl_min) + tr_min + tl_min + br_min + bl_min));
          min_val = Math.max(min_val - $scope.feature_variance, 0); // Limit min to 0

          feature_list.push({
            "feature": {"id": $scope.emotions[0].features[i].feature},
            "minvalue": min_val,
            "maxvalue": max_val
          });
        }
        return feature_list;
      };

      /**
       * If the user has previously clicked somewhere, load the values for the previous click
       */
      var loadValues = function () {
        var prevValues = EmotionsService.getSavedValues();
        $scope.imgwidth = prevValues.imgwidth;
        $scope.imgheight = prevValues.imgheight;
        $scope.imgleft = prevValues.imgleft;
        $scope.imgtop = prevValues.imgtop;
        $scope.feature_list = prevValues.feature_list;

        if(getSelectionPercent() != prevValues.selection_percent){
          updateWindow();
        }

      };

      /**
       * Returns the inner width of the plane
       * @returns {*|jQuery}
       */
      var getPlaneWidth = function(){
        return $('.plane').innerWidth();
      }

      /**
       * Return where on the plane's x-axis (width) the selection marker is
       * @returns {number} 0 for the furthest left and 1 for furthest right
       */
      var getSelectionPercent = function(){
        return ($scope.imgleft-$('.plane').offset().left)/getPlaneWidth();
      }

      /**
       * Adds the input songs to the scope for display
       * @param songs The songs to display
       */
      var displaySongs = function (songs) {
        $scope.songs = [];
        var songPositions = $scope.songPosition;
        for (var i = 0; i < songs.length; i++) {
          if (songPositions.length > 0) {
            var random = Math.floor(Math.random() * (songPositions.length)); // Random a number between 0 and the amount of remaining positions
            var pos = songPositions[random];
            songPositions.splice(random, 1);

            $scope.songs.push({left: pos.left, top: pos.top, songID: songs[i].songID});
          }
        }
      };

      /**
       * Calculate positions around the selected position to display songs
       * @param middle_x The x position of the click
       * @param middle_y The y position of the click
       * @param plane_width The width of the plane
       * @param plane_height The height of the plane
       * @param offset The offset for the plane
       * @returns {Array} An array of coordinates around the selected position
       */
      var calcSongPositions = function (middle_x, middle_y, plane_width, plane_height, offset) {
        var positions = [];
        var xScale = plane_width / 30;
        var yScale = plane_height / 30;

        for (var i = -2; i < 3; i++) {
          for (var j = -2; j < 3; j++) {
            var left = middle_x + i * xScale;
            var top = middle_y + j * yScale;
            var check_left = left - offset.left;
            var check_top = top - offset.top;

            if (check_left >= 0 && check_left <= plane_width && check_top >= 0 && check_top <= plane_height) {
              positions.push({left: left, top: top});
            }
          }
        }
        return positions;
      }

      /**
       * planeClick is called whenever a user clicks on the 2d-plane
       * @param event Event
       */
      $scope.planeClick = function (event) {
        var CSS_plane = $('.plane');

        var plane_width = CSS_plane.outerWidth();
        var plane_height = CSS_plane.outerHeight();

        /* Calculate the location of the selection image */
        $scope.imgwidth = 10;
        $scope.imgheight = 10;
        $scope.imgleft = event.pageX - ($scope.imgwidth / 2);
        $scope.imgtop = event.pageY - ($scope.imgheight / 2);

        /* Calculate the features required to request for music */
        $scope.songPosition = calcSongPositions($scope.imgleft, $scope.imgtop, plane_width, plane_height, CSS_plane.offset());

        var feature_list = calcFeatures(event.offsetX, event.offsetY, plane_width, plane_height);
        if (DISPLAY_SONGS) {
          SongRequestService.playMatchingSongs(feature_list, displaySongs);
        } else {
          SongRequestService.playMatchingSongs(feature_list);
        }
        $scope.feature_list = feature_list;

        // Save the current variables used for the click
        EmotionsService.saveClick($scope.imgleft, $scope.imgtop, $scope.imgwidth, $scope.imgheight, $scope.feature_list, getSelectionPercent());
      };

      /**
       * This function is called whenever the window is resized
       */
      var updateWindow = function (){
        $scope.imgleft = $('.plane').offset().left + getPlaneWidth()*EmotionsService.getSavedValues().selection_percent;
        EmotionsService.saveClick($scope.imgleft, $scope.imgtop, $scope.imgwidth, $scope.imgheight, $scope.feature_list, getSelectionPercent());
      };

      /**
       * Initializes the handling of window resizing
       */
      var initWindowHandling = function(){
        var oldWidth = getPlaneWidth();

        $(window).on('resize.doResize', function () {
          var newWidth = getPlaneWidth();
          var updateStuffTimer;

          if (newWidth !== oldWidth) {
            $timeout.cancel(updateStuffTimer);
          }

          updateStuffTimer = $timeout(function() {
            updateWindow();
            oldWidth = newWidth;
          }, 500);
        });

        $scope.$on('$destroy',function (){
          $(window).off('resize.doResize'); // remove the handler added earlier
        });
      }

      /* Controller body starts here */
      $scope.feature_variance = 5;

      // Get labels, initialize select boxes and load existing values
      ResourcesService.Labels.emotions().$promise.then(function (data) {
        $scope.emotions = data;
        loadValues(data);
        $scope.topleft = data[0];
        $scope.bottomright = data[1];
        $scope.topright = data[2];
        $scope.bottomleft = data[3];
      }, function (err) {
        throw "No emotions were returned by query: " + err;
      });

      // Handle window resizing
      initWindowHandling();

    }]);