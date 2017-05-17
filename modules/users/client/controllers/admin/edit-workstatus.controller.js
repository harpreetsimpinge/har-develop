'use strict';

 angular.module('users.admin').controller('EditWorkStatusController', ['$scope', '$location', '$http', '$filter', 'Admin', 'toastr','$stateParams',
  function ($scope, $location, $http, $filter, Admin, toastr, $stateParams) {

	//console.log($stateParams.workstatusId);

	$http.get('/api/geteditworkstatus/'+$stateParams.workstatusId).
		then(function(response) {
			console.log(response.data);
			$scope.workstatus = response.data; 
			console.log(response.data.price);
		}
	);

	 
    $scope.updateworkstatus = function (isValid) {

		$scope.success = $scope.error = null;
		
		if (!isValid) {
			$scope.$broadcast('show-errors-check-validity', 'workStatusForm');
			return false;
		} 
		
		$http.post('/api/updateworkstatus/'+$stateParams.workstatusId, $scope.workstatus).
			then(function(response) {
				console.log(response);
				if(response.data.msg == 'success') {
					toastr.success('Work Status Updated');
					$location.path('admin/allworkstatus');
				} else {
					toastr.error('Error Updating New Work Status');
				}
			}
        );
    };
  } 
]); 
