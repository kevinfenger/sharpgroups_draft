'use strict';

var users = require('../../app/controllers/users'), 
    draft = require('../../app/controllers/draft');
module.exports = function(app) {
	// Draft Routes
        app.route('/drafts') 
            .get(users.requiresLogin, draft.list); 
        app.route('/drafts') 
            .put(users.requiresLogin, draft.update); 
	app.route('/draft/create')
            .post(users.requiresLogin, draft.create);
	app.route('/draft/join')
            .post(users.requiresLogin, draft.join);
        app.route('/draft/findUserDrafts') 
            .get(users.requiresLogin, draft.findUserDrafts); 
};
