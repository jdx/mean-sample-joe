var app = angular.module('app', [
	'ngRoute'
]);
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
angular.module('app')
.controller('PostsCtrl', function ($scope, PostsSvc) {
	$scope.addPost = function () {
		PostsSvc.create({
			username: 'dickeyxxx',
			body: $scope.postBody
		}).success(function (post) {
			$scope.postBody = null;
		});
	};
	
	$scope.$on('ws:new_post', function (_, post) {
	  $scope.$apply(function () {
		$scope.posts.unshift(post)
	  })
	})

  PostsSvc.fetch().success(function (posts) {
		$scope.posts = posts;
	});
});
angular.module('app')
.service('PostsSvc', function ($http) {
  this.fetch = function () {
    return $http.get('/api/posts');
  };
  
  this.create = function (post) {
    return $http.post('/api/posts', post);
  };
});
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
angular.module('app')
.config(function ($routeProvider) {
  $routeProvider
  .when('/', { controller: 'PostsCtrl', templateUrl: 'posts.html' })
  .when('/register', { controller: 'RegisterCtrl', templateUrl: 'register.html' })
  .when('/login', { controller: 'LoginCtrl', templateUrl: 'login.html' })
})
angular.module('app')
.service('UserSvc', function ($http) {
  var svc = this
  svc.getUser = function () {
    return $http.get('/api/users')
  }
  svc.login = function (username, password) {
    return $http.post('/api/sessions', {
      username: username, password: password
    }).then(function (val) {
      svc.token = val.data
      $http.defaults.headers.common['X-Auth'] = val.data
      return svc.getUser()
    })
  }
  svc.register = function (username, password) {
    return $http.post('/api/users', {
    	username: username,
    	password: password
    }).then(function (val) {
      return svc.login(username, password)
    })
  }
})
angular.module('app')
.run(function ($rootScope, $timeout) {
  function websocketHost() {
    return 'ws://' + window.location.host
  }
  (function connect() {
    var url = websocketHost()
    var connection = new WebSocket(url)
    connection.onclose = function (e) {
      console.log('WebSocket closed. Reconnecting...')
      $timeout(connect, 10*1000)
    }
    connection.onmessage = function (e) {
      var payload = JSON.parse(e.data)
      $rootScope.$broadcast('ws:' + payload.topic, payload.data)
    }
  })()
})
