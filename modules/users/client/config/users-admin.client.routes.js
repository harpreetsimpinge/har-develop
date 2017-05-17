'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController'
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
	  .state('admin.workstatus', {
        url: '/workstatus',
        templateUrl: 'modules/users/client/views/admin/workstatus.view.html',
        controller: 'WorkStatusController'
      })
	  .state('admin.allworkstatus', {
        url: '/allworkstatus',
        templateUrl: 'modules/users/client/views/admin/all-workstatus.view.html',
        controller: 'AllWorkStatusController'
      })
	  .state('admin.workstatusedit', {
        url: '/workstatus/edit/:workstatusId',
        templateUrl: 'modules/users/client/views/admin/edit-workstatus.view.html',
        controller: 'EditWorkStatusController'
      })
	  .state('admin.workface', {
        url: '/workface',
        templateUrl: 'modules/users/client/views/admin/workface.view.html',
        controller: 'WorkFaceController'
      })
	  .state('admin.allworkfaces', {
        url: '/allworkfaces',
        templateUrl: 'modules/users/client/views/admin/all-workfaces.view.html',
        controller: 'AllWorkFacesController'
      })
	  .state('admin.workfaceedit', {
        url: '/workface/edit/:workfaceId',
        templateUrl: 'modules/users/client/views/admin/edit-workface.view.html',
        controller: 'EditWorkFaceController'
      });
  }
]);
