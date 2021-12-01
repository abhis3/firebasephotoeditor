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

import { getStorage, ref } from "firebase/storage";

import { uploadFileFunction, downloadFile, getAllFilesInBucket } from './test';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {img: {}, file: {}, fileName: ''};
    this.updateImage = this.updateImage.bind(this);
  }

  updateImage(img, file, fileName) {
    this.setState({img: img, file: file, fileName: fileName});
    console.log("app", this.state.file);
  }

  render() {
    return (
      <div className="App">
        {/* <Nav /> */}
        <div className = "flex flex-col md:flex-row justify-center">
        <ImgUpload updateImage = {this.updateImage}/>
        <ReplaceImg updateImage = {this.updateImage}/>
        <Filters img={this.state.img} file={this.state.file} fileName={this.state.fileName}/>
        <AllPhotos allPhotos/>
        <button onClick={() => uploadFileFunction("/Users/abhisun/Downloads/tree.jpg")}>
          UPLOAD FILE
        </button>

        <button onClick={() => downloadFile('images/tree.jpg')}>
          DOWNLOAD FILE
        </button>

        <button onClick={() => getAllFilesInBucket()}>
          LIST FILES
        </button>
        
        </div>
      </div>
    );
  }
}

export default App;