'use strict';

angular.module('drafts').controller('AuctionController', ['$scope', '$stateParams', '$http', '$window', '$filter', '$location', 'Authentication', 'Socket', 'draft',
    function($scope, $stateParams, $http, $window, $filter, $location, Authentication, Socket, draft, teamId) {
	$scope.authentication = Authentication;
        if (!$scope.authentication.user) 
            $location.path('signin');
        var minHeight = '350px'; 
        var minBid = $scope.newBidAmount = draft.minSharpBidIncrease;
        $scope.chatCollapsed = false;
        $scope.infoCollapsed = false;
        $scope.chatBodyHeight = minHeight; 
        $scope.chatWrapperHeight = minHeight; 
        $scope.infoWrapperHeight = '450px';
        $scope.soldState = false;
        $scope.auctionStarted = false; 
        $scope.auctionTextStyle = '';  
        $scope.currentItem = null;  
        $scope.chats = [];
        $scope.draft = draft;
        $scope.team = $filter('filter')(draft.fantasyTeams, { owner : $scope.authentication.user._id })[0];
        $scope.username = $scope.authentication.user.firstName + ' ' + $scope.authentication.user.lastName;

        Socket.emit('add user', { username : $scope.username, userId : $scope.authentication.user._id }); 
        
        Socket.addListener('stop typing', function(user) {
            console.log(user);  
        });
        Socket.addListener('auction has started', function(user) {
            $scope.auctionStarted = true;   
        });
        Socket.addListener('new message', function(data) { 
            $scope.chats.push({ name : data.username, text : data.message }); 
        });
        Socket.addListener('auction status', function(data) { 
            $scope.currentItem = data; 
            $scope.newBidAmount = data.bid + minBid;
            if ($scope.currentItem.state === -2) {
               $scope.auctionText = 'waiting for an item'; 
            }
            if ($scope.currentItem.state === -1) {
               $scope.auctionTextStyle = 'rgb(173,127,67)';  
               $scope.auctionText = data.name + ' is the new item'; 
            }
            if ($scope.currentItem.state === 0) {
               $scope.auctionTextStyle = 'rgb(95,57,57)';  
               $scope.auctionText = data.bidder + ' is the new bidder!'; 
            }
            if ($scope.currentItem.state === 1) {
               $scope.auctionTextStyle = 'green';  
               $scope.auctionText = 'Going Once!'; 
            }
            if ($scope.currentItem.state === 2) { 
               $scope.auctionTextStyle = 'blue';  
               $scope.auctionText = 'Going Twice!!'; 
            }
            if ($scope.currentItem.state === 3) {
               $scope.auctionTextStyle = 'red';  
               $scope.auctionText = 'Sold!!!'; 
               // to prevent any new bids, while we do the DB operations on the server
               $scope.soldState = true;  
            }
        }); 
        Socket.addListener('sold', function(data) {
             if (data._id === $scope.team._id) { 
                $scope.team = data;  
             } 
        });  
        Socket.on('user joined', function(u) { 
            $scope.chats.push({ name : u.username, text : ' has entered the draft' }); 
        });
        Socket.on('user left', function(u) { 
            $scope.chats.push({ name : u.username, text : ' has left the draft' }); 
        }); 
        Socket.on('new item', function(data) {
            $scope.auctionTextStyle = '{}';  
            $scope.currentItem = data;
            $scope.soldState = false;  
            $scope.newBidAmount = data.bid + minBid; 
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
        $scope.incrementBid = function() { 
            $scope.newBidAmount = $scope.newBidAmount >= $scope.currentItem.bid ? $scope.newBidAmount + minBid : $scope.currentItem.bid + minBid; 
        }; 
        $scope.decrementBid = function() { 
            $scope.newBidAmount = ($scope.newBidAmount - minBid) > $scope.currentItem.bid ? ($scope.newBidAmount - minBid) : $scope.currentItem.bid + minBid; 
        }; 
        $scope.minBid = function() { 
           $scope.newBidAmount = $scope.currentItem.bid + minBid; 
        }; 
        $scope.maxBid = function() { 
           $scope.newBidAmount = $scope.team.sharps; 
        }; 
        $scope.executeBid = function() {
            Socket.emit('make bid', { bid : $scope.newBidAmount, username : $scope.username, userId : $scope.authentication.user._id, teamId : $scope.team._id });
        }; 
        $scope.findOne = function() { 
            $http.get('/drafts/' + $stateParams.draftId). 
                success(function(draft) { 
                   $scope.draft = draft;
                }). 
                error(function(data) { 
                   console.log(data); 
                });  
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
           $scope.infoWrapperHeight = '450px'; 
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
