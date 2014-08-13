angular.module('app')
.controller('ApplicationCtrl', function ($scope, $location) {
  $scope.$on('login', function (_, user) {
    $scope.currentUser = user
    $location.path('/')
  })
  $scope.logout = function () {
    $scope.currentUser = null
    $location.path('/')
  }
})