import { database } from './firebaseConfig';
import { ref, set } from "firebase/database";

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