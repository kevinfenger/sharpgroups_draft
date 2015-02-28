'use strict';

angular.module('drafts').controller('AuctionController', ['$scope', '$http', '$window', '$location', 'Authentication', 'Socket',
    function($scope, $http, $window, $location, Authentication, Socket) {
	$scope.authentication = Authentication;
        if (!$scope.authentication.user) 
            $location.path('signin');
        var minHeight = '350px'; 
        $scope.increaseBidAmount = 10;  
        $scope.sharpsBeforeBid = 2500;  
        $scope.sharpsAfterBid = 2500;  
        $scope.chatCollapsed = false;
        $scope.infoCollapsed = false; 
        $scope.chatBodyHeight = minHeight; 
        $scope.chatWrapperHeight = minHeight; 
        $scope.infoWrapperHeight = minHeight; 
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
        $scope.collapseChat = function() { 
           $scope.chatCollapsed = true;
           $scope.chatWrapperHeight = '0px'; 
           $scope.chatBodyHeight = '0px'; 
        }; 
        $scope.maxChat = function() { 
           $scope.chatCollapsed = false; 
           $scope.chatWrapperHeight = minHeight; 
           $scope.chatBodyHeight = minHeight; 
        }; 
        $scope.collapseInfo = function() { 
           $scope.infoCollapsed = true;
           $scope.infoWrapperHeight = '0px'; 
        }; 
        $scope.maxInfo = function() { 
           $scope.infoCollapsed = false; 
           $scope.infoWrapperHeight = minHeight; 
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
})
.directive('draggableElement', function($document) { 
    function link(scope, element, attrs) { 
      var startX = 0, startY = 0, x = 0, y = 0, headingHeight=35;

      element.css({
       position: 'relative',
      });

      function goodCoordinates(curY, eleTop) { 
          return (curY - eleTop) < headingHeight;
      }
      element.on('mouseover', function(event) { 
          var curY = event.pageY;
          var eleTop = element[0].getBoundingClientRect().top; 
          if (goodCoordinates(curY, eleTop)) { 
             element.css({
               cursor: 'move'
             });
          }
          else { 
             element.css({
               cursor: 'auto'
             });
          }
      });  
      element.on('mousedown', function(event) {
        var curY = event.pageY;
        var eleTop = element[0].getBoundingClientRect().top; 
        if (goodCoordinates(curY, eleTop)) { 
          event.preventDefault();
          startX = event.pageX - x;
          startY = event.pageY - y;
          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);
        }
      });

      function mousemove(event) {
        y = event.pageY - startY;
        x = event.pageX - startX;
        element.css({
          top: y + 'px',
          left:  x + 'px'
        });
      }

      function mouseup() {
        $document.off('mousemove', mousemove);
        $document.off('mouseup', mouseup);
      }
    } 
    return { link : link }; 
});
