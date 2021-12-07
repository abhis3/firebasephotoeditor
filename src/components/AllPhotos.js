// List All Photos in a List Menu Thing

import React, { Component } from "react";
import { uploadFileFunction, downloadFile, downloadFileGetURL } from '../test';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { app, database, storage, storageRef } from '../firebaseConfig';


class AllPhotos extends Component {

    constructor(props) {
        super(props);
        //this.state = {img: {}, file: {}, fileName: '', allFiles: []};
    }

    componentWillMount() {
        this.getAllFilesInBucket()
    }

    getAllFilesInBucket() {
        const listReference = ref(storage, "images");
        
        listAll(listReference).then((res) => {
            //console.log("@@@@@");
            // ??? var newAllFiles = this.state.allFiles;
            var newAllFiles = [];
            res.items.forEach((itemRef) => {
                const mapping = {name: itemRef.name, fullPath: itemRef.fullPath}
                newAllFiles.push(mapping)
                //console.log(itemRef.name);
                //console.log(itemRef.fullPath);
            });
            // console.log(this.state);
            // ??? this.setState({allFiles: newAllFiles});
            this.props.updateAllFiles(newAllFiles);
        });
    }

    handleClickReplaceImage(photoLink, fileName) {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        var img = null;
    
        // ctx.fillStyle="red";
        // ctx.fillRect(20,20,20,20);
    
        getDownloadURL(ref(storage, photoLink))
        .then((url) => {
            // `url` is the download URL for 'images/stars.jpg'
            // console.log("#####");
            // console.log(url);
    
            img = new Image();
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                canvas.removeAttribute("data-caman-id");
            }
            img.src = url;
            img.crossOrigin = "Anonymous";

            console.log("~~~~~~~");
            console.log(photoLink);

            // this.props.updateImageOldUpload(img, fileName);
            setTimeout(function(){
                this.props.updateImageOldUpload(img, fileName);
            }.bind(this), 500);
        })
        .catch((error) => {
            console.log("ERROR DONWLOADING");
            console.log(error);
        });

        // this.props.rerenderShitForLoadFromStorageTwo();


    }


    render() {
        const allCurrentFiles = this.props.allFiles;

        const moves = allCurrentFiles.map((entry, index) => {
            const desc = `Open ${entry.name}`;
            return (
                <li key={index}>
                    <button onClick={() => this.handleClickReplaceImage(entry.fullPath, entry.name)}> 
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