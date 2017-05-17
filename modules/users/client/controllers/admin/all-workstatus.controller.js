'use strict';

 angular.module('users.admin').controller('AllWorkStatusController', ['$scope', '$location', '$http', '$filter', 'Admin', 'toastr',
  function ($scope, $location, $http, $filter, Admin, toastr) {
	  
	$http.get('/api/allworkstatus').
		then(function(response) {
			//console.log(response.data);
			$scope.allworkstatus = response.data;
		}
	);

	/*
	toastr.warning('Note deleted');
          $('#' + note).fadeOut(300, function() { $(this).remove(); });
    */
	
	$scope.removeworkstatus = function (workstatusId) {
		$http.get('/api/removeworkstatus/'+workstatusId).
			then(function(response) {
				toastr.success('Work Status Removed');
				$('#' + workstatusId).fadeOut(300, function() { $(this).remove(); });
				//window.location.reload();
			}
		);
	}
  } 
]); 
