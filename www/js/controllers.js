angular.module('starter.controllers', [])
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});


//This shared service transfers the Session ID between controllers.
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


//Whitelists image URIs (may not be necessary)
.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
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
      if (states[networkState] == 'WiFi connection') {
        document.getElementById("connect-text").innerHTML = "Connection Status: WiFi Connection";
      }
      else if (states[networkState] == 'No network connection') {
        document.getElementById("connect-text").innerHTML = "Connection Status: No connection available";
      } 
      else {
        document.getElementById("connect-text").innerHTML = "Connection Status: Cellular Data Connection";
      }

  };
})



.controller('ChatsCtrl', function($scope, $cordovaGeolocation, $cordovaFile, $cordovaFileTransfer, $ionicPlatform, $ionicModal, $cordovaToast, $timeout, dataShare) {

//Defining Scope Variables

//Input Fields and Other Data
  $scope.temp = {};
  $scope.salin = {};
  $scope.sechi = {};
  $scope.weather = {};
  $scope.userSID = {};
  $scope.loc = {};
  $scope.fileName = "";
//DOM Counters
  $scope.counter1 = 0;
  $scope.counter2 = 0;
  $scope.counter3 = 0;
  $scope.counter4 = 0;
//Filename arrays to loop through for uploading
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
      document.getElementById("location").innerHTML = "Your location is: " + "<br>" + lochtml;
      console.log(lochtml);
    }, function(err) {
      document.getElementById("location").innerHTML = "Location Unavailable.";
    })

