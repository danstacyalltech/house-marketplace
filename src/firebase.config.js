// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuT7RKIcodI3GxYek1gJEQrhSHO2FS6n8",
  authDomain: "house-marketplace-app-c7b18.firebaseapp.com",
  projectId: "house-marketplace-app-c7b18",
  storageBucket: "house-marketplace-app-c7b18.appspot.com",
  messagingSenderId: "224521125348",
  appId: "1:224521125348:web:0fb95f7f26ae3b60c05bf1",
  measurementId: "G-3P6N30X138"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore()