angular.module('starter.controllers', [])
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});


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


.controller('ChatsCtrl', function($scope, $cordovaGeolocation, $cordovaFile, $cordovaFileTransfer, $ionicPlatform) {

//Defining Input Fields
  $scope.temp = {};
  $scope.salin = {};
  $scope.sechi = {};
  $scope.weather = {};
  $scope.userSID = {};
  $scope.a = {
    temp:1, 
    salin:2, 
    sechi:3, 
    weather:4
  };
  $scope.loc = {};
  

//Updates the Session ID and Retrieves Location Data
  $scope.getSID = function () {
    var SID = $scope.userSID.data;
    console.log('Your session ID is ' + SID);
    window.alert ('Your new session ID is ' + SID);
    var pos0ptions = {timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation.getCurrentPosition(pos0ptions).then(function(position){
      console.log('Latitude: '    + position.coords.latitude           + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');

      $scope.loc.lat = position.coords.latitude
      $scope.loc.lon = position.coords.longitude
      $scope.loc.alt = position.coords.altitude 
      $scope.loc.acc = position.coords.accuracy
      $scope.loc.head = position.coords.heading
      $scope.loc.DTG = position.coords.timestamp
      $scope.loc.speed = position.coords.speed 

    }, function(err) {
      alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
    })
  };


//Parent export function: Should save file, tick up counter, and clear field
  $scope.doSave = function (a) {
   $ionicPlatform.ready(function(a) {
      var SID = $scope.userSID.data;
    
      if (a == 1) {
        var data1 = "temp.data + ', ' + temp.depth";
        var variable = "temperature";
        document.getElementById("counter-1").innerHTML = 1
      }
       if (a == 2) {
        var data1 = "salin.data + ', ' + salin.depth";
        var variable = "salinity";
        document.getElementById("counter-2").innerHTML = 1
      }
       if (a = "3") {
        var data1 = "sechi.depth";
        var variable = "sechi";
        document.getElementById("counter-3").innerHTML = 1
      }
       if (a = "4") {
        var data1 = "weather.data";
        var variable = "weather";
        document.getElementById("counter-4").innerHTML = 1
      }

      var DTG = Date.now()
      //var fileName = SID + "_" + variable + "_" + DTG + ".oskit";
      var fileName = "test.txt"
      console.log("FILENAME: " + fileName);
      console.log(data1);



      $cordovaFile.writeFile(cordova.file.documentsDirectory, fileName, data1, true)
      .then(function (success) {
        console.log('File successfully saved.');
        console.log(success);
        $cordovaFile.checkFile(cordova.file.documentsDirectory, fileName)
        .then(function (success) {
          console.log("File found.")

        }, function (error) {
          console.log("File not found");
          });

        
      }, function (error) {
        console.log(error);
      });

    })
  };



// Upload function: Should upload all files in directory
$scope.doUpload = function() {
console.log("click");
     var server = "http://www7330.nrlssc.navy.mil/derada/AEC/upload.php";
      var options = {
          fileName: "test.txt",
          httpMethod: "POST",
          chunkedMode: false,
          mimeType: "text/plain"
      };

      var trustAllHosts = true
      var filePath = cordova.file.documentsDirectory + "test.txt"

$cordovaFileTransfer.upload(server, filePath, options)
      .then(function(result) {
            console.log(success);
            }, function(err) {
            console.log(err);
            }, function (progress) {
              console.log(progress);
            });
};
})





.controller('AccountCtrl', function($scope, $cordovaGeolocation) {
$scope.doRemove = function() {
  window.alert("Local cache cleared.");
}  
})
