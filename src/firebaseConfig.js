// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getStorage, ref } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJ-kgnlA-2W4Hs6LBasEBWeRiD5DovDY8",
  authDomain: "fir-photo-editor-8cc11.firebaseapp.com",
  projectId: "fir-photo-editor-8cc11",
  storageBucket: "fir-photo-editor-8cc11.appspot.com",
  messagingSenderId: "628678931462",
  appId: "1:628678931462:web:193e8d38aeb327eab5bf87",
  measurementId: "G-NEZB9EP631"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const analytics = getAnalytics(app);

export const storage = getStorage();
export const storageRef = ref(storage);