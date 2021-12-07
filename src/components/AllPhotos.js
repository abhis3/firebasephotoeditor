// List All Photos in a List Menu Thing

import React, { Component } from "react";
import { uploadFileFunction, downloadFile, downloadFileGetURL } from '../test';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { app, database, storage, storageRef } from '../firebaseConfig';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import FolderIcon from '@mui/icons-material/Folder';
import ImageIcon from '@mui/icons-material/Image';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';


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

    SelectedListItem() {
        // const [selectedIndex, setSelectedIndex] = React.useState(1);
      
        const handleListItemClick = (event) => {
        //   setSelectedIndex(index);
          console.log("PUSHED BUTTON");
        };
      
        return (
          <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <List component="nav" aria-label="main mailbox folders">
              
              <ListItemButton
                onClick={(event) => handleListItemClick(event)}
              >
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Inbox" />
              </ListItemButton>


            </List>



            <Divider />
            {/* <List component="nav" aria-label="secondary mailbox folder">
              <ListItemButton
                selected={selectedIndex === 2}
                onClick={(event) => handleListItemClick(event, 2)}
              >
                <ListItemText primary="Trash" />
              </ListItemButton>
              <ListItemButton
                selected={selectedIndex === 3}
                onClick={(event) => handleListItemClick(event, 3)}
              >
                <ListItemText primary="Spam" />
              </ListItemButton>
            </List> */}
          </Box>
        );
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

        const movesNewButton = allCurrentFiles.map((entry, index) => {
            const desc = `${entry.name}`;
            return (
                <ListItemButton 
                    onClick={() => this.handleClickReplaceImage(entry.fullPath, entry.name)}
                >
                    <ListItemIcon>
                        <ImageIcon />
                    </ListItemIcon>
                    <ListItemText primary={desc} />
                </ListItemButton>
            );
        });

        const handleListItemClick = (event) => {
            //   setSelectedIndex(index);
              console.log("PUSHED BUTTON");
            };

        return (
            <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <List component="nav" aria-label="main mailbox folders">
                
                <ListItemButton
                  onClick={(event) => handleListItemClick(event)}
                  disabled={true}
                >
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary="Open File" />
                </ListItemButton>

              </List>
  
  
              <Divider />

            <List component="nav" aria-label="secondary mailbox folder">
                {movesNewButton}
              </List>

            </Box>
          );

    }


}

export default AllPhotos;