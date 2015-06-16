angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
 
  $scope.checkConnection = function () {
      console.log('Click');
      var networkState = navigator.connection.type;
      var states = {};
            states[Connection.UNKNOWN]  = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI]     = 'WiFi connection';
            states[Connection.CELL_2G]  = 'Cell 2G connection';
            states[Connection.CELL_3G]  = 'Cell 3G connection';
            states[Connection.CELL_4G]  = 'Cell 4G connection';
            states[Connection.CELL]     = 'Cell generic connection';
            states[Connection.NONE]     = 'No network connection';

            window.alert('Connection type: ' + states[networkState]);
        };
})


.controller('ChatsCtrl', function($scope) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
$scope.temp = {};
$scope.salin = {};
$scope.doRecord = function() {
  if ($scope.temp.data<40 && $scope.temp.depth<10) {
    if($scope.salin.data<40 && $scope.salin.depth<10) {
      window.alert("Success");
    }
    else{
      window.alert("Please check your salinity values.")
    }
  }
  else if ($scope.salin.data<40 && $scope.salin.depth<10) {
    if($scope.temp.data<40 && $scope.temp.depth<10) {
      window.alert("Success");
    }
  else{
    window.alert("Please check your temperature values.")
    }
  }    
  else {
    window.alert("Your values are incorrect. Please check that your values are within the tolerances.");
  }
}
})


// .controller('AccountCtrl', function($scope, $cordovaFile, $ionicPlatform) {
// $ionicPlatform.ready(function() {
//    console.log("Ionic is ready.");
//    $cordovaFile.getFreeDiskSpace()
//      .then(function (success) {
         // success in kilobytes
//      }, function (error) {
          // error
//      });
//});



.controller('AccountCtrl', function($scope, $cordovaGeolocation) {

var pos0ptions = {timeout: 10000, enableHighAccuracy: true};
$scope.doLocate = function () {
  console.log("click")
  $cordovaGeolocation.getCurrentPosition(pos0ptions).then(function(position){
    console.log('Latitude: '    + position.coords.latitude           + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');

}, function(err) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
});
}





  
})
