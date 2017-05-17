'use strict';

 angular.module('users.admin').controller('EditWorkFaceController', ['$scope', '$location', '$http', '$filter', 'Admin', 'toastr','$stateParams',
  function ($scope, $location, $http, $filter, Admin, toastr, $stateParams) {

	//console.log($stateParams.workstatusId);

	$http.get('/api/geteditworkface/'+$stateParams.workfaceId).
		then(function(response) {
			$scope.workface = response.data; 
		}
	);
	
	$http.get('/api/allworkstatus').
		then(function(response) {
			//console.log(response.data);
			$scope.allworkstatus = response.data;
		}
	);
 
    $scope.updateworkface = function (isValid) {

		$scope.success = $scope.error = null;
		
		if (!isValid) {
			$scope.$broadcast('show-errors-check-validity', 'workFaceForm');
			return false;
		} 
		
		$http.post('/api/updateworkface/'+$stateParams.workfaceId, $scope.workface).
			then(function(response) {
				console.log(response);
				if(response.data.msg == 'success') {
					toastr.success('Work Face Updated');
					$location.path('admin/allworkfaces');
				} else {
					toastr.error('Error Updating New Work Face');
				}
			}
        );
    };
  } 
]); 
