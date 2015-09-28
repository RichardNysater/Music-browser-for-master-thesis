'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$scope',
      function ($scope) {

        /**
         * planeClick is called whenever a user clicks on the 2d-plane
         * @param event Event
         */
          $scope.planeClick = function(event) {

            $scope.xc = event.offsetX;
            $scope.yc = event.offsetY;

            $scope.imgwidth = 10;
            $scope.imgheight = 10;

            $scope.imgleft = event.pageX-($scope.imgwidth/2);
            $scope.imgtop = event.pageY-($scope.imgheight/2);
        }
      }]);