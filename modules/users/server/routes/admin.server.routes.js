'use strict';

/**
 * Module dependencies.
 */
var adminPolicy = require('../policies/admin.server.policy'),
  admin = require('../controllers/admin.server.controller');

module.exports = function (app) {
  // User route registration first. Ref: #713
  require('./users.server.routes.js')(app); 

  // Users collection routes
  app.route('/api/users')
    .get(adminPolicy.isAllowed, admin.list);

  // Single user routes
  app.route('/api/users/:userId')
    .get(adminPolicy.isAllowed, admin.read)
    .put(adminPolicy.isAllowed, admin.update)
    .delete(adminPolicy.isAllowed, admin.delete);

  app.route('/api/unblock_user/:code').get(admin.unblock);
  
  app.route('/api/unblock_user/:code').get(admin.unblock);
  
  // Workstatus routes
  app.route('/api/allworkstatus').get(admin.allworkstatus);
  app.route('/api/saveworkstatus').post(admin.saveworkstatus);
  app.route('/api/geteditworkstatus/:workstatusId').get(admin.geteditworkstatus);
  app.route('/api/updateworkstatus/:workstatusId').post(admin.updateworkstatus);
  app.route('/api/removeworkstatus/:workstatusId').get(admin.removeworkstatus);
  
  // Workfaces routes
  app.route('/api/allworkfaces').get(admin.allworkfaces);
  app.route('/api/saveworkface').post(admin.saveworkface);
  app.route('/api/geteditworkface/:workfaceId').get(admin.geteditworkface);
  app.route('/api/updateworkface/:workfaceId').post(admin.updateworkface);
  app.route('/api/removeworkface/:workfaceId').get(admin.removeworkface);
	
  // Finish by binding the user middleware
  app.param('userId', admin.userByID);
};
 