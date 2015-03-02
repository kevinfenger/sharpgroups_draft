'use strict';

angular.module('drafts').factory('Drafts', ['$resource',
        function($resource) {
                return $resource('drafts/:draftId', {
                        draftId: '@_id'
                }, {
                        update: {
                                method: 'PUT'
                        }
                });
        }
]);
