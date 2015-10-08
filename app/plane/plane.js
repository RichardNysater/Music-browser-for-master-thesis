'use strict';

angular.module('myApp.plane', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/plane', {
    templateUrl: 'plane/plane.html',
    controller: 'PlaneCtrl'
  });
}])

.controller('PlaneCtrl', ['$scope','Api',
      function ($scope,Api) {

        $scope.labels = Api.Labels.query();
        $scope.firstSelect = null;
        $scope.secondSelect = null;
        /*$scope.label1b = labels[0].label2;
        $scope.label2a = labels[1].label1;
        $scope.label2b = labels[1].label2;*/
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
            $scope.xpercent = Math.round(100*($scope.xc/$('.plane').outerWidth()));
            $scope.ypercent = Math.round(100*($scope.yc/($('.plane').outerHeight())));
        }


      }]);