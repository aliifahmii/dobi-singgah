import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"
import { getDatabase } from "firebase/database";

// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyChuz5fnRHcDoCXV5RbbRKf3mV6Lth2El0",
  authDomain: "dobi-singgah.firebaseapp.com",
  projectId: "dobi-singgah",
  storageBucket: "dobi-singgah.appspot.com",
  messagingSenderId: "506363709422",
  appId: "1:506363709422:web:7ecadab81e378266d370ff",
  measurementId: "G-62YH7Z7NE6",
  databaseURL: "https://dobi-singgah-default-rtdb.asia-southeast1.firebasedatabase.app/",
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const database = getDatabase(app);

export { db, auth, storage, database };