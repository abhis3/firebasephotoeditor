import React, { Component } from "react";
import ReactDOM from "react-dom";
import Button from "@mui/material/Button";
import Brightness6Icon from '@mui/icons-material/Brightness6';
import ContrastIcon from '@mui/icons-material/Contrast';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import OpacityIcon from '@mui/icons-material/Opacity';

//import { Caman } from "caman";

import { uploadFileFunction, downloadFile, downloadFileGetURL } from '../test';
import { app, database, storage, storageRef } from '../firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { set, ref as databaseRef } from "firebase/database";

class Filters extends Component {
  constructor(props) {
    super(props);
    this.addFilters = this.addFilters.bind(this);
    this.removeFilters = this.removeFilters.bind(this);
    this.downloadImg = this.downloadImg.bind(this);
    //this.updateCanvasImage = this.updateCanvasImage.bind(this);
    // this.state = {
    //   brightness: 0,
    //   contrast: 0,
    //   saturation: 0,
    //   vibrance: 0
    // };
    // this.onBrightnessChangeUp = this.onBrightnessChangeUp.bind(this);
    // this.onBrightnessChangeDown = this.onBrightnessChangeDown.bind(this);
    this.onFilterButtonClick = this.onFilterButtonClick.bind(this);
    //this.rerenderShit = this.rerenderShit.bind(this);
  }

  // writeToDatabase() {
  //   let photoName = this.props.fileName;
  //   photoName = photoName.replace(/\.[^/.]+$/, "")
  //   let photoData = {
  //       "history": [
  //         {
  //           "brightness": 0,
  //           "contrast": 0,
  //           "saturation": 0,
  //           "vibrance": 0
  //         }
  //       ]
  //   }

  //   console.log("TESTING123");
  //   console.log(photoName);
  //   set(databaseRef(database, 'photos/' + photoName), photoData);
  //   console.log("Successfully uploaded photo edit history: " + photoName)
  // }

  // rerenderShit() {
  //   let img = this.props.img;
  //   // console.log("rerendershit " + this.state.brightness);
  //   // let newState = this.state.brightness;
  //   console.log("+++++++++++++++++++");
  //   console.log(this.props);
  //   console.log("+++++++++++++++++++");
  //   window.Caman("#canvas", img, function () {
  //       this.brightness(this.props.allFilters.brightness).render();
  //     });
  // }

  onFilterButtonClick(filterName, delta) {
      // let newValue = this.state.brightness + 5;
      // let fileName = this.props.fileName;
      // this.setState({brightness: newValue});
      this.props.updateFilters(filterName, delta);
      // this.rerenderShit();
      //UNCOMMENT this.writeToDatabase();
      // console.log(this.state);
  };

