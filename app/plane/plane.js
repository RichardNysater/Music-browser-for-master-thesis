'use strict';

angular.module('myApp.plane', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/plane', {
      templateUrl: 'plane/plane.html',
      controller: 'PlaneCtrl'
    });
  }])

  .controller('PlaneCtrl', ['$scope', 'Api', 'SongRequestService', 'PlaneService','$timeout',
    function ($scope, Api, SongRequestService, PlaneService,$timeout) {

      /**
       * Set the size of the selection image
       */
      var setImageSize = function(){
        var CSS_plane = $('.plane');
        $scope.imgwidth = CSS_plane.outerWidth() * 1/(100/($scope.feature_variance*2));
        $scope.imgheight = CSS_plane.outerHeight() * 1/(100/($scope.feature_variance*2));
      };

      /**
       * Updates the selection image and plays songs based on the current selection after variance is changed
       */
      $scope.varianceChanged = function(){
        var prevPageX = $scope.imgleft + ($scope.imgwidth/2);
        var prevPageY = $scope.imgtop + ($scope.imgheight/2);
        setImageSize();

        $scope.imgleft = prevPageX - ($scope.imgwidth / 2);
        $scope.imgtop = prevPageY - ($scope.imgheight / 2);
        PlaneService.saveClick($scope.feature_variance, $scope.firstSelect, $scope.secondSelect, $scope.imgleft, $scope.imgtop, $scope.imgwidth, $scope.imgheight, getSelectionPercent());
        playSongs();
      };

      /**
       * Fetches and plays songs based on where the user clicked and what the variance is set to
       */
      var playSongs = function(){
        // Create the min and max values for the two features based on the variance and where the user clicked
        $scope.x_min_value = Math.max($scope.xpercent - $scope.feature_variance,0);
        $scope.x_max_value = Math.min($scope.xpercent + $scope.feature_variance,100);

        $scope.y_min_value = Math.max($scope.ypercent - $scope.feature_variance,0);
        $scope.y_max_value = Math.min($scope.ypercent + $scope.feature_variance,100);

        var xFeature = {
          feature: {id: $scope.firstSelect.id},
          minvalue: $scope.x_min_value,
          maxvalue: $scope.x_max_value
        };
        var yFeature = {
          feature: {id: $scope.secondSelect.id},
          minvalue: $scope.y_min_value,
          maxvalue: $scope.y_max_value
        };

        SongRequestService.playMatchingSongs([xFeature, yFeature]);
      };

      /**
       * planeClick is called whenever a user clicks on the 2d-plane
       * @param event Event
       */
      $scope.planeClick = function (event) {
        var CSS_plane = $('.plane');
        setImageSize();
        $scope.imgleft = event.pageX - ($scope.imgwidth / 2);
        $scope.imgtop = event.pageY - ($scope.imgheight / 2);

        // Save the current variables used for the click
        PlaneService.saveClick($scope.feature_variance, $scope.firstSelect, $scope.secondSelect, $scope.imgleft, $scope.imgtop, $scope.imgwidth, $scope.imgheight, getSelectionPercent());


        $scope.xc = event.offsetX;
        $scope.yc = event.offsetY;

        $scope.xpercent = Math.round(100 * ($scope.xc / CSS_plane.outerWidth()));
        $scope.ypercent = 100 - Math.round(100 * ($scope.yc / (CSS_plane.outerHeight())));

        playSongs();
      };

      /**
       * If the user has previously clicked somewhere, load the values for the previous click
       * @param features The features available.
       */
      var loadValues = function (features) {
        if (PlaneService.variance) {
          $scope.feature_variance = PlaneService.variance;
        }
        else {
          $scope.feature_variance = 13; // Default variance
        }
        $scope.imgwidth = PlaneService.imgwidth;
        $scope.imgheight = PlaneService.imgheight;
        $scope.imgleft = PlaneService.imgleft;
        $scope.imgtop = PlaneService.imgtop;

        if(getSelectionPercent() != EmotionsService.selection_percent){
          updateWindow();
        }

        for (var i = 0; i < features.length; i++) { // Existing features should be selected in the select boxes
          if (PlaneService.firstSelect && features[i].id == PlaneService.firstSelect.id) {
            $scope.firstSelect = features[i];
          }

          if (PlaneService.secondSelect && features[i].id == PlaneService.secondSelect.id) {
            $scope.secondSelect = features[i];
          }
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
       * This function is called whenever the window is resized
       */
      var updateWindow = function (){
        setImageSize();
        $scope.imgleft = $('.plane').offset().left + getPlaneWidth()*PlaneService.selection_percent;
        PlaneService.saveUpdatedWindow($scope.imgleft, getSelectionPercent());
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
      };


      /* Controller body starts here */

      //Get features and load existing values
      Api.Features.query().$promise.then(function (data) {
        $scope.features = data;
        loadValues(data);

        if (!$scope.firstSelect) {
          $scope.firstSelect = $scope.features[0];
        }
        if (!$scope.secondSelect) {
          $scope.secondSelect = $scope.features[$scope.features.length - 1];
        }
      }, function (err) {
        throw "No features were returned by query: " + err;
      });

      // Handle window resizing
      initWindowHandling();
    }]);