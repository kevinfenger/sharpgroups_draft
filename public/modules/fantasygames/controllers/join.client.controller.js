'use strict';

angular.module('fantasygames').controller('JoinController', ['$scope', '$http', '$location', 'Authentication', 'FantasyGames',
    function($scope, $http, $location, Authentication, FantasyGames) {
	$scope.authentication = Authentication; 
        if (!$scope.authentication.user) 
            $location.path('signin');
        $scope.addUserToFantasyGame = function(draft) {
                $http.post('/fantasygame/join', draft).success(function(response) { 
                   console.log(response); 
                }).error(function(response) {
                    $scope.error = response.message;
                });
            };
            // find all drafts that are joinable
            $scope.find = function() {
                // Drafts.query() calls the /drafts server endpoint
                // may need to change this to get currently in/out drafts
                $scope.drafts = FantasyGames.query();
            }; 
    } 
]);  