  addFilters() {
    let img = this.props.img;
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("filter-btn")) {
        if (e.target.classList.contains("brightness-add123")) {
          this.setState({brightness: 5});
          // console.log("----------");
          // console.log(this.state);
          // console.log("----------");
          window.Caman("#canvas", img, function () {
            //this.brightness(0).render();
            this.brightness(this.state.brightness).render();
          });
        } else if (e.target.classList.contains("brightness-remove123")) {
          window.Caman("#canvas", img, function () {
            this.brightness(-5).render();
          });
        } else if (e.target.classList.contains("contrast-add123")) {
          window.Caman("#canvas", img, function () {
            this.contrast(5).render();
          });
        } else if (e.target.classList.contains("contrast-remove123")) {
          window.Caman("#canvas", img, function () {
            this.contrast(-5).render();
          });
        } else if (e.target.classList.contains("saturation-add123")) {
          window.Caman("#canvas", img, function () {
            this.saturation(5).render();
          });
        } else if (e.target.classList.contains("saturation-remove123")) {
          window.Caman("#canvas", img, function () {
            this.saturation(-5).render();
          });
        } else if (e.target.classList.contains("vibrance-add123")) {
          window.Caman("#canvas", img, function () {
            this.vibrance(5).render();
          });
        } else if (e.target.classList.contains("vibrance-remove123")) {
          window.Caman("#canvas", img, function () {
            this.vibrance(-5).render();
          });
        } else if (e.target.classList.contains("vintage-add123")) {
          window.Caman("#canvas", img, function () {
            this.vintage().render();
          });
        } else if (e.target.classList.contains("nostalgia-add123")) {
          window.Caman("#canvas", img, function () {
            this.reloadCanvasData();
            this.nostalgia().render();
          });
        } else if (e.target.classList.contains("pinhole-add123")) {
          window.Caman("#canvas", img, function () {
            this.pinhole().render();
          });
        } else if (e.target.classList.contains("sincity-add123")) {
          window.Caman("#canvas", img, function () {
            this.sinCity().render();
          });
        } else if (e.target.classList.contains("cross-add123")) {
          window.Caman("#canvas", img, function () {
            this.reloadCanvasData();
            this.crossProcess().render();
          });
        } else if (e.target.classList.contains("pinhole-add123")) {
          window.Caman("#canvas", img, function () {
            this.pinhole().render();
          });
        }
      }
    });
  }

  removeFilters() {
    // Remove Filters
    const removeBtn = document.getElementById("remove");
    let img = this.props.img;
    const file = this.props.file;
    console.log("filters", file);
    if (removeBtn) {
      removeBtn.addEventListener("click", (e) => {
        console.log("APPLE");

        window.Caman("#canvas", img, function () {
          // this.revert();
          const canvas = document.getElementById("canvas");
          let ctx = canvas.getContext('2d');
          const reader = new FileReader();
          reader.readAsDataURL(file);
		       // Add image to canvas
      reader.addEventListener(
        "load",
        () => {
          // Create image
          img = new Image();
          // Set image src
          img.src = reader.result;
          // On image load add to canvas
          img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            canvas.removeAttribute("data-caman-id");
          };
        },
        false
      );
        });
      });
    }
  }

  downloadImg() {
    // Download Event
    let fileName = this.props.fileName;
    const downloadBtn = document.getElementById("download");
    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => {

        // Get ext
        const fileExtension = fileName.slice(-4);

        // Init new filename
        let newFilename;

        // Check image type
        if (fileExtension === ".jpg" || fileExtension === ".png") {
          // new filename
          newFilename =
            fileName.substring(0, fileName.length - 4) + "-edited.jpg";
        }

        // Call download
        const canvas = document.getElementById("canvas");
        download(canvas, newFilename);
      });

      // Download
      function download(canvas, filename) {
        // Init event
        let e;
        // Create link
        const link = document.createElement("a");

        // Set props
        link.download = filename;
        link.href = canvas.toDataURL("image/jpeg", 0.8);
        // New mouse event
        e = new MouseEvent("click");
        // Dispatch event
        link.dispatchEvent(e);
      }
    }
  }

  // updateCanvasImage() {
  //   const replaceBtn = document.getElementById("replace");
  //   if (replaceBtn) {
  //     replaceBtn.addEventListener("click", () => {
  //       console.log("attempting update");

  //       const firebaseURL = downloadFileGetURL('images/tree.jpg');

  //       //this.props.img
  //       let imageFirebase = firebaseURL;

  //       const canvas = document.getElementById("canvas");
  //       const ctx = canvas.getContext("2d");
  //       let img = new Image();

  //       img.onload = function() {
  //         ctx.drawImage(img, 0, 0, img.width, img.height);
  //         canvas.removeAttribute("data-caman-id");
  //     }

  //     this.reloadCanvasData();

  //     // this.props.img = img;
  //     img.src = imageFirebase;
  //   });
  // }
  // }




  render() {
    this.addFilters();
    this.removeFilters();
    this.downloadImg();
    //this.rerenderShit();
    //this.updateCanvasImage();
    return (
      <div className="container mx-auto p-5">
        <div className="flex flex-col items-center justify-evenly">


          <div className="flex mb-4" role="group">
            <Button
              variant="contained"
              className="filter-btn brightness-add text-white px-4 py-1 bg-gray-800  capitalize text outline-none focus:outline-none"
              onClick={() => this.onFilterButtonClick("brightness", 5)}
            >
              +
            </Button>

          <Brightness6Icon fontSize="large" />

            <span className="inline-block w-40 py-1 bg-gray-100 uppercase text-gray-800 capitalize">
              Brightness
            </span>

            <button
              className="filter-btn brightness-remove text-white px-4 py-1 bg-gray-800  capitalize text outline-none focus:outline-none"
              type="button"
              onClick={() => this.onFilterButtonClick("brightness", -5)}
            >
              -
            </button>
          </div>



          <div className="flex mb-4" role="group">

            <button
              className="filter-btn contrast-add text-white px-4 py-1 bg-gray-800  capitalize text outline-none focus:outline-none"
              type="button"
              onClick={() => this.onFilterButtonClick("contrast", 5)}
            >
              +
            </button>

            <ContrastIcon fontSize="large" />

            <span className="inline-block w-40 py-1 bg-gray-100 uppercase text-gray-800 capitalize">
              Contrast
            </span>

            <button
              className="filter-btn contrast-remove text-white px-4 py-1 bg-gray-800  capitalize text outline-none focus:outline-none"
              type="button"
              onClick={() => this.onFilterButtonClick("contrast", -5)}
            >
              -
            </button>
          </div>





          <div className="flex mb-4" role="group">

            <button
              className="filter-btn saturation-add text-white px-4 py-1 bg-gray-800  capitalize text outline-none focus:outline-none"
              type="button"
              onClick={() => this.onFilterButtonClick("saturation", 5)}
            >
              +
            </button>

            <ColorLensIcon fontSize="large" />

            <span className="inline-block w-40 py-1 bg-gray-100 uppercase text-gray-800 capitalize">
              Saturation
            </span>

            <button
              className="filter-btn saturation-remove text-white px-4 py-1 bg-gray-800  capitalize text outline-none focus:outline-none"
              type="button"
              onClick={() => this.onFilterButtonClick("saturation", -5)}
            >
              -
            </button>

          </div>




          <div className="flex mb-4" role="group">

            <button
              className="filter-btn vibrance-add text-white px-4 py-1 bg-gray-800  capitalize text outline-none focus:outline-none"
              type="button"
              onClick={() => this.onFilterButtonClick("vibrance", 5)}
            >
              +
            </button>

            <OpacityIcon fontSize="large" />

            <span className="inline-block w-40 py-1 bg-gray-100 uppercase text-gray-800 capitalize">
              Vibrance
            </span>

            <button
              className="filter-btn vibrance-remove text-white px-4 py-1 bg-gray-800  capitalize text outline-none focus:outline-none"
              type="button"
              onClick={() => this.onFilterButtonClick("vibrance", -5)}
            >
              -
            </button>

          </div>


        </div>








        <div className="flex flex-col p-8 justify-evenly">
          <button
            className="filter-btn vintage-add text-white px-4 py-1 mb-4 bg-gray-800  capitalize text outline-none focus:outline-none"
            type="button"
          >
            Vintage
          </button>
          <button
            className="filter-btn nostalgia-add text-white px-4 py-1 mb-4 bg-gray-800  capitalize text outline-none focus:outline-none"
            type="button"
          >
            Nostalgia
          </button>
          <button
            className="filter-btn cross-add text-white px-4 py-1 mb-4 bg-gray-800  capitalize text outline-none focus:outline-none"
            type="button"
          >
            Cross Process
          </button>
          <button
            className="filter-btn pinhole-add text-white px-4 py-1 mb-4 bg-gray-800  capitalize text outline-none focus:outline-none"
            type="button"
          >
            Pin Hole
          </button>
        </div>
        <div className="flex mx-auto w-3/4 justify-evenly">
          <button
            className="filter-btn text-white px-4 py-1 bg-green-500  capitalize text outline-none focus:outline-none"
            type="button"
            id="download"
          >
            Download
          </button>

          {/* <button
            className="filter-btn text-white px-4 py-1 bg-green-500  capitalize text outline-none focus:outline-none"
            type="button"
            id="replace"
          >
            Replace Image
          </button> */}


          <button
            className="filter-btn text-white px-4 py-1 bg-red-500  capitalize text outline-none focus:outline-none"
            type="button"
            id="remove"
          >
            Reset Filters
          </button>
        </div>



        {/* <div className="FilterSetting">
          <input type="range" min="-100" max="100" step="1" value="0" data-filter="brightness">
          <span class="FilterValue">0</span>
        </div> */}



      </div>
    );
  }
}

export default Filters;