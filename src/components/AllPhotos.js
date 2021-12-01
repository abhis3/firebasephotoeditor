// List All Photos in a List Menu Thing

import React, { Component } from "react";
import { uploadFileFunction, downloadFile, downloadFileGetURL } from '../test';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { app, database, storage, storageRef } from '../firebaseConfig';


class AllPhotos extends Component {

    constructor(props) {
        super(props);
        this.state = {img: {}, file: {}, fileName: '', allFiles: []};
    }

    componentWillMount() {
        this.getAllFilesInBucket()
        console.log("TEST");
        console.log(this.state);
    }

    handleReplaceImageClick(photoLink) {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
    
        // ctx.fillStyle="red";
        // ctx.fillRect(20,20,20,20);
    
        getDownloadURL(ref(storage, photoLink))
        .then((url) => {    
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
      }

    getAllFilesInBucket() {
        const listReference = ref(storage, "images");
        
        listAll(listReference).then((res) => {
            //console.log("@@@@@");
            var newAllFiles = this.state.allFiles;
            res.items.forEach((itemRef) => {
                const mapping = {name: itemRef.name, fullPath: itemRef.fullPath}
                newAllFiles.push(mapping)
                //console.log(itemRef.name);
                //console.log(itemRef.fullPath);
            });
            console.log(this.state);
            this.setState({allFiles: newAllFiles});
            // console.log("POGGERS");
            // console.log(this.state.allFiles);
            // console.log(this.state);
        });
    }

    handleClickReplaceImage(photoLink) {
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
            // console.log("#####");
            // console.log(url);
    
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
    }


    render() {
        const allCurrentFiles = this.state.allFiles;

        console.log("ALLCURRENT_FILES");
        console.log(allCurrentFiles);
        const moves = allCurrentFiles.map((entry, index) => {
            // console.log("++++++++++++++");
            // console.log(entry);
            // console.log(index);
            // console.log("++++++++++++++");
            const desc = `Open ${entry.name}`;
            return (
                <li key={index}>
                    <button onClick={() => this.handleClickReplaceImage(entry.fullPath)}> 
                        {desc}
                    </button>
                </li>
            );
        });


        return (
            // <button onClick={() => console.log(this.state)}>
            //     TESTING123
            // </button>
            <ol>{moves}</ol>
        );
    }


}

export default AllPhotos;