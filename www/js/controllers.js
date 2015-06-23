angular.module('starter.controllers', [])
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

.controller('DashCtrl', function($scope) {
 
 //Connection Status Function
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


.controller('ChatsCtrl', function($scope, $cordovaGeolocation, $cordovaFile, $cordovaFileTransfer, $ionicPlatform, $timeout) {

//Defining Input Fields
  $scope.temp = {};
  $scope.salin = {};
  $scope.sechi = {};
  $scope.weather = {};
  $scope.userSID = {};
  $scope.a = {
    temp:0, 
    salin:1, 
    sechi:2, 
    weather:3
  };
  $scope.loc = {};
  

//Updates the Session ID and Retrieves Location Data
  $scope.getSID = function () {
    var SID = $scope.userSID.data;
    console.log('Session ID set to: ' + SID);
    window.alert ('Your new session ID is ' + SID);
    var pos0ptions = {timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation.getCurrentPosition(pos0ptions)
      .then(function(position){
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
  $scope.doSave = function (e) {
   $ionicPlatform.ready(function(e) {
      var SID = $scope.userSID.data;
      var DTG = Date.now();
      $cordovaFile.createDir(cordova.file.documentsDirectory, SID, false)
      .then(function (success) {
        console.log("New directory " + SID + " created.");
      }, function (error) {
        window.alert("Error: This Session ID has already been used.");
        console.log(error);
      });
      
      switch (e) {
        case 0:
          var data = "temp.data + ', ' + temp.depth";
          var variable = "temperature";
          document.getElementById("counter-1").innerHTML = 1
          break;
        case 1:
          var data = "salin.data + ', ' + salin.depth";
          var variable = "salinity";
          document.getElementById("counter-2").innerHTML = 1
          break;
        case 2:
          var data = "sechi.depth";
          var variable = "sechi";
          document.getElementById("counter-3").innerHTML = 1
          break;
        case 3:
          var data = "weather.data";
          var variable = "weather";
          document.getElementById("counter-4").innerHTML = 1
          break;
      }
      //next 2 lines for debugging only
    console.log("data field: " + variable);
    console.log("data: " + data);
    $scope.fileName = SID + "_" + variable + "_" + DTG + ".oskit";
    
    $cordovaFile.writeFile(cordova.file.documentsDirectory + SID, fileName, data, false)
    .then(function (success) {
      console.log('File successfully saved.');
      //console.log(success);

      //Used to check if file has actually been created, should not be needed for final build.
        //$cordovaFile.checkFile(cordova.file.documentsDirectory, fileName)
        //.then(function (success) {
          //console.log("File found.")
        //}, function (error) {
          //console.log("File not found");
          //});

      }, function (error) {
        console.log("File not saved");
        console.log("ERROR: " + error);
      });

    })
  };


// Upload function: Should upload all files in directory
  $scope.doUpload = function() {
    var url = "http://www7330.nrlssc.navy.mil/derada/AEC/upload.php";
    var targetPath = cordova.file.documentsDirectory + SID + "filename.txt";
    var filesname = targetPath.split("/").pop();
    var options = {
      fileKey: "filename",
      fileName: filesname,
      chunkedMode: false,
      mimeType: "text/plain"
    };

    $cordovaFileTransfer.upload(url, targetPath, options)
    .then(function(result) {
      console.log("SUCCESS: " + JSON.stringify(result.response));
      window.alert("Files successfully uploaded!");
      console.log(JSON.stringify(result.response));
    }, function(err) {
      console.log("ERROR: " + JSON.stringify(err));
      window.alert(JSON.stringify(err));
      //Can add error codes/handlers here
    }, function (progress) {
      $timeout(function () {
      $scope.downloadProgress = (progress.loaded / progress.total) * 100;
      })
    });  
  }

})



.controller('AccountCtrl', function($scope, $cordovaDialogs, $cordovaFile) {
$scope.doRemove = function() {
  $cordovaDialogs.confirm('Are you sure you want to delete all local files? This action is permanant.', 'Purge Local Cache', ['Delete','Cancel'])
    .then(function(buttonIndex) {
      // no button = 0, 'OK' = 1, 'Cancel' = 2
      var btnIndex = buttonIndex;
    });

  if (buttonIndex == 1) {
    $ionicPlatform.ready(function() {
      $cordovaFile.removeDir(cordova.file.documentsDirectory, SID)
      .then(function (success) {
        window.alert("Files successfully deleted.");
      }, function (error) {
        window.alert("Error deleting files.");
        console.log(error);
      });  
    });
  }
  else {
    return null;
  }

}  
})