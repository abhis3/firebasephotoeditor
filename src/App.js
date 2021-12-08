import Nav from "./components/Nav";
import ImgUpload from "./components/ImgUpload";
import ReplaceImg from "./components/ReplaceImg";
import AllPhotos from "./components/AllPhotos";
import History from "./components/History";

import Filters from "./components/Filters";
import "./App.css";
import ReactDOM from "react-dom";
import Button from "@mui/material/Button";

import React, { Component } from "react";

import { app, database, storage, storageRef } from './firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { uploadFileFunction, downloadFile, getAllFilesInBucket, writeToDatabase } from './test';
import { set, ref as databaseRef, child, get } from "firebase/database";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      img: {},
      file: {},
      fileName: '',
      fileNameNoExtension: '',
      allFilters: {
        brightness: 0,
        contrast: 0,
        saturation: 0,
        vibrance: 0,
        exposure: 0
      },
      allFiles: [],
      history: []
    };
    this.updateImage = this.updateImage.bind(this);
    this.updateImageNewUserUpload = this.updateImageNewUserUpload.bind(this);
    this.updateImageOldUpload = this.updateImageOldUpload.bind(this);
    this.updateAllFiles = this.updateAllFiles.bind(this);
    this.addFileToAllFiles = this.addFileToAllFiles.bind(this);
    this.updateFilters = this.updateFilters.bind(this);
    this.updateFiltersHistoryClick = this.updateFiltersHistoryClick.bind(this);
    this.rerenderShit = this.rerenderShit.bind(this);
    this.rerenderShitHistoryClick = this.rerenderShitHistoryClick.bind(this);
    this.rerenderShitForLoadFromStorageTwo = this.rerenderShitForLoadFromStorageTwo.bind(this);
    // this.rerenderShitForLoadFromStorage = this.rerenderShitForLoadFromStorage.bind(this);
  }

