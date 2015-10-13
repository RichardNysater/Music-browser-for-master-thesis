'use strict';

/**
 * indexController controls the index-template.
 */
var controllers = angular.module('myApp.indexController',[]);

controllers.controller('indexController',['$scope','$location',
    function($scope,$location){

        /**
         * Handle the fixed navbar
         */
        $scope.sections = [{"id":"Home","link":"#player"},{"id":"Plane","link":"#plane"},{"id":"Sliders","link":"#sliders"}];

        var initPath = $location.path().split("/")[1]||"Home";
        var selected = $scope.sections[0];

        for(var i = 0; i<$scope.sections.length;i++){ // Highlights the current location on the navbar
            if($scope.sections[i].link ==='#'+initPath){
                selected=$scope.sections[i];
                break;
            }
        }



        /**
         * Returns true if section is selected, false otherwise
         * @param section The section to check if selected
         * @returns {boolean} True if selected, false otherwise
         */
        $scope.isSelected = function(section){
            return (section === selected);
        };

        /**
         * Sets a section as the current one
         * @param section The section to set as selected
         */
        $scope.setSelected = function(section){
            selected = section;
        };


        /*$(".nav a").on("click", function(){
         $(".nav").find(".active").removeClass("active");
         $(this).parent().addClass("active");
         });*/

    }]);