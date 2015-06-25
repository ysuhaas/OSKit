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
      console.log('Connection type: ' + states[networkState]);
      if (states[networkState] = 'Wifi connection') {
        var connect = true;
        document.getElementById("connect-text").innerHTML = "Connection Status: WiFi Connection";
      }
      else if (states[networkState] = 'No network connection') {
        document.getElementById("connect-icon").class = "icon ion-close connect-icon";
        document.getElementById("connect-text").innerHTML = "Connection Status: No connection available";
      } 
      else {
        document.getElementById("connect-icon").class = "icon ion-checkmark connect-icon";
        document.getElementById("connect-text").innerHTML = "Connection Status: Cellular Data Connection";
      }

  };



})


.controller('ChatsCtrl', function($scope, $cordovaGeolocation, $cordovaFile, $cordovaFileTransfer, $ionicPlatform, $timeout) {

//Defining Input Fields
  $scope.temp = {};
  $scope.salin = {};
  $scope.sechi = {};
  $scope.weather = {};
  $scope.userSID = {};
  $scope.loc = {};
  $scope.fileName = "";
  $scope.data = "";
  $scope.counter1 = 0;
  $scope.counter2 = 0;
  $scope.counter3 = 0;
  $scope.counter4 = 0;

  var pos0ptions = {timeout: 10000, enableHighAccuracy: true};
  $cordovaGeolocation.getCurrentPosition(pos0ptions)
      .then(function(position){
        /*console.log('Latitude: '    + position.coords.latitude           + '\n' +
            'Longitude: '         + position.coords.longitude         + '\n' +
            'Altitude: '          + position.coords.altitude          + '\n' +
            'Accuracy: '          + position.coords.accuracy          + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
            'Heading: '           + position.coords.heading           + '\n' +
            'Speed: '             + position.coords.speed             + '\n' +
            'Timestamp: '         + position.timestamp                + '\n');*/
      $scope.loc.lat = position.coords.latitude
      $scope.loc.lon = position.coords.longitude
      $scope.loc.alti = position.coords.altitude 
      $scope.loc.acc = position.coords.accuracy
      $scope.loc.head = position.coords.heading
      $scope.loc.DTG = position.coords.timestamp
      $scope.loc.speed = position.coords.speed 

    }, function(err) {
      alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
    })

//Parent export function: Should save file, tick up counter, and clear field
  $scope.doSave1 = function() {
    if (($scope.temp.data > 0 && $scope.temp.data < 40) && ($scope.temp.depth > 0 && $scope.temp.depth < 100)) {
    $ionicPlatform.ready(function() {
      var SID = $scope.userSID.data;
      var DTG = Date.now()
      var data = $scope.temp.data + ', ' + $scope.temp.depth + ', ' + $scope.loc.lat + ', ' + $scope.loc.lon + ', ' + $scope.loc.acc + ', ' + $scope.loc.alti + ', ' + $scope.loc.heading + ', ' + $scope.loc.speed;
      var variable = "temperature";
      $scope.counter1 += 1;
      document.getElementById("counter-1").innerHTML = $scope.counter1;
      $scope.fileName = SID + "_" + variable + "_" + DTG + ".oskit";
      $cordovaFile.writeFile(cordova.file.documentsDirectory, $scope.fileName, data, true)
      .then(function (success) {
        console.log('File successfully saved.');
        var url = "http://www7330.nrlssc.navy.mil/derada/AEC/upload.php";
        var targetPath = cordova.file.documentsDirectory + $scope.fileName;
        var filesname = targetPath.split("/").pop();
        var options = {fileKey: "filename", fileName: filesname, chunkedMode: false, mimeType: "text/plain"};
        $cordovaFileTransfer.upload(url, targetPath, options)
        .then(function(result) {
          console.log(">>>");
          var form = document.getElementById("temp");
          form.reset();
        }, function(err) {
        }, function (progress) {
        }); 
      }, function (error) {
        console.log("File not saved");
        console.log("ERROR: " + error);
      });
    })
    } else {
      window.alert("Your values are not within the tolerances. Please check them and resubmit.")
    }
  };

  $scope.doSave2 = function() {
    if (($scope.salin.data > 0 && $scope.salin.data < 40) && ($scope.salin.depth > 0 && $scope.salin.depth < 100)) {
    $ionicPlatform.ready(function() {
      var SID = $scope.userSID.data;
      var DTG = Date.now()
      var data = $scope.salin.data + ', ' + $scope.salin.depth + ', ' + $scope.loc.lat + ', ' + $scope.loc.lon + ', ' + $scope.loc.acc + ', ' + $scope.loc.alti + ', ' + $scope.loc.heading + ', ' + $scope.loc.speed;
      var variable = "salinity";
      $scope.counter2 += 1;
      document.getElementById("counter-2").innerHTML = $scope.counter1;
      $scope.fileName = SID + "_" + variable + "_" + DTG + ".oskit";
      $cordovaFile.writeFile(cordova.file.documentsDirectory, $scope.fileName, data, true)
      .then(function (success) {
        console.log('File successfully saved.');
        var url = "http://www7330.nrlssc.navy.mil/derada/AEC/upload.php";
        var targetPath = cordova.file.documentsDirectory + $scope.fileName;
        var filesname = targetPath.split("/").pop();
        var options = {fileKey: "filename", fileName: filesname, chunkedMode: false, mimeType: "text/plain"};
        $cordovaFileTransfer.upload(url, targetPath, options)
        .then(function(result) {
          console.log(">>>");
          var form = document.getElementById("salin");
          form.reset();
        }, function(err) {
        }, function (progress) {
        }); 
      }, function (error) {
        console.log("File not saved");
        console.log("ERROR: " + error);
      });
    })
    } else {
      window.alert("Your values are not within the tolerances. Please check them and resubmit.")
    }
  };

  $scope.doSave3 = function() {
    if ($scope.sechi.depth > 0 && $scope.sechi.depth < 100) {
    $ionicPlatform.ready(function() {
      var SID = $scope.userSID.data;
      var DTG = Date.now()
      var data = $scope.sechi.depth + ', ' + $scope.loc.lat + ', ' + $scope.loc.lon + ', ' + $scope.loc.acc + ', ' + $scope.loc.alti + ', ' + $scope.loc.heading + ', ' + $scope.loc.speed;
      var variable = "sechi";
      $scope.counter1 += 3;
      document.getElementById("counter-3").innerHTML = $scope.counter1;
      $scope.fileName = SID + "_" + variable + "_" + DTG + ".oskit";
      $cordovaFile.writeFile(cordova.file.documentsDirectory, $scope.fileName, data, true)
      .then(function (success) {
        console.log('File successfully saved.');
        var url = "http://www7330.nrlssc.navy.mil/derada/AEC/upload.php";
        var targetPath = cordova.file.documentsDirectory + $scope.fileName;
        var filesname = targetPath.split("/").pop();
        var options = {fileKey: "filename", fileName: filesname, chunkedMode: false, mimeType: "text/plain"};
        $cordovaFileTransfer.upload(url, targetPath, options)
        .then(function(result) {
          console.log(">>>");
          var form = document.getElementById("sechi");
          form.reset();
        }, function(err) {
        }, function (progress) {
        }); 
      }, function (error) {
        console.log("File not saved");
        console.log("ERROR: " + error);
      });
    })
    } else {
      window.alert("Your values are not within the tolerances. Please check them and resubmit.")
    }
  };

  $scope.doSave4 = function() {
    $ionicPlatform.ready(function() {
      var SID = $scope.userSID.data;
      var DTG = Date.now();
      var data = $scope.weather.data + ', ' + $scope.loc.lat + ', ' + $scope.loc.lon + ', ' + $scope.loc.acc + ', ' + $scope.loc.alti + ', ' + $scope.loc.heading + ', ' + $scope.loc.speed;
      var variable = "weather";
      $scope.counter4 += 1;
      document.getElementById("counter-4").innerHTML = $scope.counter1;
      $scope.fileName = SID + "_" + variable + "_" + DTG + ".oskit";
      $cordovaFile.writeFile(cordova.file.documentsDirectory, $scope.fileName, data, true)
      .then(function (success) {
        console.log('File successfully saved.');
        var url = "http://www7330.nrlssc.navy.mil/derada/AEC/upload.php";
        var targetPath = cordova.file.documentsDirectory + $scope.fileName;
        var filesname = targetPath.split("/").pop();
        var options = {fileKey: "filename", fileName: filesname, chunkedMode: false, mimeType: "text/plain"};
        $cordovaFileTransfer.upload(url, targetPath, options)
        .then(function(result) {
          console.log(">>>");
          //var form = document.getElementById("weather");
          //form.reset();
        }, function(err) {
        }, function (progress) {
        }); 
      }, function (error) {
        console.log("File not saved");
        console.log("ERROR: " + error);
      });
    })
  };

// Upload function: Should upload all files in directory
  $scope.doUpload = function() {
    var url = "http://www7330.nrlssc.navy.mil/derada/AEC/upload.php";
    var targetPath = cordova.file.documentsDirectory + $scope.fileName;
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
    })  
  }