//Export function: Should save file, tick up counter, and clear field (Individual saves for now)
//There should be a way to have a single save function with different arguments being passed to indicate the data type
  $scope.doSave1 = function() {
    if (($scope.temp.data > 0 && $scope.temp.data < 40) && ($scope.temp.depth > 0 && $scope.temp.depth < 100)) {
    $ionicPlatform.ready(function() {
      var SID = $scope.SID.data;
      var DTG = Date.now()
      var data = $scope.temp.data + ', ' + $scope.temp.depth + ', ' + $scope.loc.lat + ', ' + $scope.loc.lon + ', ' + $scope.loc.acc + ', ' + $scope.loc.alti + ', ' + $scope.loc.heading + ', ' + $scope.loc.speed;
      var variable = "temperature";
      $scope.fileName = SID + "_" + variable + "_" + DTG + ".oskit";
      $cordovaFile.writeFile(cordova.file.documentsDirectory, $scope.fileName, data, true)
      .then(function (success) {
        console.log('File successfully saved: ' + $scope.fileName);
        $scope.tempfiles.push($scope.fileName);
        var form = document.getElementById("temp");
        form.reset();
        $scope.counter1 += 1;
        document.getElementById("counter-1").innerHTML = $scope.counter1;
        $cordovaToast.show('File successfully saved.', 'short', 'center').then(function(success) {}, function (error) {});
      }, function (error) {
        $cordovaToast.show('Error saving file', 'short', 'center').then(function(success) {}, function (error) {});
        console.log("Error saving file: " + error);
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
      $scope.fileName = SID + "_" + variable + "_" + DTG + ".oskit";
      $cordovaFile.writeFile(cordova.file.documentsDirectory, $scope.fileName, data, true)
      .then(function (success) {
        console.log('File successfully saved: ' + $scope.fileName);
        $scope.salinfiles.push($scope.fileName);
        var form = document.getElementById("salin");
        form.reset();
        $scope.counter2 += 1;
        document.getElementById("counter-2").innerHTML = $scope.counter2;
        $cordovaToast.show('File successfully saved.', 'short', 'center').then(function(success) {}, function (error) {});
      }, function (error) {
        $cordovaToast.show('Error saving file', 'short', 'center').then(function(success) {}, function (error) {});
        console.log("Error saving file: " + error);
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
      $scope.fileName = SID + "_" + variable + "_" + DTG + ".oskit";
      $cordovaFile.writeFile(cordova.file.documentsDirectory, $scope.fileName, data, true)
      .then(function (success) {
        console.log('File successfully saved: ' + $scope.fileName);
        $scope.sechifiles.push($scope.fileName);
        var form = document.getElementById("sechi");
        form.reset();
        $scope.counter3 += 1;
        document.getElementById("counter-3").innerHTML = $scope.counter3;
        $cordovaToast.show('File successfully saved.', 'short', 'center').then(function(success) {}, function (error) {});
      }, function (error) {
        $cordovaToast.show('Error saving file', 'short', 'center').then(function(success) {}, function (error) {});
        console.log("Error saving file: " + error);
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
      $scope.fileName = SID + "_" + variable + "_" + DTG + ".oskit";
      $cordovaFile.writeFile(cordova.file.documentsDirectory, $scope.fileName, data, true)
      .then(function (success) {
        console.log('File successfully saved: ' + $scope.fileName);
        $scope.weatherfiles.push($scope.fileName);
        var form = document.getElementById("weather");
        form.reset();
        $scope.counter4 += 1;
        document.getElementById("counter-4").innerHTML = $scope.counter4;
        $cordovaToast.show('File successfully saved.', 'short', 'center').then(function(success) {}, function (error) {}); 
      }, function (error) {
        $cordovaToast.show('Error saving file', 'short', 'center').then(function(success) {}, function (error) {});
        console.log("Error saving file: " + error);
      });
    })
  };


// Upload function: Should upload all files in directory
//Currently loops through four arrays containing filenames for each datafield, also could create one filename array and have one for loop
  $scope.doUpload = function() {
    var url = "http://www7330.nrlssc.navy.mil/derada/AEC/upload.php";
    for (var i = 0; i < $scope.tempfiles.length; i++){
      var targetPath = cordova.file.documentsDirectory + $scope.tempfiles[i];
      var filesname = targetPath.split("/").pop();
      var options = {fileKey: "filename", fileName: filesname, chunkedMode: false, mimeType: "text/plain"};
      $cordovaFileTransfer.upload(url, targetPath, options)
      .then(function(result) {
      console.log("SUCCESS: " + JSON.stringify(result.response));
      $scope.uploadnumber = $scope.uploadnumber + 1;
      }, function(err) {
      $scope.failnumber = $scope.failnumber + 1;
      console.log("ERROR: " + JSON.stringify(err));
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
      $scope.uploadnumber = $scope.uploadnumber + 1;
      }, function(err) {
      $scope.failnumber = $scope.failnumber + 1;
      console.log("ERROR: " + JSON.stringify(err));
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
      $scope.uploadnumber = $scope.uploadnumber + 1;
      }, function(err) {
      $scope.failnumber = $scope.failnumber + 1;
      console.log("ERROR: " + JSON.stringify(err));
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
      $scope.uploadnumber = $scope.uploadnumber + 1;
      }, function(err) {
      $scope.failnumber = $scope.failnumber + 1;
      console.log("ERROR: " + JSON.stringify(err));
      }, function (progress) {
      $timeout(function () {
      $scope.downloadProgress = (progress.loaded / progress.total) * 100;
      })
      })  
    }
  };



$ionicModal.fromTemplateUrl('intro1-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal
  })  

  $scope.openModal = function() {
    $scope.modal.show()
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
})





.controller('AccountCtrl', function($scope, $cordovaDialogs, $cordovaFile, dataShare, $ionicPlatform, $ionicModal) {
  $scope.newSID = {};
  $scope.userSID = {};

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
      console.log(error);
    }); 
  }; 

//Removes SID Directory
  $scope.doRemove = function() {
    $cordovaDialogs.confirm('Are you sure you want to delete all local files? This action is permanant.', 'Purge Local Cache', ['Delete','Cancel'])
      .then(function(buttonIndex) {         // no button = 0, 'OK' = 1, 'Cancel' = 2
        var btnIndex = buttonIndex;
        if (buttonIndex == 1) {
          $ionicPlatform.ready(function() {
            $cordovaFile.removeDir(cordova.file.documentsDirectory, $scope.newSID)
            .then(function (success) {
              var form5 = document.getElementById("sid");
              form5.reset();
              window.alert("Files successfully deleted.");
            }, function (error) {
              window.alert("Error deleting files.");
              console.log(error);
            });
            var form1 = document.getElementById("temp");
            form1.reset();
            var form2 = document.getElementById("salin");
            form2.reset(); 
            var form3 = document.getElementById("sechi");
            form3.reset(); 
            var form4 = document.getElementById("weather");
            form4.reset();   
          });
        }
        else {
          return null;
        }
      });
  };


$ionicModal.fromTemplateUrl('intro-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal
  })  

  $scope.openModal = function() {
    $scope.modal.show()
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

})




.controller('CameraCtrl', function($scope, $timeout, $cordovaCamera, $ionicPlatform, $cordovaFile, $cordovaFileTransfer, $cordovaToast, dataShare, $ionicModal) {
 $scope.img = {};
 $scope.image = {};
 $scope.SIDpic = {};

 $scope.imagefiles = [];
 $scope.datafiles = [];
 $scope.counterimg = 0;

  $scope.$on('data_shared', function(){
    var userSID = dataShare.getData();
    $scope.SIDpic.data = userSID;
  });

  $scope.getPhoto = function(){
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $ionicPlatform.ready(function() {
        $cordovaCamera.getPicture(options).then(function(imageURI) {
        var image = document.getElementById('myImage');
        image.src = imageURI;
        console.log(imageURI);
        $scope.image.data = imageURI;
        //$scope.imagefiles.push(imageURI);
      }, function(err) {
        // error
      });
    });
  };

  $scope.savePic = function(){
    if ($scope.img.name == undefined){
      var imagename = $scope.SIDpic.data + "_photo_" + Date.now();
    }
    else{
      var imagename = $scope.SIDpic.data + "_" + $scope.img.name; + "_" + Date.now();
    }
    $cordovaFile.copyFile(cordova.file.tempDirectory, $scope.image.data.split("/").pop(), cordova.file.documentsDirectory, imagename + ".jpeg")
    .then(function(success){
        $cordovaToast.show('Picture saved successfully: ' + imagename, 'short', 'center').then(function(success) {}, function (error){});
        $scope.imagefiles.push(imagename);
        $scope.counterimg = $scope.counterimg + 1;
        document.getElementById("counter-img").innerHTML = $scope.counterimg;
    }, function(error) {
        window.alert(error);
    })

   /* $cordovaFile.writeFile(cordova.file.documentsDirectory, imagename + ".png", $scope.image.data, true)
      .then(function (success) {
        $cordovaToast.show('Picture saved successfully.', 'short', 'center').then(function(success) {}, function (error) {});
        $scope.imagefiles.push(imagename + ".png");
        
        $scope.counterimg = $scope.counterimg + 1;
        document.getElementById("counter-img").innerHTML = $scope.counterimg;
      }, function (error) {  
      }) */

    $cordovaFile.writeFile(cordova.file.documentsDirectory, imagename + ".oskit" , $scope.img.syn, true)
    .then(function (success) {
      $scope.datafiles.push(imagename + ".oskit");
        var formtext = document.getElementById("image");
        formtext.reset();
      $cordovaToast.show('Data saved successfully.', 'short', 'center').then(function(success){}, function (error) {});
    })
  };

  $scope.doImageUpload = function (){
    var url = "http://www7330.nrlssc.navy.mil/derada/AEC/upload.php";
    for (var i = 0; i < $scope.imagefiles.length; i++){
      var targetPath = cordova.file.documentsDirectory + $scope.imagefiles[i];
      console.log($scope.imagefiles[i]);
      var filesname = targetPath.split("/").pop();
      var options = {fileKey: "filename", fileName: filesname, chunkedMode: false, mimeType: "image/jpeg"};
      $cordovaFileTransfer.upload(url, targetPath, options)
      .then(function(result) {
      console.log("SUCCESS: " + JSON.stringify(result.response));
      }, function(err) {
      console.log("ERROR: " + JSON.stringify(err));
      }, function (progress) {
      $timeout(function () {
      $scope.downloadProgress = (progress.loaded / progress.total) * 100;
      })
      })  
    }

    for (var i = 0; i < $scope.datafiles.length; i++){
      var targetPath = cordova.file.documentsDirectory + $scope.datafiles[i];
      var filesname = targetPath.split("/").pop();
      var options = {fileKey: "filename", fileName: filesname, chunkedMode: false, mimeType: "text/plain"};
      $cordovaFileTransfer.upload(url, targetPath, options)
      .then(function(result) {
      console.log("SUCCESS: " + JSON.stringify(result.response));
      }, function(err) {
      console.log("ERROR: " + JSON.stringify(err));
      }, function (progress) {
      $timeout(function () {
      $scope.downloadProgress = (progress.loaded / progress.total) * 100;
      })
      })  
    }
  };


$ionicModal.fromTemplateUrl('intro-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal
  })  

  $scope.openModal = function() {
    $scope.modal.show()
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
})
