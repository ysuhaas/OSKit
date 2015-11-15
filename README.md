## OSKit

>NOTICE: This application is no longer under active public development as it has been commissioned by NRL.

The OSKit Mobile Application was developed as part of the final project for SEAP 2015 at NRL-SSC. The OSKit, short for Ocean Sampling Kit, is part of the NRL's Adaptive Ecosystem Climatology (AEC) project, designed to form a comprehensive climatology model of the Gulf Coast using multiple sources of data. The OSKit was desgined to be an outreach project deployed to local high schools that would crowdsource oceanographic data to be sent back to NRL. 

## Code Example
```
 $scope.doSave1 = function() {
    if (($scope.temp.data > -0.0001 && $scope.temp.data < 40) && ($scope.temp.depth > -0.0001 && $scope.temp.depth < 100)) {
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
        if (error.code == 1) {
        $cordovaToast.show('No session ID set. Please set a session ID', 'short', 'center').then(function(success) {}, function (error) {});
        }
        else{
        $cordovaToast.show('Error saving file.', 'short', 'center').then(function(success) {}, function (error) {});
        console.log("Error saving file: " + error.code);
        }

      });
    } else {
      $cordovaDialogs.alert('Your values are not within the tolerances. Please check them and resubmit.', 'Error');
    }
  };
```
## Motivation

A short description of the motivation behind the creation and maintenance of the project. This should explain **why** the project exists.

## Installation

This project is created using the Ionic framework, and therefore can be compiled using the Ionic command line interface. To install/test on an iOS device, you must be using an OSX development environment. Follow the directions here: (http://ionicframework.com/getting-started/) to install Ionic on your computer. This project follows all the conventions of the Ionic "tabs" project template, and can be tested live in the browser using "ionic serve" (see Ionic reference docs).

## API Reference

The ngCordova API was used to access many of the device's hardware functions. The plugins used and their corresponding documentation pages are listed below:

>http://ngcordova.com/docs/plugins/toast/ 

>http://ngcordova.com/docs/plugins/geolocation/ 

>http://ngcordova.com/docs/plugins/fileTransfer/ 

>http://ngcordova.com/docs/plugins/file/  

>http://ngcordova.com/docs/plugins/deviceOrientation/  

>http://ngcordova.com/docs/plugins/camera/  

## Testing

This application can be compiled and tested using the "ionic serve" command in the terminal (executed from the project root). To build this application for a simulator or a device for testing, run the command "ionic build <platform>", replacing <platform> with ios or android. Building for iOS will output an .xcodeproj file that can be opened in Xcode and deployed to a device or simulator. Building for Android will output an Android Eclipse file that can be opened in Eclipse and deployed to a device/simulator. An alternative way to build for a simulator is to run the command "ionic emulate <platform>", which will build and auto-deploy the application to the specified simulator. 
