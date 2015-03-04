'use strict';

angular.module('drafts').factory('FantasyGames', ['$resource',
        function($resource) {
                return $resource('fantasygames/:fantasyGameId', {
                        draftId: '@_id'
                }, {
                        update: {
                                method: 'PUT'
                        }
                });
        }
]);