//   componentWillMount() {
//     this.getAllFilesInBucket()
//     console.log("TEST");
//     console.log(this.state);
// }

  updateImageNewUserUpload(img, file, fileName) {
    let fileNameNoExtension = fileName;
    fileNameNoExtension = fileNameNoExtension.replace(/\.[^/.]+$/, "");

    this.setState({
      img: img,
      file: file,
      fileName: fileName,
      fileNameNoExtension: fileNameNoExtension,
      allFilters: {
        brightness: 0,
        contrast: 0,
        saturation: 0,
        vibrance: 0,
        exposure: 0
      },
      history: [
        {
          name: "Revert to Original",
          filters: {
            brightness: 0,
            contrast: 0,
            saturation: 0,
            vibrance: 0,
            exposure: 0
          }
        }
      ]
    }, this.writeToDatabaseNewPhoto);
    console.log("overall state on update image new upload", this.state);
  }

  // FOR NEW USER UPLOAD
  writeToDatabaseNewPhoto = () => {
    var photoName = this.state.fileNameNoExtension;
    var newBrightness = this.state.allFilters.brightness;
    var newContrast = this.state.allFilters.contrast;
    var newSaturation = this.state.allFilters.saturation;
    var newVibrance = this.state.allFilters.vibrance;
    var newExposure = this.state.allFilters.exposure;

    let photoData = {
        "history": [
          {
            "name": "Revert to Original",
            "filters": {
              "brightness": newBrightness,
              "contrast": newContrast,
              "saturation": newSaturation,
              "vibrance": newVibrance,
              "exposure": newExposure
            }
          }
        ]
    }

    set(databaseRef(database, 'photos/' + photoName), photoData);
    console.log("Successfully uploaded photo edit history for new photo: " + photoName)
  }




  // FOR REPLACE IMAGE CLICK
  updateImageOldUpload(img, fileName) {
    let fileNameNoExtension = fileName;
    fileNameNoExtension = fileNameNoExtension.replace(/\.[^/.]+$/, "");

    this.setState({
      img: img,
      fileName: fileName,
      fileNameNoExtension: fileNameNoExtension,
      allFilters: {
        brightness: 0,
        contrast: 0,
        saturation: 0,
        vibrance: 0,
        exposure: 0
      },
      history: []
    }, this.readFromDatabase);
    console.log("overall state on update old image click", this.state);
  }

  updateImage(img, file, fileName) {
    this.setState({img: img, file: file, fileName: fileName});
    console.log("overall state on update image", this.state);
  }

  updateAllFiles(newAllFiles) {
    this.setState({allFiles: newAllFiles});
    console.log("overall state on update all Files", this.state);
  }

  addFileToAllFiles(fileToAdd) {
    // console.log("&&&&&&&&&&&&&&&&&");
    // console.log(this.state);
    // console.log(fileToAdd);

    var newAllFiles = this.state.allFiles;
    const newPath = "images/" + fileToAdd;
    newAllFiles.push({name: fileToAdd, fullPath: newPath});

    this.setState({allFiles: newAllFiles});
  }

  updateFiltersHistoryClick(newHistory, newAllFilters) {
    this.setState(
      {
        allFilters: newAllFilters,
        history: newHistory
      }, this.writeToDatabase);


    // var newAllFiles = this.state.allFiles;
    // const newPath = "images/" + fileToAdd;
    // newAllFiles.push({name: fileToAdd, fullPath: newPath});

    // this.setState({allFiles: newAllFiles});

    this.rerenderShitHistoryClick(newAllFilters);
  }



  rerenderShitHistoryClick(newAllFilters) {

    let img = this.state.img;

    var currentBrightness = newAllFilters.brightness;
    var currentContrast = newAllFilters.contrast;
    var currentSaturation = newAllFilters.saturation;
    var currentVibrance = newAllFilters.vibrance;
    var currentExposure = newAllFilters.exposure;

    window.Caman("#canvas", img, function () {
        this.revert();
        this.brightness(currentBrightness);
        this.contrast(currentContrast);
        this.saturation(currentSaturation);
        this.vibrance(currentVibrance);
        this.exposure(currentExposure);
        this.render();
      });
    
  }






  updateFilters(filterName, valueAddOrDecrement) {
    var newBrightness = this.state.allFilters.brightness;
    var newContrast = this.state.allFilters.contrast;
    var newSaturation = this.state.allFilters.saturation;
    var newVibrance = this.state.allFilters.vibrance;
    var newExposure = this.state.allFilters.exposure;


    if (filterName == "brightness") {
      newBrightness = newBrightness + valueAddOrDecrement;
    }

    if (filterName == "contrast") {
      newContrast = newContrast + valueAddOrDecrement;
    }

    if (filterName == "saturation") {
      newSaturation = newSaturation + valueAddOrDecrement;
    }

    if (filterName == "vibrance") {
      newVibrance = newVibrance + valueAddOrDecrement;
    }

    if (filterName == "exposure") {
      newExposure = newExposure + valueAddOrDecrement;
    }


    var editName = `Revert to ${filterName} ${valueAddOrDecrement}`;
    if (valueAddOrDecrement > 0) {
      editName = `Revert to ${filterName} +${valueAddOrDecrement}`;
    }


    const newFilterSnapshot = {
      brightness: newBrightness,
      contrast: newContrast,
      saturation: newSaturation,
      vibrance: newVibrance,
      exposure: newExposure
    }

    var filterHistory = this.state.history;
    filterHistory.push(
      {
        name: editName,
        filters: newFilterSnapshot
      }
    );

    this.setState(
      {
        allFilters: newFilterSnapshot,
        history: filterHistory
      }, this.writeToDatabase);


    // var newAllFiles = this.state.allFiles;
    // const newPath = "images/" + fileToAdd;
    // newAllFiles.push({name: fileToAdd, fullPath: newPath});

    // this.setState({allFiles: newAllFiles});

    this.rerenderShit(filterName, valueAddOrDecrement);
  }

  rerenderShit(filterName, valueAddOrDecrement) {

    let img = this.state.img;
    // var currentBrightness = this.state.allFilters.brightness;
    var currentBrightness = 0;
    var currentContrast = 0;
    var currentSaturation = 0;
    var currentVibrance = 0;
    var currentExposure = 0;

    if (filterName == "brightness") {
      currentBrightness = currentBrightness + valueAddOrDecrement;
    }

    if (filterName == "contrast") {
      currentContrast = currentContrast + valueAddOrDecrement;
    }

    if (filterName == "saturation") {
      currentSaturation = currentSaturation + valueAddOrDecrement;
    }

    if (filterName == "vibrance") {
      currentVibrance = currentVibrance + valueAddOrDecrement;
    }

    if (filterName == "exposure") {
      currentExposure = currentExposure + valueAddOrDecrement;
    }

    window.Caman("#canvas", img, function () {
        // this.revert();
        this.brightness(currentBrightness);
        this.contrast(currentContrast);
        this.saturation(currentSaturation);
        this.vibrance(currentVibrance);
        this.exposure(currentExposure);
        this.render();
      });
    
  }

  writeToDatabase = () => {
    // let photoName = this.state.fileName;
    // photoName = photoName.replace(/\.[^/.]+$/, "")
    var photoName = this.state.fileNameNoExtension;
    var newBrightness = this.state.allFilters.brightness;
    var newContrast = this.state.allFilters.contrast;
    var newSaturation = this.state.allFilters.saturation;
    var newVibrance = this.state.allFilters.vibrance;
    var newExposure = this.state.allFilters.exposure;

    var allEditHistory = this.state.history;

    // let photoData = {
    //     "history": [
    //       {
    //         "brightness": newBrightness,
    //         "contrast": newContrast,
    //         "saturation": newSaturation,
    //         "vibrance": newVibrance,
    //         "exposure": newExposure
    //       }
    //     ]
    // }

    let photoData = {
        "history": allEditHistory
    }

    set(databaseRef(database, 'photos/' + photoName), photoData);
    console.log("Successfully uploaded photo edit history: " + photoName)
  }

  readFromDatabase = () => {
    var photoName = this.state.fileNameNoExtension;
    const dbRef = databaseRef(database);

    get(child(dbRef, `photos/${photoName}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const snapshotVal = snapshot.val();
        const latestFilter = snapshotVal.history.at(-1).filters; // WE NEED TO CHANGED THIS LINE
        const allHistory = snapshotVal.history;
        // ADD HISTORY CALCULATION LOGIC HERE
        console.log(":::::::::::");
        console.log(allHistory);
        console.log(latestFilter);
        console.log(snapshotVal.history.at(-1));
        console.log(":::::::::::");

        this.setState({
          allFilters: latestFilter,
          history: allHistory
        }, this.rerenderShitForLoadFromStorage);

      } else {
        console.log("No data available");
      }
    })

    console.log("Successfully read photo edit history for photo: " + photoName)
  }

  rerenderShitForLoadFromStorage = () => {

    let img = this.state.img;

    var newBrightness = this.state.allFilters.brightness;
    var newContrast = this.state.allFilters.contrast;
    var newSaturation = this.state.allFilters.saturation;
    var newVibrance = this.state.allFilters.vibrance;
    var newExposure = this.state.allFilters.exposure;

    window.Caman("#canvas", img, function () {
        // this.revert();
        this.brightness(newBrightness);
        this.contrast(newContrast);
        this.saturation(newSaturation);
        this.vibrance(newVibrance);
        this.exposure(newExposure);
        this.render();
      });
  }

  rerenderShitForLoadFromStorageTwo() {

    let img = this.state.img;

    var newBrightness = this.state.allFilters.brightness;
    var newContrast = this.state.allFilters.contrast;
    var newSaturation = this.state.allFilters.saturation;
    var newVibrance = this.state.allFilters.vibrance;

    // console.log("@@@@@@@@@@@@@@@");
    // console.log(img);
    // console.log(newBrightness);
    // console.log(newContrast);
    // console.log(newSaturation);
    // console.log(newVibrance);
    // console.log("@@@@@@@@@@@@@@@");

    window.Caman("#canvas", img, function () {
        // this.revert();
        this.brightness(40);
        this.contrast(0);
        this.saturation(0);
        this.vibrance(0);
        this.render();
      });
    
  }

  render() {
    return (
      // <div className="App">
      //   {/* <Nav /> */}
      //   <div className = "flex flex-col md:flex-row justify-center">
      //   <ImgUpload updateImageNewUserUpload = {this.updateImageNewUserUpload} addFileToAllFiles={this.addFileToAllFiles} allFiles={this.state.allFiles} addNewPhotoHistoryOnUserUpload={this.addNewPhotoHistoryOnUserUpload} fileName={this.state.fileName}/>
      //   {/* <ReplaceImg updateImage = {this.updateImage}/> */}
      //   <Filters img={this.state.img} file={this.state.file} fileName={this.state.fileName} updateFilters={this.updateFilters}/>
      //   <AllPhotos updateAllFiles={this.updateAllFiles} allFiles={this.state.allFiles} updateImageOldUpload={this.updateImageOldUpload} rerenderShitForLoadFromStorageTwo={this.rerenderShitForLoadFromStorageTwo}/>
      //   <History updateAllFiles={this.updateAllFiles} allFiles={this.state.allFiles} updateImageOldUpload={this.updateImageOldUpload} history={this.state.history} updateFiltersHistoryClick={this.updateFiltersHistoryClick}/>
      //   </div>
      // </div>

      // <div className="container">
      //   <div class="one"></div>
      //   <div class="two"></div>
      // </div>

      <div className="container">
        <div class="one">
          <ImgUpload updateImageNewUserUpload = {this.updateImageNewUserUpload} addFileToAllFiles={this.addFileToAllFiles} allFiles={this.state.allFiles} addNewPhotoHistoryOnUserUpload={this.addNewPhotoHistoryOnUserUpload} fileName={this.state.fileName}/>
          <Filters img={this.state.img} file={this.state.file} fileName={this.state.fileName} updateFilters={this.updateFilters}/>
          <AllPhotos updateAllFiles={this.updateAllFiles} allFiles={this.state.allFiles} updateImageOldUpload={this.updateImageOldUpload} rerenderShitForLoadFromStorageTwo={this.rerenderShitForLoadFromStorageTwo}/>
          <History updateAllFiles={this.updateAllFiles} allFiles={this.state.allFiles} updateImageOldUpload={this.updateImageOldUpload} history={this.state.history} updateFiltersHistoryClick={this.updateFiltersHistoryClick}/>
        </div>

        <div class="two">
          <canvas id="canvas"></canvas>
        </div>
        {/* <Filters img={this.state.img} file={this.state.file} fileName={this.state.fileName} updateFilters={this.updateFilters}/>
        <History updateAllFiles={this.updateAllFiles} allFiles={this.state.allFiles} updateImageOldUpload={this.updateImageOldUpload} history={this.state.history} updateFiltersHistoryClick={this.updateFiltersHistoryClick}/> */}
      </div>
    );
  }
}

export default App;




{/*         
        <button onClick={() => uploadFileFunction("/Users/abhisun/Downloads/tree.jpg")}>
          UPLOAD FILE
        </button>

        <button onClick={() => downloadFile('images/tree.jpg')}>
          DOWNLOAD FILE
        </button>

        <button onClick={() => getAllFilesInBucket()}>
          LIST FILES
        </button>

        <button onClick={() => writeToDatabase("sample")}>
          Write to RTDB (Sample User)
        </button> */}
        