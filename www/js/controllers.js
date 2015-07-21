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



.controller('DataCtrl', function($scope, $ionicTabsDelegate, $cordovaGeolocation, $cordovaDialogs, $cordovaFile, $cordovaFileTransfer, $ionicPlatform, $ionicModal, $cordovaToast, $timeout, dataShare) {

//Defining Scope Variables
$scope.statusCheck = undefined;

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
    console.log('DataCtrl');
    var userSID = dataShare.getData();
    $scope.SID.data = userSID;
    console.log($scope.SID.data);
    document.getElementById("SID").innerHTML = "Session ID:" + "<br>" + $scope.SID.data;
  });

//Gets Location Data and Updates DOM
$ionicPlatform.ready(function() {
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
      $scope.loc.lat = position.coords.latitude;
      $scope.loc.lon = position.coords.longitude;
      $scope.loc.alti = position.coords.altitude;
      $scope.loc.acc = position.coords.accuracy;
      $scope.loc.head = position.coords.heading;
      $scope.loc.DTG = position.coords.timestamp;
      $scope.loc.speed = position.coords.speed; 
      var lon = Math.round($scope.loc.lon * 100) / 100;
      var lat = Math.round($scope.loc.lat * 100) / 100;
      var ele = Math.round($scope.loc.alti * 100) / 100;
      console.log('alti: ' + $scope.loc.alti);
      document.getElementById("lat").innerHTML = "Latitude:" + "<br>" + lat;
      document.getElementById("lon").innerHTML = "Longitude:" + "<br>" + lon;
      document.getElementById("ele").innerHTML = "Elevation:" + "<br>" + ele;
    }, function(err) {
    })

})
//Prompts SID
$ionicPlatform.ready(function() {
  if ($scope.SID.data == undefined) {
    $cordovaDialogs.confirm('A Session ID is required. Would you like to set one?', 'Session ID')
    .then(function(buttonIndex) {
      // no button = 0, 'OK' = 1, 'Cancel' = 2
      var btnIndex = buttonIndex;
      if (btnIndex == 1) {
        $ionicTabsDelegate.select(0);
         $ionicTabsDelegate.select(2);
      }
      else{
        return null;
      }
    });
  }
  else {
    return null;
  }
})

$scope.checkStatus = function() {
  $cordovaFile.writeFile(cordova.file.documentsDirectory, "status.test", "Status Test File", true)
  .then(function (success) {
    var url = "http://www7330.nrlssc.navy.mil/derada/AEC/upload.php";
    var options = {fileKey: "filename", fileName: "status.test", chunkedMode: false, mimeType: "text/plain"};
    $cordovaFileTransfer.upload(url, cordova.file.documentsDirectory + "status.test", options)
      .then(function(result) {
        $scope.countersum = $scope.counter1 + $scope.counter2 + $scope.counter3 + $scope.counter4;
          if ($scope.countersum == 0 || $scope.SID.data == false) {
            $scope.statusCheck = true;
          }
          else {
            $scope.statusCheck = false;
          }
        document.getElementById("status").innerHTML = "Connection Status: OK";
      }, function(err) {
        $scope.statusCheck = true;
        document.getElementById("status").innerHTML = "Connection Status: None";
      }, function (progress) {
      }) 
  }, function (error) {
  });
};

//Checks Server Status
$ionicPlatform.ready(function() {
$scope.checkStatus();
})


