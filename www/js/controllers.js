angular.module('starter.controllers', [])
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
.factory('dataShare',function($rootScope){
  var service = {};
  service.data = false;
  service.sendData = function(data){
      this.data = data;
      $rootScope.$broadcast('data_shared');
  };
  service.getData = function(){
    return this.data;
  };
  return service;
})



.controller('DashCtrl', function($scope) {
 
 //Connection Status Function
  $scope.checkConnection = function () {
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
        document.getElementById("connect-text").innerHTML = "Connection Status: WiFi Connection";
      }
      else if (states[networkState] = 'No network connection') {
        document.getElementById("connect-text").innerHTML = "Connection Status: No connection available";
      } 
      else {
        document.getElementById("connect-text").innerHTML = "Connection Status: Cellular Data Connection";
      }

  };
})



.controller('ChatsCtrl', function($scope, $cordovaGeolocation, $cordovaFile, $cordovaFileTransfer, $ionicPlatform, $timeout, dataShare) {

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
  $scope.tempfiles = [];
  $scope.salinfiles = [];
  $scope.sechifiles = [];
  $scope.weatherfiles = [];

//Retrieves SID from Settings Controller
  $scope.SID = {};
  $scope.$on('data_shared', function(){
    var userSID = dataShare.getData();
    $scope.SID.data = userSID;
    console.log($scope.SID.data);
  });

//Gets Location Data and Updates DOM
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
      var lochtml = $scope.loc.lat + ', ' + $scope.loc.lon;
      document.getElementById("location").innerHTML = lochtml
      console.log(lochtml);
    }, function(err) {
      alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
    })

