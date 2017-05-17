'use strict';

 angular.module('users.admin').controller('AllWorkFacesController', ['$scope', '$location', '$http', '$filter', 'Admin', 'toastr',
  function ($scope, $location, $http, $filter, Admin, toastr) {
	  
	$http.get('/api/allworkfaces').
		then(function(response) {
			$scope.allworkfaces = response.data;
		}
	);
	
	$scope.removeworkface = function (workfaceId) {
		$http.get('/api/removeworkface/'+workfaceId).
			then(function(response) {
				toastr.success('Work Face Removed');
				//window.location.reload();
				$('#' + workfaceId).fadeOut(300, function() { $(this).remove(); });
			}
		);
	}
  } 
]); 