//Export function: Should save file, tick up counter, and clear field (Individual saves for now)
//There should be a way to have a single save function with different arguments being passed to indicate the data type
  $scope.doSave1 = function() {
    if (($scope.temp.data > 0 && $scope.temp.data < 40) && ($scope.temp.depth > 0 && $scope.temp.depth < 100)) {
      var SID = $scope.SID.data;
      var DTG = Date.now();
      var data = $scope.temp.data + ', ' + $scope.temp.depth + ', ' + $scope.loc.lat + ', ' + $scope.loc.lon + ', ' + $scope.loc.acc + ', ' + $scope.loc.alti + ', ' + $scope.loc.heading + ', ' + $scope.loc.speed;
      var variable = "temperature";
      $scope.fileName = SID + "_" + variable + "_" + DTG + ".oskit";
      $cordovaFile.writeFile(cordova.file.documentsDirectory + SID, $scope.fileName, data, true)
      .then(function (success) {
        console.log('File successfully saved: ' + $scope.fileName);
        $scope.tempfiles.push(SID + "/" + $scope.fileName);
        var form = document.getElementById("temp");
        form.reset();
        $scope.counter1 += 1;
        document.getElementById("counter-1").innerHTML = $scope.counter1;
        $scope.temp.data = null;
        $scope.temp.depth = null;
        $cordovaToast.show('File successfully saved.', 'short', 'center').then(function(success) {}, function (error) {});
        $scope.checkStatus();
      }, function (error) {
        $cordovaToast.show('Error saving file', 'short', 'center').then(function(success) {}, function (error) {});
        console.log("Error saving file: " + error.message);
      });
    } else {
      $cordovaDialogs.alert('Your values are not within the tolerances. Please check them and resubmit.', 'Error');
    }
  };
  $scope.doSave2 = function() {
    if (($scope.salin.data > 0 && $scope.salin.data < 40) && ($scope.salin.depth > 0 && $scope.salin.depth < 100)) {
    $ionicPlatform.ready(function() {
      var SID = $scope.SID.data;
      var DTG = Date.now();
      var data = $scope.salin.data + ', ' + $scope.salin.depth + ', ' + $scope.loc.lat + ', ' + $scope.loc.lon + ', ' + $scope.loc.acc + ', ' + $scope.loc.alti + ', ' + $scope.loc.heading + ', ' + $scope.loc.speed;
      var variable = "salinity";
      $scope.fileName = SID + "_" + variable + "_" + DTG + ".oskit";
      $cordovaFile.writeFile(cordova.file.documentsDirectory + SID, $scope.fileName, data, true)
      .then(function (success) {
        console.log('File successfully saved: ' + $scope.fileName);
        $scope.salinfiles.push(SID + "/" + $scope.fileName);
        var form = document.getElementById("salin");
        form.reset();
        $scope.counter2 += 1;
        document.getElementById("counter-2").innerHTML = $scope.counter2;
        $scope.salin.data = null;
        $scope.salin.depth = null;
        $cordovaToast.show('File successfully saved.', 'short', 'center').then(function(success) {}, function (error) {});
        $scope.checkStatus();
      }, function (error) {
        $cordovaToast.show('Error saving file', 'short', 'center').then(function(success) {}, function (error) {});
        console.log("Error saving file: " + error);
      });
    })
    } else {
      $cordovaDialogs.alert('Your values are not within the tolerances. Please check them and resubmit.', 'Error');
    }
  };
  $scope.doSave3 = function() {
    if ($scope.sechi.depth > 0 && $scope.sechi.depth < 100) {
    $ionicPlatform.ready(function() {
      var SID = $scope.SID.data;
      var DTG = Date.now();
      var data = $scope.sechi.depth + ', ' + $scope.loc.lat + ', ' + $scope.loc.lon + ', ' + $scope.loc.acc + ', ' + $scope.loc.alti + ', ' + $scope.loc.heading + ', ' + $scope.loc.speed;
      var variable = "sechi";
      $scope.fileName = SID + "_" + variable + "_" + DTG + ".oskit";
      $cordovaFile.writeFile(cordova.file.documentsDirectory + SID, $scope.fileName, data, true)
      .then(function (success) {
        console.log('File successfully saved: ' + $scope.fileName);
        $scope.sechifiles.push(SID + "/" + $scope.fileName);
        var form = document.getElementById("sechi");
        form.reset();
        $scope.counter3 += 1;
        document.getElementById("counter-3").innerHTML = $scope.counter3;
        $scope.sechi.depth = null;
        $cordovaToast.show('File successfully saved.', 'short', 'center').then(function(success) {}, function (error) {});
        $scope.checkStatus();
      }, function (error) {
        $cordovaToast.show('Error saving file', 'short', 'center').then(function(success) {}, function (error) {});
        console.log("Error saving file: " + error);
      });
    })
    } else {
      $cordovaDialogs.alert('Your values are not within the tolerances. Please check them and resubmit.', 'Error');
    }
  };
  $scope.doSave4 = function() {
    $ionicPlatform.ready(function() {
      var SID = $scope.SID.data;
      var DTG = Date.now();
      var data = $scope.weather.data + ', ' + $scope.loc.lat + ', ' + $scope.loc.lon + ', ' + $scope.loc.acc + ', ' + $scope.loc.alti + ', ' + $scope.loc.heading + ', ' + $scope.loc.speed;
      var variable = "weather";
      $scope.fileName = SID + "_" + variable + "_" + DTG + ".oskit";
      $cordovaFile.writeFile(cordova.file.documentsDirectory + SID, $scope.fileName, data, true)
      .then(function (success) {
        console.log('File successfully saved: ' + $scope.fileName);
        $scope.weatherfiles.push(SID + "/" + $scope.fileName);
        var form = document.getElementById("weather");
        form.reset();
        $scope.counter4 += 1;
        document.getElementById("counter-4").innerHTML = $scope.counter4;
        $scope.weather.data = null;
        $cordovaToast.show('File successfully saved.', 'short', 'center').then(function(success) {}, function (error) {});
        $scope.checkStatus();
      }, function (error) {
        $cordovaToast.show('Error saving file', 'short', 'center').then(function(success) {}, function (error) {});
        console.log("Error saving file: " + error);
      });
    })
  };


