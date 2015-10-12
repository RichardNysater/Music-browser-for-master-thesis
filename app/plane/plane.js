'use strict';

//<option ng-repeat="label in labels" value="{{$index}}">{{label.id}}</option>
angular.module('myApp.plane', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/plane', {
    templateUrl: 'plane/plane.html',
    controller: 'PlaneCtrl'
  });
}])

.controller('PlaneCtrl', ['$scope','Api',
      function ($scope,Api) {

        //Get labels and initialize select boxes
        Api.Labels.query().$promise.then(function(data){
          $scope.labels = data;
          $scope.firstSelect = data[0];
          $scope.secondSelect = data[1];
        }, function(err){
          throw "No labels were returned by query.";
        });

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