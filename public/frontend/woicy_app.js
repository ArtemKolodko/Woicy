angular.module('WoicyApp', [])
    .controller('AddRecordController', ['$scope', '$http', function($scope, $http) {
        $scope.submit = function() {
            $http.post('/appendRecord', {msg:'hello word!'}).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        };
    }]);