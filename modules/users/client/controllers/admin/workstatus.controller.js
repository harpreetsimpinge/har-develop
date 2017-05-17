'use strict';

 angular.module('users.admin').controller('WorkStatusController', ['$scope', '$location', '$http', '$filter', 'Admin', 'toastr',
  function ($scope, $location, $http, $filter, Admin, toastr) {
	  
	$scope.saveworkstatus = function (isValid) {

		$scope.success = $scope.error = null;
		
		if (!isValid) {
			$scope.$broadcast('show-errors-check-validity', 'workStatusForm');
			return false;
		} 
				
		$http.post('/api/saveworkstatus', $scope.workstatus).
			then(function(response) {
				console.log(response);
				if(response.data.msg == 'success') {
					toastr.success('Work Status Saved');
					$location.path('admin/allworkstatus');
				} else {
					toastr.error('Error Adding New Work Status');
				}
			}
        );
    };
  } 
]); 
