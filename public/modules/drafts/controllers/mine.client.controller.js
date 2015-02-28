'use strict';

angular.module('drafts').controller('MyDraftsController', ['$scope', '$http', '$location', 'Authentication', 'Drafts',
    function($scope, $http, $location, Authentication, Drafts) {
	$scope.authentication = Authentication; 
        if (!$scope.authentication.user) 
            $location.path('signin');
        $scope.findUserDrafts = function() {
                $http.get('/draft/findUserDrafts').success(function(response) { 
                   $scope.drafts = response; 
                }).error(function(response) {
                    $scope.error = response.message;
                });
            };
        $scope.enterDraft = function(draft) {
//                $http.post('/draft/enter', draft).success(function(response) { 
  //                 console.log(response); 
                   $location.path('drafts/'+draft.id);
    //            }).error(function(response) {
      //              console.log(response); 
        //            $scope.error = response.message;
          //      });
            };
    } 
])
.directive('sgTimeUntilDraft', function($interval) { 
   function link(scope, element, attrs) {
       var timeoutId; 
       function timeLeft() { 
           var dateTimeFrom = Date.parse(attrs.dateTimeFrom); 
           var currentTime = Date.parse(new Date());
           var diff = (dateTimeFrom - currentTime) / 1000;
           if (diff < 0) 
              return 'Already Started'; 

           var days = Math.floor(diff / 86400); 
           diff -= days * 86400; 
           var hours = Math.floor(diff / 3600) % 24; 
           diff -= hours * 3600; 
           var mins = Math.floor(diff / 60) % 60;
           diff -= mins * 60; 
           var secs  = Math.floor(diff) % 60;
           
           if (days > 0) 
               return days + ' Days '; 
           if (hours > 0) 
               return hours + ' Hours ' + (mins >= 10 ? mins : ('0' + mins)) + ' Minutes ' + (secs >= 10 ? secs : ('0' + secs)) + ' Seconds'; 
           if (mins > 0) 
               return (mins >= 10 ? mins : ('0' + mins)) + ' Minutes ' + (secs >= 10 ? secs : ('0' + secs)) + ' Seconds'; 
           if (secs > 0) 
               return secs + ' Seconds'; 
       }  
       function updateTime() {
           element.text(timeLeft());
       }   
       timeoutId = $interval(function() {
          updateTime();
       }, 1000); 
   }
   return { link : link }; 
})
.directive('sgshowgobutton', function($interval) { 
    var f = function link(scope, element, attrs) {
       function isButtonVisible() { 
           var dateTimeFrom = Date.parse(attrs.dateTimeFrom); 
           var currentTime = Date.parse(new Date());
           var diff = (dateTimeFrom - currentTime) / 1000;
           if (diff < 0) 
              return true; 

           var days = Math.floor(diff / 86400); 
           diff -= days * 86400; 
           var hours = Math.floor(diff / 3600) % 24; 
           diff -= hours * 3600; 
           var mins = Math.floor(diff / 60) % 60;
           diff -= mins * 60; 
           var secs  = Math.floor(diff) % 60;
           
           if (days === 0 && hours === 0 && mins < 30) 
               return true;
 
           return false; 
       } 
       var timeoutId;
       var whereto = attrs.whereto; 
       var label = attrs.label; 
       scope.showButton = false;
       function updateButton() {
          scope.showButton = isButtonVisible(); 
       }
       timeoutId = $interval(function() {
          updateButton();
       }, 1000); 
    };
    return { 
        link : f,
        restrict: 'E', 
        scope : { 
            label: '@', 
            whereto: '@' 
        },
        template: '<button class="btn btn-info btn-xs" ng-show="showButton" href="{{whereto}}">{{label}}</button>', 
        transclude: true
    }; 
});  
