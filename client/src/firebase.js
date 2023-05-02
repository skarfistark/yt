// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth , GoogleAuthProvider} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDK8aa8OfuQuloh_klROGQ-rbPH2F220do",
  authDomain: "video-d05d5.firebaseapp.com",
  projectId: "video-d05d5",
  storageBucket: "video-d05d5.appspot.com",
  messagingSenderId: "745798214790",
  appId: "1:745798214790:web:fc51aa37c0510ec4231d07"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
export default app;