//Parent export function: Should save file, tick up counter, and clear field (Individual saves for now)
  $scope.doSave1 = function() {
    if (($scope.temp.data > 0 && $scope.temp.data < 40) && ($scope.temp.depth > 0 && $scope.temp.depth < 100)) {
    $ionicPlatform.ready(function() {
      var SID = $scope.SID.data;
      var DTG = Date.now()
      var data = $scope.temp.data + ', ' + $scope.temp.depth + ', ' + $scope.loc.lat + ', ' + $scope.loc.lon + ', ' + $scope.loc.acc + ', ' + $scope.loc.alti + ', ' + $scope.loc.heading + ', ' + $scope.loc.speed;
      var variable = "temperature";
      $scope.counter1 += 1;
      document.getElementById("counter-1").innerHTML = $scope.counter1;
      $scope.fileName = SID + "_" + variable + "_" + DTG + ".oskit";
      $cordovaFile.writeFile(cordova.file.documentsDirectory, $scope.fileName, data, true)
      .then(function (success) {
        console.log('File successfully saved.');
        $scope.tempfiles.push($scope.fileName);
        var form = document.getElementById("temp");
        form.reset();
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
      var SID = $scope.SID.data;
      var DTG = Date.now()
      var data = $scope.salin.data + ', ' + $scope.salin.depth + ', ' + $scope.loc.lat + ', ' + $scope.loc.lon + ', ' + $scope.loc.acc + ', ' + $scope.loc.alti + ', ' + $scope.loc.heading + ', ' + $scope.loc.speed;
      var variable = "salinity";
      $scope.counter2 += 1;
      document.getElementById("counter-2").innerHTML = $scope.counter1;
      $scope.fileName = SID + "_" + variable + "_" + DTG + ".oskit";
      $cordovaFile.writeFile(cordova.file.documentsDirectory, $scope.fileName, data, true)
      .then(function (success) {
        console.log('File successfully saved.');
        $scope.salinfiles.push($scope.fileName);
        var form = document.getElementById("salin");
        form.reset();
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
      var SID = $scope.SID.data;
      var DTG = Date.now()
      var data = $scope.sechi.depth + ', ' + $scope.loc.lat + ', ' + $scope.loc.lon + ', ' + $scope.loc.acc + ', ' + $scope.loc.alti + ', ' + $scope.loc.heading + ', ' + $scope.loc.speed;
      var variable = "sechi";
      $scope.counter3 += 1;
      document.getElementById("counter-3").innerHTML = $scope.counter1;
      $scope.fileName = SID + "_" + variable + "_" + DTG + ".oskit";
      $cordovaFile.writeFile(cordova.file.documentsDirectory, $scope.fileName, data, true)
      .then(function (success) {
        console.log('File successfully saved.');
        $scope.sechifiles.push($scope.fileName);
        var form = document.getElementById("sechi");
        form.reset();
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
      var SID = $scope.SID.data;
      var DTG = Date.now();
      var data = $scope.weather.data + ', ' + $scope.loc.lat + ', ' + $scope.loc.lon + ', ' + $scope.loc.acc + ', ' + $scope.loc.alti + ', ' + $scope.loc.heading + ', ' + $scope.loc.speed;
      var variable = "weather";
      $scope.counter4 += 1;
      document.getElementById("counter-4").innerHTML = $scope.counter1;
      $scope.fileName = SID + "_" + variable + "_" + DTG + ".oskit";
      $cordovaFile.writeFile(cordova.file.documentsDirectory, $scope.fileName, data, true)
      .then(function (success) {
        console.log('File successfully saved.');
        $scope.weatherfiles.push($scope.fileName);
        var form = document.getElementById("weather");
        form.reset(); 
      }, function (error) {
        console.log("File not saved");
        console.log("ERROR: " + error);
      });
    })
  };


// Upload function: Should upload all files in directory
  $scope.doUpload = function() {
    var url = "http://www7330.nrlssc.navy.mil/derada/AEC/upload.php";
    for (var i = 0; i < $scope.tempfiles.length; i++){
      var targetPath = cordova.file.documentsDirectory + $scope.tempfiles[i];
      var filesname = targetPath.split("/").pop();
      var options = {fileKey: "filename", fileName: filesname, chunkedMode: false, mimeType: "text/plain"};
      $cordovaFileTransfer.upload(url, targetPath, options)
      .then(function(result) {
      console.log("SUCCESS: " + JSON.stringify(result.response));
      }, function(err) {
      console.log("ERROR: " + JSON.stringify(err));
      //Can add error codes/handlers here
      }, function (progress) {
      $timeout(function () {
      $scope.downloadProgress = (progress.loaded / progress.total) * 100;
      })
      })  
    }

    for (var i = 0; i < $scope.salinfiles.length; i++){
      var targetPath = cordova.file.documentsDirectory + $scope.salinfiles[i];
      var filesname = targetPath.split("/").pop();
      var options = {fileKey: "filename", fileName: filesname, chunkedMode: false, mimeType: "text/plain"};
      $cordovaFileTransfer.upload(url, targetPath, options)
      .then(function(result) {
      console.log("SUCCESS: " + JSON.stringify(result.response));
      }, function(err) {
      console.log("ERROR: " + JSON.stringify(err));
      //Can add error codes/handlers here
      }, function (progress) {
      $timeout(function () {
      $scope.downloadProgress = (progress.loaded / progress.total) * 100;
      })
      })  
    }

    for (var i = 0; i < $scope.sechifiles.length; i++){
      var targetPath = cordova.file.documentsDirectory + $scope.sechifiles[i];
      var filesname = targetPath.split("/").pop();
      var options = {fileKey: "filename", fileName: filesname, chunkedMode: false, mimeType: "text/plain"};
      $cordovaFileTransfer.upload(url, targetPath, options)
      .then(function(result) {
      console.log("SUCCESS: " + JSON.stringify(result.response));
      }, function(err) {
      console.log("ERROR: " + JSON.stringify(err));
      //Can add error codes/handlers here
      }, function (progress) {
      $timeout(function () {
      $scope.downloadProgress = (progress.loaded / progress.total) * 100;
      })
      })  
    }

    for (var i = 0; i < $scope.weatherfiles.length; i++){
      var targetPath = cordova.file.documentsDirectory + $scope.weatherfiles[i];
      var filesname = targetPath.split("/").pop();
      var options = {fileKey: "filename", fileName: filesname, chunkedMode: false, mimeType: "text/plain"};
      $cordovaFileTransfer.upload(url, targetPath, options)
      .then(function(result) {
      console.log("SUCCESS: " + JSON.stringify(result.response));
      }, function(err) {
      console.log("ERROR: " + JSON.stringify(err));
      //Can add error codes/handlers here
      }, function (progress) {
      $timeout(function () {
      $scope.downloadProgress = (progress.loaded / progress.total) * 100;
      })
      })  
    }

    
  };
})




/*$scope.dofUpload = function () {
  setTimeout(function(){ alert("Files finished uploading."); }, 3000);
};

}) */



.controller('AccountCtrl', function($scope, $cordovaDialogs, $cordovaFile, dataShare) {
  $scope.newSID = {};
  $scope.userSID = {};
  $scope.server = {};
//Removes SID Directory
  $scope.doRemove = function() {
    $cordovaDialogs.confirm('Are you sure you want to delete all local files? This action is permanant.', 'Purge Local Cache', ['Delete','Cancel'])
      .then(function(buttonIndex) {         // no button = 0, 'OK' = 1, 'Cancel' = 2
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
  };
//Updates the Session ID
  $scope.setSID = function () {
    $scope.newSID = $scope.userSID.data
    console.log('Session ID set to: ' + $scope.newSID);
    window.alert ('Your new session ID is ' + $scope.newSID);
    dataShare.sendData($scope.newSID);
    $cordovaFile.createDir(cordova.file.documentsDirectory, $scope.newSID, false)
    .then(function (success) {
      console.log("New directory " + $scope.newSID + " created.");
    }, function (error) {
      window.alert("Error: This Session ID has already been used.");
      console.log(error);
    }); 
  }; 
})



.controller('CameraCtrl', function($scope) {
  })