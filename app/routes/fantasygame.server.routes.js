'use strict';

var users = require('../../app/controllers/users'), 
    fantasygame = require('../../app/controllers/fantasygame');
module.exports = function(app) {
	// Fantasy Game Routes
	app.route('/fantasygame/create')
            .post(users.requiresLogin, fantasygame.create);
//        app.route('/draft/enter') 
  //          .post(users.requiresLogin, draft.enter); 
//	app.route('/fantasygame/join')
  //          .post(users.requiresLogin, fantasygame.join);
    //    app.route('/fantasygame/:fantasyGameById') 
      //      .get(users.requiresLogin); 
        
       // app.param('fantasyGameId', fantasygame.fantasyGameById);  
};
