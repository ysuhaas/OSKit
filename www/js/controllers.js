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
$scope.statusCheck = true;
$scope.errflag = 0;
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
      var lochtml = $scope.loc.lat + ', ' + $scope.loc.lon;
      document.getElementById("location").innerHTML = "Your location is: " + "<br>" + lochtml;
      console.log(lochtml);
    }, function(err) {
      document.getElementById("location").innerHTML = "Location Unavailable.";
    })
})



$ionicPlatform.ready(function() {
  if ($scope.SID.data == undefined) {
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
})

//Checks Server Status
$ionicPlatform.ready(function() {
  $cordovaFile.writeFile(cordova.file.documentsDirectory, "status.test", "Status Test File", true)
  .then(function (success) {
    var url = "http://www7330.nrlssc.navy.mil/derada/AEC/upload.php";
    var options = {fileKey: "filename", fileName: "status.test", chunkedMode: false, mimeType: "text/plain"};
    $cordovaFileTransfer.upload(url, cordova.file.documentsDirectory + "status.test", options)
      .then(function(result) {
        console.log("Server online.")
        $scope.statusCheck = false;
        document.getElementById("status").innerHTML = "Connection Status: OK";
      }, function(err) {
        $scope.statusCheck = true;
        document.getElementById("status").innerHTML = "Connection Status: None";
      }, function (progress) {
      }) 
  }, function (error) {
  });
})



//Export function: Should save file, tick up counter, and clear field (Individual saves for now)
//There should be a way to have a single save function with different arguments being passed to indicate the data type
  $scope.doSave1 = function() {
    if (($scope.temp.data > 0 && $scope.temp.data < 40) && ($scope.temp.depth > 0 && $scope.temp.depth < 100)) {
    $ionicPlatform.ready(function() {
      var SID = $scope.SID.data;
      var DTG = Date.now();
      var data = $scope.temp.data + ', ' + $scope.temp.depth + ', ' + $scope.loc.lat + ', ' + $scope.loc.lon + ', ' + $scope.loc.acc + ', ' + $scope.loc.alti + ', ' + $scope.loc.heading + ', ' + $scope.loc.speed;
      var variable = "temperature";
      $scope.fileName = SID + "_" + variable + "_" + DTG + ".oskit";
      $cordovaFile.writeFile(cordova.file.documentsDirectory + SID, $scope.fileName, data, true)
      .then(function (success) {
        console.log('File successfully saved: ' + $scope.fileName);
        $scope.tempfiles.push($scope.fileName);
        var form = document.getElementById("temp");
        form.reset();
        $scope.counter1 += 1;
        document.getElementById("counter-1").innerHTML = $scope.counter1;
        $cordovaToast.show('File successfully saved.', 'short', 'center').then(function(success) {}, function (error) {});
        var url = "http://www7330.nrlssc.navy.mil/derada/AEC/upload.php";
        var options = {fileKey: "filename", fileName: "status.test", chunkedMode: false, mimeType: "text/plain"};
        $cordovaFileTransfer.upload(url, cordova.file.documentsDirectory + "status.test", options)
        .then(function(result) {
          console.log("Server online.")
          $scope.statusCheck = false;
          document.getElementById("status").innerHTML = "Connection Status: OK";
        }, function(err) {
          $scope.statusCheck = true;
          document.getElementById("status").innerHTML = "Connection Status: None";
        }, function (progress) {
        }); 
      }, function (error) {
        $cordovaToast.show('Error saving file', 'short', 'center').then(function(success) {}, function (error) {});
        console.log("Error saving file: " + error);
      });
    })
    } else {
      //window.alert("Your values are not within the tolerances. Please check them and resubmit.");
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
        $scope.salinfiles.push($scope.fileName);
        var form = document.getElementById("salin");
        form.reset();
        $scope.counter2 += 1;
        document.getElementById("counter-2").innerHTML = $scope.counter2;
        $cordovaToast.show('File successfully saved.', 'short', 'center').then(function(success) {}, function (error) {});
        var url = "http://www7330.nrlssc.navy.mil/derada/AEC/upload.php";
        var options = {fileKey: "filename", fileName: "status.test", chunkedMode: false, mimeType: "text/plain"};
        $cordovaFileTransfer.upload(url, cordova.file.documentsDirectory + "status.test", options)
        .then(function(result) {
          console.log("Server online.")
          $scope.statusCheck = false;
          document.getElementById("status").innerHTML = "Connection Status: OK";
        }, function(err) {
          $scope.statusCheck = true;
          document.getElementById("status").innerHTML = "Connection Status: None";
        }, function (progress) {
        });
      }, function (error) {
        $cordovaToast.show('Error saving file', 'short', 'center').then(function(success) {}, function (error) {});
        console.log("Error saving file: " + error);
      });
    })
    } else {
      window.alert("Your values are not within the tolerances. Please check them and resubmit.")
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
        $scope.sechifiles.push($scope.fileName);
        var form = document.getElementById("sechi");
        form.reset();
        $scope.counter3 += 1;
        document.getElementById("counter-3").innerHTML = $scope.counter3;
        $cordovaToast.show('File successfully saved.', 'short', 'center').then(function(success) {}, function (error) {});
        var url = "http://www7330.nrlssc.navy.mil/derada/AEC/upload.php";
        var options = {fileKey: "filename", fileName: "status.test", chunkedMode: false, mimeType: "text/plain"};
        $cordovaFileTransfer.upload(url, cordova.file.documentsDirectory + "status.test", options)
        .then(function(result) {
          console.log("Server online.")
          $scope.statusCheck = false;
          document.getElementById("status").innerHTML = "Connection Status: OK";
        }, function(err) {
          $scope.statusCheck = true;
          document.getElementById("status").innerHTML = "Connection Status: None";
        }, function (progress) {
        });
      }, function (error) {
        $cordovaToast.show('Error saving file', 'short', 'center').then(function(success) {}, function (error) {});
        console.log("Error saving file: " + error);
      });
    })
    } else {
      window.alert("Your values are not within the tolerances. Please check them and resubmit.")
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
        $scope.weatherfiles.push($scope.fileName);
        var form = document.getElementById("weather");
        form.reset();
        $scope.counter4 += 1;
        document.getElementById("counter-4").innerHTML = $scope.counter4;
        $cordovaToast.show('File successfully saved.', 'short', 'center').then(function(success) {}, function (error) {});
        var url = "http://www7330.nrlssc.navy.mil/derada/AEC/upload.php";
        var options = {fileKey: "filename", fileName: "status.test", chunkedMode: false, mimeType: "text/plain"};
        $cordovaFileTransfer.upload(url, cordova.file.documentsDirectory + "status.test", options)
        .then(function(result) {
          console.log("Server online.")
          $scope.statusCheck = false;
          document.getElementById("status").innerHTML = "Connection Status: OK";
        }, function(err) {
          $scope.statusCheck = true;
          document.getElementById("status").innerHTML = "Connection Status: None";
        }, function (progress) {
        }); 
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
    var optionstest = {fileKey: "filename", fileName: "status.test", chunkedMode: false, mimeType: "text/plain"};
    $cordovaFileTransfer.upload(url, cordova.file.documentsDirectory + "status.test", optionstest)
    .then(function(result) {
    console.log("Server online.")
    $scope.statusCheck = false;
    document.getElementById("status").innerHTML = "Connection Status: OK";
      for (var i = 0; i < $scope.tempfiles.length; i++){
      var targetPath = cordova.file.documentsDirectory + $scope.SID.data + $scope.tempfiles[i];
      var filesname = targetPath.split("/").pop();
      var options = {fileKey: "filename", fileName: filesname, chunkedMode: false, mimeType: "text/plain"};
      $cordovaFileTransfer.upload(url, targetPath, options)
      .then(function(result) {
      console.log("SUCCESS: " + JSON.stringify(result.response));
      }, function(err) {
      console.log("ERROR: " + JSON.stringify(err));
      $scope.errflag = 1;
      }, function (progress) {
      $timeout(function () {
      $scope.downloadProgress = (progress.loaded / progress.total) * 100;
      })
      })  
    }

    for (var i = 0; i < $scope.salinfiles.length; i++){
      var targetPath = cordova.file.documentsDirectory + $scope.SID.data + $scope.salinfiles[i];
      var filesname = targetPath.split("/").pop();
      var options = {fileKey: "filename", fileName: filesname, chunkedMode: false, mimeType: "text/plain"};
      $cordovaFileTransfer.upload(url, targetPath, options)
      .then(function(result) {
      console.log("SUCCESS: " + JSON.stringify(result.response));
      }, function(err) {
      console.log("ERROR: " + JSON.stringify(err));
      $scope.errflag = 1;
      }, function (progress) {
      $timeout(function () {
      $scope.downloadProgress = (progress.loaded / progress.total) * 100;
      })
      })  
    }

    for (var i = 0; i < $scope.sechifiles.length; i++){
      var targetPath = cordova.file.documentsDirectory + $scope.SID.data + $scope.sechifiles[i];
      var filesname = targetPath.split("/").pop();
      var options = {fileKey: "filename", fileName: filesname, chunkedMode: false, mimeType: "text/plain"};
      $cordovaFileTransfer.upload(url, targetPath, options)
      .then(function(result) {
      console.log("SUCCESS: " + JSON.stringify(result.response));
      }, function(err) {
      console.log("ERROR: " + JSON.stringify(err));
      $scope.errflag = 1;
      }, function (progress) {
      $timeout(function () {
      $scope.downloadProgress = (progress.loaded / progress.total) * 100;
      })
      })  
    }

    for (var i = 0; i < $scope.weatherfiles.length; i++){
      var targetPath = cordova.file.documentsDirectory + $scope.SID.data + $scope.weatherfiles[i];
      var filesname = targetPath.split("/").pop();
      var options = {fileKey: "filename", fileName: filesname, chunkedMode: false, mimeType: "text/plain"};
      $cordovaFileTransfer.upload(url, targetPath, options)
      .then(function(result) {
      console.log("SUCCESS: " + JSON.stringify(result.response));
      }, function(err) {
      console.log("ERROR: " + JSON.stringify(err));
      $scope.errflag = 1;
      }, function (progress) {
      $timeout(function () {
      $scope.downloadProgress = (progress.loaded / progress.total) * 100;
      })
      })  
    }
    document.getElementById("counter-1").innerHTML = 0;
    document.getElementById("counter-2").innerHTML = 0;
    document.getElementById("counter-3").innerHTML = 0;
    document.getElementById("counter-4").innerHTML = 0;
    }, function(err) {
    $scope.statusCheck = true;
    document.getElementById("status").innerHTML = "Connection Status: None";
    $cordovaDialogs.alert('The server seems to be offline. Please try again later.', 'Error', 'OK')
        .then(function() {
        });
    }, function (progress) {
    }); 
  if ($scope.errflag = 1) {
    $cordovaDialogs.alert('Error uploading files. Please try again later.', 'Error', 'OK')
  }
  else {
    $cordovaDialogs.alert('Files successfully uploaded.', 'Success', 'OK')
    $scope.tempfiles.length = 0
    $scope.weatherfiles.length = 0
    $scope.salinfiles.length = 0
    $scope.sechifiles.length = 0
    $cordovaFile.removeRecursively(cordova.file.documentsDirectory + $scope.SID.data, "")
      .then(function (success) {
        // success
      }, function (error) {
        // error
      });
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





.controller('AccountCtrl', function($scope, $cordovaDialogs, $cordovaFile, dataShare, $ionicPlatform, $ionicModal) {
  $scope.newSID = {};
  $scope.userSID = {};
  $scope.server = {};
  $scope.server.data = "http://www7330.nrlssc.navy.mil/derada/AEC/upload.php"

//Updates the Session ID
  $scope.setSID = function () {
    $scope.newSID = $scope.userSID.data
    console.log('Session ID set to: ' + $scope.newSID);
    $cordovaDialogs.alert('Your new session ID is ' + $scope.newSID, 'Session ID');
    dataShare.sendData($scope.newSID);
    $cordovaFile.createDir(cordova.file.documentsDirectory, $scope.userSID.data, true)
      .then(function (success) {
        console.log('New directory ' + $scope.newSID + 'created');
      }, function (error) {
        console.log(JSON.stringify(error));
      });
  }; 

//Removes SID Directory
  $scope.doRemove = function() {
    $cordovaDialogs.confirm('Are you sure you want to delete all local files? This action is permanant.', 'Purge Local Cache', ['Delete','Cancel'])
      .then(function(buttonIndex) {         // no button = 0, 'OK' = 1, 'Cancel' = 2
        var btnIndex = buttonIndex;
        if (buttonIndex == 1) {
          $ionicPlatform.ready(function() {
            $cordovaFile.removeRecursively(cordova.file.documentsDirectory + $scope.newSID, "")
              .then(function (success) {
                $scope.tempfiles.length = 0
                $scope.weatherfiles.length = 0
                $scope.salinfiles.length = 0
                $scope.sechifiles.length = 0
                var form5 = document.getElementById("sid");
                form5.reset();
                $cordovaDialogs.alert('Files successfully deleted.', 'Local Files');
              }, function (error) {
                $cordovaDialogs.alert('Error deleting files.', 'Local Files');
                console.log(JSON.stringify(error));
              });
          });
        }
        else {
          return null;
        }
      });
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

  $scope.takePhoto = function(){
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: false,
      encodingType: Camera.EncodingType.PNG,
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

  $scope.getPhoto = function(){
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.PNG,
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
        var image = document.getElementById('myImage');
        image.src = null;

    }, function(error) {
        window.alert(error.message);
    })



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
$ionicModal.fromTemplateUrl('templates/', {
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
