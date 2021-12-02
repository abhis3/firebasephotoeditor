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
    this.updateAllFiles = this.updateAllFiles.bind(this);
    this.addFileToAllFiles = this.addFileToAllFiles.bind(this);
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
//       console.log("POGGERS");
//       // console.log(this.state.allFiles);
//       console.log(this.state);
//   });
// }

  updateImageNewUserUpload(img, file, fileName) {
    let fileNameNoExtension = fileName;
    fileNameNoExtension = fileNameNoExtension.replace(/\.[^/.]+$/, "")

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
    });
    console.log("app", this.state.file);
    console.log("overall state on update image new upload", this.state);
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
    console.log("&&&&&&&&&&&&&&&&&");
    console.log(this.state);
    console.log(fileToAdd);

    var newAllFiles = this.state.allFiles;
    const newPath = "images/" + fileToAdd;
    newAllFiles.push({name: fileToAdd, fullPath: newPath});

    this.setState({allFiles: newAllFiles});

    console.log(this.state);
    console.log("&&&&&&&&&&&&&&&&&");
  }

  render() {
    return (
      <div className="App">
        {/* <Nav /> */}
        <div className = "flex flex-col md:flex-row justify-center">
        <ImgUpload updateImageNewUserUpload = {this.updateImageNewUserUpload} addFileToAllFiles={this.addFileToAllFiles} allFiles={this.state.allFiles}/>
        {/* <ReplaceImg updateImage = {this.updateImage}/> */}
        <Filters img={this.state.img} file={this.state.file} fileName={this.state.fileName}/>
        <AllPhotos updateAllFiles={this.updateAllFiles} allFiles={this.state.allFiles}/>




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