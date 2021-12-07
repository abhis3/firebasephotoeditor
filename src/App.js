// import logo from './logo.svg';
// import './App.css';
// import { writeToDatabase } from './test';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>

//         <button onClick={() => writeToDatabase("sample")}>
//           Write to RTDB (Sample User)
//         </button>

//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;



/////////


// import Upload from "./components/Upload";
// import React, { Component } from "react";

// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {img: {}, file: {}, fileName: ''};
//     this.updateImage = this.updateImage.bind(this);
//   }

//   render() {
//     return (
//       <div className="App">
//         {/* <Nav />
//         <div className = "flex flex-col md:flex-row justify-center"> */}
//         <Upload updateImage = {this.updateImage}/>
//         <Filters img={this.state.img} file={this.state.file} fileName={this.state.fileName}/>
//         </div>
//       </div>
//     );
//   }
// }


/////////
// import React from "react";
// import ReactDOM from "react-dom";
// import Button from "@mui/material/Button";

// function App() {
//   return (
//     <Button variant="contained" color="primary">
//       Hello World
//     </Button>
//   );
// }

// export default App;
//ReactDOM.render(<App />, document.querySelector("#app"));








import Nav from "./components/Nav";
import ImgUpload from "./components/ImgUpload";
import ReplaceImg from "./components/ReplaceImg";
import AllPhotos from "./components/AllPhotos";

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
        vibrance: 0 
      },
      allFiles: []
    };
    this.updateImage = this.updateImage.bind(this);
    this.updateImageNewUserUpload = this.updateImageNewUserUpload.bind(this);
    this.updateImageOldUpload = this.updateImageOldUpload.bind(this);
    this.updateAllFiles = this.updateAllFiles.bind(this);
    this.addFileToAllFiles = this.addFileToAllFiles.bind(this);
    this.updateFilters = this.updateFilters.bind(this);
    this.rerenderShit = this.rerenderShit.bind(this);
    this.rerenderShitForLoadFromStorageTwo = this.rerenderShitForLoadFromStorageTwo.bind(this);
    // this.rerenderShitForLoadFromStorage = this.rerenderShitForLoadFromStorage.bind(this);
  }

//   componentWillMount() {
//     this.getAllFilesInBucket()
//     console.log("TEST");
//     console.log(this.state);
// }

// getAllFilesInBucket() {
//   const listReference = ref(storage, "images");
  
