'use strict';

angular.module('drafts').controller('MyFantasyGamesController', ['$scope', '$http', '$location', 'Authentication',
    function($scope, $http, $location, Authentication, Drafts) {
	$scope.authentication = Authentication; 
        if (!$scope.authentication.user) 
            $location.path('signin');
    } 
]);