$scope.dofUpload = function () {
  setTimeout(function(){ alert("Files finished uploading."); }, 3000);
};

})




.controller('AccountCtrl', function($scope, $cordovaDialogs, $cordovaFile) {
//Removes SID Directory
  $scope.doRemove = function() {
    $cordovaDialogs.confirm('Are you sure you want to delete all local files? This action is permanant.', 'Purge Local Cache', ['Delete','Cancel'])
      .then(function(buttonIndex) {
        // no button = 0, 'OK' = 1, 'Cancel' = 2
        var btnIndex = buttonIndex;
        if (buttonIndex == 1) {
          $ionicPlatform.ready(function() {
            $cordovaFile.removeDir(cordova.file.documentsDirectory, SID)
            .then(function (success) {
              window.alert("Files successfully deleted.");
            }, function (error) {
              window.alert("Error deleting files.");
              console.log(error);
            });
            var form1 = document.getElementById("temp");
            form.reset();
            var form2 = document.getElementById("salin");
            form.reset(); 
            var form3 = document.getElementById("sechi");
            form.reset(); 
            var form4 = document.getElementById("weather");
            form.reset();   
          });
        }
        else {
          return null;
        }
      });
  } 

//Updates the Session ID
  $scope.getSID = function () {
    var SID = $scope.userSID.data;
    console.log('Session ID set to: ' + SID);
    window.alert ('Your new session ID is ' + SID);
    var pos0ptions = {timeout: 10000, enableHighAccuracy: true};
    $cordovaFile.createDir(cordova.file.documentsDirectory, SID, false)
    .then(function (success) {
      console.log("New directory " + SID + " created.");
    }, function (error) {
      window.alert("Error: This Session ID has already been used.");
      console.log(error);
    }); 
  }; 

})

.controller('CameraCtrl', function($scope) {
  })