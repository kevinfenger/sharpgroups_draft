'use strict'; 

exports.startIO = function(io) { 
    var moment = require('moment'), 
	mongoose = require('mongoose'),
	Draft = mongoose.model('Draft'),
        FantasyTeam = mongoose.model('FantasyTeam'); 
    moment().format(); 
    // TODO This should know it's draft id when it's sent in with node-scheduel, hard-code for now. 
    var draft = null;
    var allDraftItems = null;
    var soldItems = null;  
    var userIds = {}; 
    var numUsers = 0;
    var addedUser = false; 
    var currentBid = 0;
    var bidSequence = 0; 
    var checkBidTime = null;  
    var current = new Date().getTime();
    var draftTime = moment(); 
    var currentTime = moment();
    draftTime.add(1, 'minutes');   
    var currentItem = { id : null, 
                        name : 'Test Object', 
                        headline : 'your auction will start shortly', 
                        text : draftTime.diff(currentTime, 'seconds') + ' until draft time', 
                        image : 'http://png-5.findicons.com/files/icons/770/token_dark/128/clock.png', 
                        bid : 0, 
                        state: -2, 
                        bidder: 'NO BIDDER'
                      };

    var checkDraftTime = setInterval(function() { 
        // if we are ready to start the draft, let's emit to
        // sockets the first item it should load up
        currentTime = moment();
        var millis = draftTime.diff(currentTime);
        currentItem.text = moment.duration(millis).humanize() + ' until draft time';
        if (draftTime.diff(currentTime) <= 0) { 
           clearInterval(checkDraftTime);
           io.sockets.emit('auction has started');  
           populateNewItem();  
        }
        else { 
           io.sockets.emit('new item', currentItem);  
        }
    }, 3000);
        //io.sockets.emit('new item', currentItem);  
    function getDraftById(id) { 
       Draft.findById(id).populate('items').exec(function(err, doc) { 
           draft = doc;
           console.log(draft);
           // TODO randominze this array
           allDraftItems = draft.items;  
           console.log(allDraftItems);  
       }); 
    } 
    getDraftById('54f3e1f5a7f0c56d21ebb36a');  
    function checkComputerBids() { 
        // TODO let's see if any users that did not show 
        // up to the draft wanted to make a bid
    }
    function populateNewItem() { 
       // TODO find an item we haven't used yet 
       // set current item and emit to all those listening
       if (allDraftItems.length > 0) {  
          var newItem = allDraftItems.pop();
          console.log(allDraftItems); 
          currentItem.id = newItem._id; 
          currentItem.name = newItem.name; 
          currentItem.headline = 'Teams are up for bidding'; 
          currentItem.text = newItem.name; 
          currentItem.image = newItem.image; 
          currentItem.bid = 0; 
          currentItem.state = -1; 
          currentItem.seed = newItem.seed; 
          currentItem.division = newItem.division; 
          currentItem.bidder = 'NO BIDDER'; 
          console.log(currentItem);  
          io.sockets.emit('new item', currentItem);  
       } 
       else { 
           finishAuction(); 
       } 
    }  
    function finishItem(data) { 
       FantasyTeam.findById(data.teamId,  function(err, doc) { 
           doc.sharps -= data.bid;
           // TODO as soon as we have a valid item_id add it too doc.fantasyPlayers.push(item_id); 
           doc.save();
           io.sockets.emit('sold', doc);
           populateNewItem();  
           // TODO get the next item and emit it
       }); 
        
    } 
    function finishAuction() { 
       // TODO call this when we are out of items 
       // thank sockets for coming, output full results to draft page 
    } 
    function makeBid(data) { 
       if (data.bid > currentItem.bid) {
          currentItem.bid = data.bid;
          currentItem.bidder = data.username;  
          bidSequence = currentItem.state = 0; 
          //io.sockets.emit('auction status', { name : currentItem.name, info : 'New Bidder', bidder : data.username, amount : data.bid });  
          if (checkBidTime) 
             clearInterval(checkBidTime);
          io.sockets.emit('auction status', currentItem);  
          currentItem.state = ++bidSequence; 
          checkBidTime = setInterval(function() { 
             io.sockets.emit('auction status', currentItem);  
             if (bidSequence === 3) {
                io.sockets.emit('auction status', currentItem);  
                finishItem(data); 
                clearInterval(checkBidTime); 
             }
             else { 
                currentItem.state = ++bidSequence; 
             }
          }, 5000);
       }
    } 
    io.on('connection', function (socket) {
        socket.on('add user', function (data) {
            socket.username = data.username; 
            socket.userId = data.userId;
            userIds[data.userId] = data.userId;
            numUsers++; 
            addedUser = true; 
            socket.broadcast.emit('user joined', {
                username: socket.username,
                numUsers: numUsers
            }); 
            //socket.emit('new item', currentItem);  
            if (draftTime.diff(currentTime) <= 0) { 
               io.sockets.emit('auction has started');  
            }
            socket.emit('auction status', currentItem);  
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
              delete userIds[socket.userId];
              --numUsers;

              socket.broadcast.emit('user left', {
                 username: socket.username,
                 numUsers: numUsers
              });
           }
        });
        socket.on('make bid', function(data) { 
            console.log('make bid');  
            makeBid(data);  
        }); 
        
    }); 
};