// Upload function: Should upload all files in directory
//Currently loops through four arrays containing filenames for each datafield, also could create one filename array and have one for loop
  $scope.doUpload = function() {
    $scope.errflag = 0;
    var url = "http://www7330.nrlssc.navy.mil/derada/AEC/upload.php";
    var optionstest = {fileKey: "filename", fileName: "status.test", chunkedMode: false, mimeType: "text/plain"};
    $scope.arrlength = $scope.tempfiles.length + $scope.salinfiles.length + $scope.sechifiles.length + $scope.weatherfiles.length;
    console.log('arrlength: ' + $scope.arrlength);
    $scope.arrchecker = 0;
    $cordovaFileTransfer.upload(url, cordova.file.documentsDirectory + "status.test", optionstest)
    .then(function(result) {
      console.log("Server online.")
      $scope.statusCheck = false;
      document.getElementById("status").innerHTML = "Connection Status: OK";

      for (var i = 0; i < $scope.tempfiles.length; i++){
        var targetPath = cordova.file.documentsDirectory + $scope.tempfiles[i];
        console.log(targetPath);
        var filesname = targetPath.split("/").pop();
        var options = {fileKey: "filename", fileName: filesname, chunkedMode: false, mimeType: "text/plain"};
        $cordovaFileTransfer.upload(url, targetPath, options)
        .then(function(result) {
        console.log("SUCCESS: " + JSON.stringify(result.response));
        $scope.arrchecker = $scope.arrchecker + 1;
        console.log($scope.arrchecker);
        $scope.FSM()
        }, function(err) {
        console.log("ERROR: " + JSON.stringify(err));
        $scope.arrchecker = $scope.arrchecker + 1;
        console.log($scope.arrchecker);
        $scope.errflag = 1;
        $scope.FSM()
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
        $scope.arrchecker = $scope.arrchecker + 1;
        console.log($scope.arrchecker);
        $scope.FSM()
        }, function(err) {
        console.log("ERROR: " + JSON.stringify(err));
        $scope.arrchecker = $scope.arrchecker + 1;
        console.log($scope.arrchecker);
        $scope.errflag = 1;
        $scope.FSM()
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
        $scope.arrchecker = $scope.arrchecker + 1;
        console.log($scope.arrchecker);
        $scope.FSM()
        }, function(err) {
        console.log("ERROR: " + JSON.stringify(err));
        $scope.arrchecker = $scope.arrchecker + 1;
        console.log($scope.arrchecker);
        $scope.errflag = 1;
        $scope.FSM()
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
        $scope.arrchecker = $scope.arrchecker + 1;
        console.log($scope.arrchecker);
        $scope.FSM()
        }, function(err) {
        console.log("ERROR: " + JSON.stringify(err));
        $scope.arrchecker = $scope.arrchecker + 1;
        console.log($scope.arrchecker);
        $scope.errflag = 1;
        $scope.FSM()
        }, function (progress) {
        $timeout(function () {
        $scope.downloadProgress = (progress.loaded / progress.total) * 100;
        })
        })  
      }

      console.log('Flag: ' +  $scope.errflag);


    }, function(err) {
    $scope.statusCheck = true;
    document.getElementById("status").innerHTML = "Connection Status: None";
    $cordovaDialogs.alert('The server seems to be offline. Please try again later.', 'Error', 'OK').then(function() {});
    }, function (progress) {
    }); 

  };
  

