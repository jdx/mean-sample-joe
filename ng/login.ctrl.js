angular.module('app')
.controller('LoginCtrl', function ($scope, $location, UserSvc) {
  $scope.login = function (username, password) {
    UserSvc.login(username, password)
    .then(function (response) {
      $scope.$emit('login', response.data)
      $location.path('/')
    })
  }
})