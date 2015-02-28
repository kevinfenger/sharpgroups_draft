'use strict';

angular.module('drafts').controller('AuctionController', ['$scope', '$http', '$window', '$location', 'Authentication', 'Socket',
    function($scope, $http, $window, $location, Authentication, Socket) {
	$scope.authentication = Authentication;
        if (!$scope.authentication.user) 
            $location.path('signin');
        $scope.increaseBidAmount = 10;  
        $scope.sharpsBeforeBid = 2500;  
        $scope.sharpsAfterBid = 2500;  
        $scope.drafters = [];
        $scope.chats = []; 
        $scope.username = $scope.authentication.user.firstName + ' ' + $scope.authentication.user.lastName;

        Socket.emit('add user', { username : $scope.username, user_id : $scope.authentication.user._id }); 
        
        Socket.addListener('stop typing', function(user) {
            console.log(user);  
        });
        Socket.addListener('new message', function(data) { 
            $scope.chats.push({ name : data.username, text : data.message }); 
        });  
        Socket.on('user joined', function(u) { 
            $scope.chats.push({ name : u.username, text : ' has entered the draft' }); 
        });
        Socket.on('user left', function(u) { 
            $scope.chats.push({ name : u.username, text : ' has left the draft' }); 
        });  
        $scope.chatKeyDown = function(keyDownEvent) { 
            if(keyDownEvent.keyCode === 13) {
                var message = $scope.chatInput;
                if (message && message.length > 0) {  
                   Socket.emit('stop typing', $scope.authentication.user);
                   $scope.chats.push({ name : $scope.username, text : message });
                   $scope.chatInput = '';
                   Socket.emit('new message', message); 
                }
            }  
        };
    } 
])
.directive('sgScrollToBottom', function($interval) { 
   function link(scope, element, attrs) {
       scope.$watch(
          function() { return element[0].children.length; }, 
          function(newValue, oldValue)  { 
             if (newValue !== oldValue) {
                var el = element[0];  
                el.scrollTop = el.scrollHeight + 1;  
             }
          }); 
   }
   return { link : link }; 
});
