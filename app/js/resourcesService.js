'use strict';

var ResourcesService = angular.module('ResourcesService', ['ngResource']);

/**
 * Handles the resources on the server
 */
ResourcesService.service('ResourcesService', ['$resource',
  function ($resource) {
    return {
      Music: $resource('api/music/:musicId.json', {}, {
        query: {method: 'GET', params: {musicId: 'music'}, isArray: true} //Return all music
      }),

      Labels: $resource('api/labels/:labelId.json', {}, {
        query: {method: 'GET', params: {labelId: 'labels'}, isArray: true}, //Return all labels
        emotions: {method: 'GET', params: {labelId: 'emotions'}, isArray: true} //Return all emotions
      }),

      Features: $resource('api/features/:featureId.json', {}, {
        query: {method: 'GET', params: {featureId: 'features'}, isArray: true} //Return all features
      }),

      Feedback: $resource('api/feedback/:feedbackId.json',{}, {
        query: {method: 'GET', params: {feedbackId: 'feedback'},isArray:true} //Return all feedback questions
      })
    };
  }]);
