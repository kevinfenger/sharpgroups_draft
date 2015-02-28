'use strict'; 

exports.startIO = function(io) { 
    var userIds = {}; 
    var numUsers = 0;
    var addedUser = false; 
    var currentBid = 0; 
 
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
        socket.on('bid received', function(data) { 
             // if data.currentBid < currentBid socket.
            //   socket.emit('' data.user bid 50
            // else 
        }); 
        
    }); 
};