$scope.FSM = function(){
  if ($scope.arrchecker == $scope.arrlength && $scope.arrchecker>0){
  if ($scope.errflag == 1) {
    $cordovaDialogs.alert('Error uploading files. Please try again later.', 'Error', 'OK')
  }
  else {
    $cordovaDialogs.alert('Files successfully uploaded.', 'Success', 'OK')
    $scope.tempfiles.length = 0
    $scope.weatherfiles.length = 0
    $scope.salinfiles.length = 0
    $scope.sechifiles.length = 0
    document.getElementById("counter-1").innerHTML = 0;
    document.getElementById("counter-2").innerHTML = 0;
    document.getElementById("counter-3").innerHTML = 0;
    document.getElementById("counter-4").innerHTML = 0;
    $scope.counter1 = 0;
    $scope.counter2 = 0;
    $scope.counter3 = 0;
    $scope.counter4 = 0;
    $scope.checkStatus();
    $cordovaFile.removeRecursively(cordova.file.documentsDirectory + $scope.SID.data, "")
    .then(function (success) {
      $cordovaFile.createDir(cordova.file.documentsDirectory, $scope.SID.data, true)
      .then(function (success) {
      }, function (error) {
      });
    }, function (error) {
    });
  }
} else
return null;
};

$scope.$on("purge", function(){
    document.getElementById("counter-1").innerHTML = 0;
    document.getElementById("counter-2").innerHTML = 0;
    document.getElementById("counter-3").innerHTML = 0;
    document.getElementById("counter-4").innerHTML = 0;
    document.getElementById("SID").innerHTML = "Session ID:" + "<br>";
    $scope.SID.data = null;
    $scope.tempfiles.length = 0
    $scope.weatherfiles.length = 0
    $scope.salinfiles.length = 0
    $scope.sechifiles.length = 0
    $scope.statusCheck = true;
})

