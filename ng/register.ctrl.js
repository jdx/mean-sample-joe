angular.module('app')
.controller('RegisterCtrl', function ($scope, $location, UserSvc) {
  $scope.register = function (username, password) {
    UserSvc.register(username, password)
    .then(function (response) {
      $scope.$emit('login', response.data)
      $location.path('/')
    })
  }
})