//   listAll(listReference).then((res) => {
//       //console.log("@@@@@");
//       var newAllFiles = this.state.allFiles;
//       res.items.forEach((itemRef) => {
//           const mapping = {name: itemRef.name, fullPath: itemRef.fullPath}
//           newAllFiles.push(mapping)
//           //console.log(itemRef.name);
//           //console.log(itemRef.fullPath);
//       });
//       console.log(this.state);
//       this.setState({allFiles: newAllFiles});
//       // console.log(this.state.allFiles);
//       console.log(this.state);
//   });
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
        vibrance: 0 
      }
    }, this.writeToDatabase);
    console.log("app", this.state.file);
    console.log("overall state on update image new upload", this.state);
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
        vibrance: 0 
      }
    }, this.readFromDatabase);
    console.log("app", this.state.file);
    console.log("overall state on update old image click", this.state);
  }

  updateImage(img, file, fileName) {
    this.setState({img: img, file: file, fileName: fileName});
    console.log("app", this.state.file);
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

    console.log(this.state);
    console.log("&&&&&&&&&&&&&&&&&");
  }

  updateFilters(filterName, valueAddOrDecrement) {
    console.log("^^^^^^^^^^^^^^^^^^^^");
    console.log(this.state.allFilters);

    var newBrightness = this.state.allFilters.brightness;
    var newContrast = this.state.allFilters.contrast;
    var newSaturation = this.state.allFilters.saturation;
    var newVibrance = this.state.allFilters.vibrance;

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
    console.log(newBrightness);

    this.setState({allFilters: {
      brightness: newBrightness,
      contrast: newContrast,
      saturation: newSaturation,
      vibrance: newVibrance
    }}, this.writeToDatabase);

    this.rerenderShit(filterName, valueAddOrDecrement);

    console.log(this.state);
    console.log("^^^^^^^^^^^^^^^^^^^^");
  }

  rerenderShit(filterName, valueAddOrDecrement) {
    console.log("current state rerenderShit");
    console.log(this.state);

    let img = this.state.img;
    // var currentBrightness = this.state.allFilters.brightness;
    var currentBrightness = 0;
    var currentContrast = 0;
    var currentSaturation = 0;
    var currentVibrance = 0;

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

    console.log("$$$$$$$$$$");
    console.log(currentBrightness);
    console.log(currentContrast);
    console.log(currentSaturation);
    console.log(currentVibrance);
    console.log("$$$$$$$$$$");

    window.Caman("#canvas", img, function () {
        // this.revert();
        this.brightness(currentBrightness);
        this.contrast(currentContrast);
        this.saturation(currentSaturation);
        this.vibrance(currentVibrance);
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

    let photoData = {
        "history": [
          {
            "brightness": newBrightness,
            "contrast": newContrast,
            "saturation": newSaturation,
            "vibrance": newVibrance
          }
        ]
    }

    // console.log("**********************");
    // console.log(this.state);
    // console.log(photoName);
    // console.log(photoData);
    // console.log("**********************");
    set(databaseRef(database, 'photos/' + photoName), photoData);
    console.log("Successfully uploaded photo edit history: " + photoName)
  }

  readFromDatabase = () => {
    // let photoName = this.state.fileName;
    // photoName = photoName.replace(/\.[^/.]+$/, "")
    var photoName = this.state.fileNameNoExtension;
    const dbRef = databaseRef(database);

    get(child(dbRef, `photos/${photoName}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const snapshotVal = snapshot.val();
        const latestFilter = snapshotVal.history.at(-1);
        // ADD HISTORY CALCULATION LOGIC HERE
        console.log(":::::::::::");
        console.log(snapshotVal.history.at(-1));
        console.log(":::::::::::");

        this.setState({
          allFilters: latestFilter
        }, this.rerenderShitForLoadFromStorage);


        // // Try and rerender
        // console.log("current state rerenderShitForLoadFromStorage");
        // console.log(this.state);

        // let img = this.state.img;

        // var newBrightness = latestFilter.brightness;
        // var newContrast = latestFilter.contrast;
        // var newSaturation = latestFilter.saturation;
        // var newVibrance = latestFilter.vibrance;

        // window.Caman("#canvas", img, function () {
        //   // this.revert();
        //   this.brightness(0);
        //   this.contrast(0);
        //   this.saturation(0);
        //   this.vibrance(0);
        //   this.render();
        // });


      } else {
        console.log("No data available");
      }
    })

    // this.setState({allFilters: {
    //   brightness: newBrightness,
    //   contrast: newContrast,
    //   saturation: newSaturation,
    //   vibrance: newVibrance
    // }}, this.writeToDatabase);

    console.log("Successfully read photo edit history for photo: " + photoName)
  }

  rerenderShitForLoadFromStorage = () => {
    console.log("current state rerenderShitForLoadFromStorage");
    console.log(this.state);

    let img = this.state.img;

    var newBrightness = this.state.allFilters.brightness;
    var newContrast = this.state.allFilters.contrast;
    var newSaturation = this.state.allFilters.saturation;
    var newVibrance = this.state.allFilters.vibrance;

    console.log("&&&&&&&&&");
    console.log(img);
    console.log(newBrightness);
    console.log(newContrast);
    console.log(newSaturation);
    console.log(newVibrance);
    console.log("&&&&&&&&&");

    window.Caman("#canvas", img, function () {
        // this.revert();
        this.brightness(newBrightness);
        this.contrast(newContrast);
        this.saturation(newSaturation);
        this.vibrance(newVibrance);
        this.render();
      });
  }

  rerenderShitForLoadFromStorageTwo() {
    console.log("current state rerenderShitForLoadFromStorageTwo");
    console.log(this.state);

    let img = this.state.img;

    var newBrightness = this.state.allFilters.brightness;
    var newContrast = this.state.allFilters.contrast;
    var newSaturation = this.state.allFilters.saturation;
    var newVibrance = this.state.allFilters.vibrance;

    console.log("@@@@@@@@@@@@@@@");
    console.log(img);
    console.log(newBrightness);
    console.log(newContrast);
    console.log(newSaturation);
    console.log(newVibrance);
    console.log("@@@@@@@@@@@@@@@");

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
      <div className="App">
        {/* <Nav /> */}
        <div className = "flex flex-col md:flex-row justify-center">
        <ImgUpload updateImageNewUserUpload = {this.updateImageNewUserUpload} addFileToAllFiles={this.addFileToAllFiles} allFiles={this.state.allFiles}/>
        {/* <ReplaceImg updateImage = {this.updateImage}/> */}
        <Filters img={this.state.img} file={this.state.file} fileName={this.state.fileName} allFilters={this.state.allFilters} updateFilters={this.updateFilters}/>
        <AllPhotos updateAllFiles={this.updateAllFiles} allFiles={this.state.allFiles} updateImageOldUpload={this.updateImageOldUpload} rerenderShitForLoadFromStorageTwo={this.rerenderShitForLoadFromStorageTwo}/>




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
        
        </div>
      </div>
    );
  }
}

export default App;