$ionicModal.fromTemplateUrl('templates/help.html', {
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





.controller('AccountCtrl', function($rootScope, $scope, $cordovaDialogs, $cordovaFile, dataShare, $ionicPlatform, $ionicModal) {
  $scope.newSID = {};
  $scope.userSID = {};
  $scope.server = {};
  $scope.server.data = "http://www7330.nrlssc.navy.mil/derada/AEC/upload.php"

//Updates the Session ID
  $scope.setSID = function () {
    $scope.newSID = $scope.userSID.data.replace(/ /g, "");
    console.log('Session ID set to: ' + $scope.newSID);
    $cordovaDialogs.alert('Your new session ID is ' + $scope.newSID, 'Session ID');
    dataShare.sendData($scope.newSID);
    $cordovaFile.createDir(cordova.file.documentsDirectory, $scope.userSID.data.replace(/ /g, ""), true)
      .then(function (success) {
        console.log('New directory ' + $scope.newSID + ' created');
      }, function (error) {
        console.log(JSON.stringify(error));
      });
  }; 

//Removes SID Directory
  $scope.doRemove = function() {
    $ionicPlatform.ready(function(){
    $cordovaDialogs.confirm('Are you sure you want to delete all local files? This action is permanant.', 'Purge Local Cache', ['Delete','Cancel'])
      .then(function(buttonIndex) {         // no button = 0, 'OK' = 1, 'Cancel' = 2
        var btnIndex = buttonIndex;
        if (buttonIndex == 1) {
          $ionicPlatform.ready(function() {
            $cordovaFile.removeRecursively(cordova.file.documentsDirectory + $scope.newSID, "")
              .then(function (success) {
                var form5 = document.getElementById("sid");
                form5.reset();
                $scope.userSID.data = null;
                $rootScope.$broadcast("purge");
                $cordovaDialogs.alert('Files successfully deleted.', 'Local Files');
              }, function (error) {
                if (error.code == 1) {
                $cordovaDialogs.alert('Files successfully deleted.', 'Local Files');
                }
                else {
                $cordovaDialogs.alert('Error deleting files.', 'Local Files');
                console.log(JSON.stringify(error));
                }
              });
          });
        }
        else {
          return null;
        }
      });
    })
  };

$ionicModal.fromTemplateUrl('templates/help.html', {
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




.controller('CameraCtrl', function($scope, $timeout, $ionicTabsDelegate, $cordovaCamera, $cordovaDialogs, $ionicPlatform, $cordovaFile, $cordovaFileTransfer, $cordovaToast, $ionicModal, dataShare) {
 $scope.img = {};
 $scope.image = {};
 $scope.SIDpic = {};
 $scope.imagefiles = [];
 $scope.datafiles = [];
 $scope.counterimg = 0;
 $scope.statusCheckPic = undefined;
 $scope.picThere = undefined;

 $scope.picCheck = function(){
  if (document.getElementById('myImage').src.split("/").pop() == "pic.png" || $scope.SIDpic.data == false) {
    $scope.picThere = true;
  }
  else{
    $scope.picThere = false;
  }
 };

 $scope.checkStatusPic = function() {
  $cordovaFile.writeFile(cordova.file.documentsDirectory, "status.test", "Status Test File", true)
  .then(function (success) {
    var url = "http://www7330.nrlssc.navy.mil/derada/AEC/upload.php";
    var options = {fileKey: "filename", fileName: "status.test", chunkedMode: false, mimeType: "text/plain"};
    $cordovaFileTransfer.upload(url, cordova.file.documentsDirectory + "status.test", options)
      .then(function(result) {
          if ($scope.counterimg == 0) {
            $scope.statusCheckPic = true;
            console.log($scope.counterimg);
            console.log($scope.statusCheckPic);
          }
          else {
            $scope.statusCheckPic = false;
          }
        document.getElementById("picstatus").innerHTML = "Connection Status: OK";
      }, function(err) {
        $scope.statusCheckPic = true;
        document.getElementById("picstatus").innerHTML = "Connection Status: None";
      }, function (progress) {
      }) 
  }, function (error) {
  });
};

  $ionicPlatform.ready(function(){
    $scope.checkStatusPic();
    $scope.picCheck();
  })
  
//Retrieve SID
  $scope.$on('data_shared', function(){
    console.log("event fired");
    
  });


$scope.$on('$ionicView.enter', function(e) {
  var userSID = dataShare.getData();
  $scope.SIDpic.data = userSID;
  console.log("userSID: " + userSID);
  if ($scope.SIDpic.data == false) {
    $cordovaDialogs.confirm('A Session ID is required. Would you like to set one?', 'Session ID')
    .then(function(buttonIndex) {
    // no button = 0, 'OK' = 1, 'Cancel' = 2
    var btnIndex = buttonIndex;
    if (btnIndex == 1) {
      $ionicTabsDelegate.select(2);
    }
    else{
      return null;
    }
    });
  }
  else {
    return null;
  }
});



//Open Camera
$scope.takePhoto = function(){
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.PNG,
      targetWidth: 1280,
      targetHeight: 960,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $ionicPlatform.ready(function() {
      $cordovaCamera.getPicture(options).then(function(imageURI) {
      var image = document.getElementById('myImage');
      image.src = imageURI;
      console.log(imageURI);
      $scope.image.data = imageURI;
      $scope.picCheck();
      $scope.checkStatusPic();
      }, function(err) {
      });
    });
  };

//Save Image
  $scope.savePic = function(){

    if ($scope.img.name == undefined){
      var imagename = $scope.SIDpic.data + "_photo_" + Date.now();
    }
    else{
      var imagename = $scope.SIDpic.data + "_" + $scope.img.name.replace(/ /g, "") + "_" + Date.now();
    }


    $cordovaFile.copyFile(cordova.file.tempDirectory, $scope.image.data.split("/").pop(), cordova.file.documentsDirectory, imagename + ".png")
    .then(function(success){
        $cordovaToast.show('Picture saved successfully: ' + imagename, 'short', 'center').then(function(success) {}, function (error){});
        $scope.imagefiles.push(imagename + '.png');
        $scope.counterimg = $scope.counterimg + 1;
        document.getElementById("counter-img").innerHTML = $scope.counterimg; 
        var image = document.getElementById('myImage');
        image.src = "pic.png";
        $scope.img.name = null;
        $scope.picCheck();
        $scope.checkStatusPic();
    }, function(error) {
        $cordovaDialogs.alert('Error saving image.', 'Error');
    })


    if ($scope.img.syn !=undefined) {
      $cordovaFile.writeFile(cordova.file.documentsDirectory, imagename + ".oskit" , $scope.img.syn,  true)
        .then(function (success) {
          $scope.datafiles.push(imagename + ".oskit");
          var formtext = document.getElementById("txtarea").value = "";
          formtext.reset();
          $scope.img.syn = null;
          $cordovaToast.show('Data saved successfully.', 'short', 'center').then(function(success){}, function (error) {});
        }, function(error){
          $cordovaDialogs.alert('Error saving synopsis.', 'Error');
        })
    }
    else{
      console.log('no synopsis');
  }

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
      document.getElementById("counter-img").innerHTML = 0;
      $cordovaDialogs.alert('Successfully uploaded images.', 'Success');
      }, function(err) {
      console.log("ERROR: " + JSON.stringify(err));
      $cordovaDialogs.alert('Error uploading images.', 'Error');
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


$ionicModal.fromTemplateUrl('templates/help.html', {
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
