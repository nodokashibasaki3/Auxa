// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAd0K3KqxitWnfn-QZKTOl7a3ISm99rbug",
  authDomain: "auxa-85642.firebaseapp.com",
  projectId: "auxa-85642",
  storageBucket: "auxa-85642.firebasestorage.app",
  messagingSenderId: "139611903139",
  appId: "1:139611903139:web:18b64accc962b118a95b16",
  measurementId: "G-ZLJKNJSHX4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };