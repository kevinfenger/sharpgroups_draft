'use strict'; 

exports.startIO = function(io) { 
    var moment = require('moment'); 
    moment().format(); 
    var userIds = {}; 
    var numUsers = 0;
    var addedUser = false; 
    var currentBid = 0;
    var bidSequence = 0; 
    var checkBidTime = null;  
    var current = new Date().getTime();
    var draftTime = moment(); 
    var currentTime = moment();
    draftTime.add(30, 'minutes');   
    var currentItem = { id : null, headline : 'your auction will start shortly', text : draftTime.diff(currentTime, 'minutes') + ' until draft time', image : 'http://png-5.findicons.com/files/icons/770/token_dark/128/clock.png', bid : 0 } ;

    var checkDraftTime = setInterval(function() { 
        // if we are ready to start the draft, let's emit to
        // sockets the first item it should load up
        currentTime = moment();
        var millis = draftTime.diff(currentTime);
        currentItem.text = moment.duration(millis).humanize() + ' until draft time';
        io.sockets.emit('new item', currentItem);  
        if (draftTime.diff(currentTime) <= 0) { 
           clearInterval(checkDraftTime);
           populateNewItem();  
           io.sockets.emit('new item', currentItem);  
        }
    }, 3000);
    
    function checkComputerBids() { 
        // TODO let's see if any users that did not show 
        // up to the draft wanted to make a bid
    }
    function populateNewItem() { 
       // TODO find an item we haven't used yet 
       // set current item and emit to all those listening 
    }  
    function finishItem() { 
       // TODO save this to mongo, get a new item 
    } 
    function finishAuction() { 
       // TODO call this when we are out of items 
       // thank sockets for coming, output full results to draft page 
    } 
    function makeBid() { 
       bidSequence = 0; 
       if (checkBidTime) 
          clearInterval(checkBidTime); 
          checkBidTime = setInterval(function() { 
             if (bidSequence === 1) 
                console.log(bidSequence);  
             if (bidSequence === 2) 
                console.log(bidSequence);  
             if (bidSequence === 3) {
                console.log(bidSequence);  
                finishItem(); 
                clearInterval(checkBidTime); 
             }  
             bidSequence++; 
         }, 5000);
    } 
    io.on('connection', function (socket) {
        socket.on('add user', function (data) {
            socket.username = data.username; 
            socket.user_id = data.user_id;
            console.log(data);  
            userIds[data.user_id] = data.user_id;
            numUsers++; 
            addedUser = true; 
            socket.broadcast.emit('user joined', {
                username: socket.username,
                numUsers: numUsers
            }); 
            socket.emit('new item', currentItem);  
        });
        socket.on('typing', function () {
           socket.broadcast.emit('typing', {
              username: socket.username
           });
        });
        socket.on('stop typing', function () {
           socket.broadcast.emit('stop typing', {
              username: socket.username
           });
        });
        socket.on('new message', function(data) { 
            socket.broadcast.emit('new message', { 
              username: socket.username, 
              message: data
            }); 
        });
        socket.on('disconnect', function () {
           if (addedUser) {
              delete userIds[socket.user_id];
              --numUsers;

              socket.broadcast.emit('user left', {
                 username: socket.username,
                 numUsers: numUsers
              });
           }
        });
        socket.on('make bid', function(data) { 
            console.log('make bid');  
            makeBid();  
        }); 
        
    }); 
};
