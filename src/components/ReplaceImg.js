import React, { Component } from "react";
import { uploadFileFunction, downloadFile, downloadFileGetURL } from '../test';
import { app, database, storage, storageRef } from '../firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";



class ReplaceImg extends Component {

  constructor(props) {
    super(props);
    this.state = {img: {}, file: {}, fileName: ''};
  }

  handleClick(photoLink) {
    console.log("!!!!!!!!!!!!!!!!!!");
    var canvas = document.getElementById("canvas");
    console.log(canvas);
    var ctx = canvas.getContext("2d");
    console.log(ctx);

    // ctx.fillStyle="red";
    // ctx.fillRect(20,20,20,20);

    getDownloadURL(ref(storage, photoLink))
    .then((url) => {
        // `url` is the download URL for 'images/stars.jpg'
        console.log("#####");
        console.log(url);

        let img = new Image();
        img.onload = function() {
            ctx.drawImage(img, 0, 0);
        }
        img.src = url;
        img.crossOrigin = "Anonymous";
    })
    .catch((error) => {
        console.log("ERROR DONWLOADING");
        console.log(error);
    });





    // this.setState({img: img, file: {}, fileName: ""});
    // this.props.updateImage(this.state.img, this.state.file, this.state.fileName);
    // console.log("GOT HERE");
    // console.log(this.state.file);
  }


// componentDidMount() {
//     const canvas = document.getElementById("canvas");
//     const ctx = canvas.getContext("2d");
//     const replaceFile = document.getElementById("replace");
//     let img = new Image();
//     let fileName = "";

//     //let firebaseURL = downloadFileGetURL('images/tree.jpg');
//     let firebaseURL = "https://firebasestorage.googleapis.com/v0/b/fir-photo-editor-8cc11.appspot.com/o/images%2Ftree.jpg?alt=media&token=b7d9b596-dfce-4f8d-8c0a-3bb8844a59c8";

//     replaceFile.addEventListener("click", () => {
//     // Create image
//     console.log("$$$$$$$$$$$$$$$$$$");
//     console.log(firebaseURL);
//     img = new Image();
//     img.src = firebaseURL;

//     // On image load add to canvas
//     img.onload = function () {
//         // canvas.width = 480;
//         // canvas.height = 640;
//         ctx.drawImage(img, 0, 0, 480, 640);
//         //ctx.drawImage(img, 100, 100);
//         //canvas.removeAttribute("data-caman-id");
//     }


//     //updating state
//     this.setState({img: img, file: {}, fileName: 'images/tree.jpg'});
//     this.props.updateImage(this.state.img, this.state.file, this.state.fileName);
//     console.log(this.state.file);
//     });
// }
    

  render() {
    return (
      <div className="container mx-auto p-5">
        {/* <button
            className="filter-btn contrast-add text-white px-4 py-1 bg-gray-800  capitalize text outline-none focus:outline-none"
            type="button"
            id="replace"
        >
              REPLACE IMAGE
        </button> */}

        <button onClick={() => this.handleClick('images/tree.jpg')}>
        REPLACE IMAGE
        </button>


        {/* <canvas
          className="mx-auto p-5 bg-gray-100 w-full md:w-3/4 my-4"
          id="canvas"
        ></canvas> */}
      </div>
    );
  }
}

export default ReplaceImg;