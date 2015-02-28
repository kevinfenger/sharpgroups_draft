'use strict';

angular.module('drafts').controller('JoinController', ['$scope', '$http', '$location', 'Authentication', 'Drafts',
    function($scope, $http, $location, Authentication, Drafts) {
	$scope.authentication = Authentication; 
        if (!$scope.authentication.user) 
            $location.path('signin');
        $scope.addUserToDraft = function(draft) {
                $http.post('/draft/join', draft).success(function(response) { 
                   console.log(response); 
                }).error(function(response) {
                    $scope.error = response.message;
                });
            };
            // find all drafts that are joinable
            $scope.find = function() {
                // Drafts.query() calls the /drafts server endpoint
                // may need to change this to get currently in/out drafts
                $scope.drafts = Drafts.query();
            }; 
    } 
]);  
