'use strict';

 angular.module('users.admin').controller('WorkFaceController', ['$scope', '$location', '$http', '$filter', 'Admin', 'toastr',
  function ($scope, $location, $http, $filter, Admin, toastr) {
	  
	$http.get('/api/allworkstatus').
		then(function(response) {
			$scope.allworkstatus = response.data;
		}
	);
	  
	$scope.saveworkface = function (isValid) {
		
		$scope.success = $scope.error = null;
		
		if (!isValid) {
			$scope.$broadcast('show-errors-check-validity', 'workFaceForm');
			return false;
		} 
				
		$http.post('/api/saveworkface', $scope.workface).
			then(function(response) {
				console.log(response);
				if(response.data.msg == 'success') {
					toastr.success('Work Face Saved');
					$location.path('admin/allworkfaces');
				} else {
					toastr.error('Error Adding New Work Face');
				}
			}
        );
    };
  } 
]); 
