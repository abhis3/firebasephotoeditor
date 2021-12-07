import React, { Component } from "react";
import { uploadFileFunction, downloadFile, downloadFileGetURL } from '../test';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

class ImgUpload extends Component {

  constructor(props) {
    super(props);
    // ??? this.state = {img: {}, file: {}, fileName: ''};
  }

  componentDidMount() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const uploadFile = document.getElementById("contained-button-file");
    let img = new Image();
    let fileName = "";

    //let firebaseURL = downloadFileGetURL('images/tree.jpg');
    // console.log("TEST");
    // console.log(firebaseURL);

    // Upload File
    uploadFile.addEventListener("change", () => {
      // Get File
      const file = document.getElementById("contained-button-file").files[0];
      // Init FileReader API
      const reader = new FileReader();

      // Check for file
      if (file) {
        // Set file name
        fileName = file.name;
        // Read data as URL
        reader.readAsDataURL(file);
      }

      // Add image to canvas
      reader.addEventListener(
        "load",
        () => {
          // Create image
          img = new Image();
          // Set image src
          img.src = reader.result;
          uploadFileFunction(file, fileName);
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
      //updating state
    // ??? this.setState({img: img, file: file, fileName: fileName});
    // ??? this.props.updateImageNewUserUpload(this.state.img, this.state.file, this.state.fileName);
    this.props.updateImageNewUserUpload(img, file, fileName);
    this.props.addFileToAllFiles(fileName);
    //console.log(this.state.file);
    });
    
  }

  render() {
    const Input = styled('input')({
      display: 'none',
    });

    return (
      <Button
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
      >

        Upload File
        <input
          type="file"
          id="contained-button-file"
          hidden
        />
      </Button>



      // <div className="container mx-auto p-5">
      //   <input
      //     type="file"
      //     className="text-white w-3/4 px-4 py-2 bg-gray-800  capitalize text outline-none focus:outline-none"
      //     id="contained-button-file"
      //   >
      //   </input>
      // </div>
    );
  }
}

export default ImgUpload;