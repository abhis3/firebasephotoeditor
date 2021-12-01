import { app, database, storage, storageRef } from './firebaseConfig';
import { set } from "firebase/database";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";

// Generate new board game and write initial state to RTDB
export function writeToDatabase(userId) {
    let userData = {
        "username": userId,
        "photos": ["123.jpg", "456.jpg"],
        "email": "test@google.com"
    }
    set(ref(database, 'photos/' + userId), userData);
    console.log("Successfully created user with id " + userId)
  }


// Generate new board game and write initial state to RTDB
export function uploadFileFunction(photoData, fileName) {
    // let userData = {
    //     "username": userId,
    //     "photos": ["123.jpg", "456.jpg"],
    //     "email": "test@google.com"
    // }
    const imageReference = ref(storage, `images/${fileName}`);
    //const fileToUpload = "/Users/abhisun/Downloads/tree.jpg";

    uploadBytes(imageReference, photoData).then((snapshot) => {
        console.log("Successfully uploaded pic");
    });
  }

  // Generate new board game and write initial state to RTDB
export function downloadFile(photoPath) {
  // let userData = {
  //     "username": userId,
  //     "photos": ["123.jpg", "456.jpg"],
  //     "email": "test@google.com"
  // }
  const imageReference = ref(storage, photoPath);
  //const fileToUpload = "/Users/abhisun/Downloads/tree.jpg";
  getDownloadURL(ref(storage, photoPath))
  .then((url) => {
    // `url` is the download URL for 'images/stars.jpg'
    console.log(url);

    // // This can be downloaded directly:
    // const xhr = new XMLHttpRequest();
    // xhr.responseType = 'blob';
    // xhr.onload = (event) => {
    //   const blob = xhr.response;
    // };
    // xhr.open('GET', url);
    // xhr.send();

    // // Or inserted into an <img> element
    // const img = document.getElementById('myimg');
    // img.setAttribute('src', url);

  })
  .catch((error) => {
    console.log("ERROR DONWLOADING");
    console.log(error);
  });
  
}



export function downloadFileGetURL(photoPath) {
  // let userData = {
  //     "username": userId,
  //     "photos": ["123.jpg", "456.jpg"],
  //     "email": "test@google.com"
  // }
  const imageReference = ref(storage, photoPath);
  //const fileToUpload = "/Users/abhisun/Downloads/tree.jpg";
  getDownloadURL(ref(storage, photoPath))
  .then((url) => {
    // `url` is the download URL for 'images/stars.jpg'
    // console.log("#####");
    // console.log(url);

    return url;

  })
  .catch((error) => {
    console.log("ERROR DONWLOADING");
    console.log(error);
  });
  
}


export function getAllFilesInBucket() {
  const listReference = ref(storage, "images");
  
  listAll(listReference).then((res) => {
    console.log("@@@@@");
    res.items.forEach((itemRef) => {
        console.log(itemRef.name);
        console.log(itemRef.fullPath);
    });
  });
}



// /Users/abhisun/Downloads/tree.jpg