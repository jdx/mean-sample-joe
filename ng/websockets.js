angular.module('app')
.run(function ($rootScope, $timeout) {
  (function connect() {
    var url = 'ws://localhost:3000'
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