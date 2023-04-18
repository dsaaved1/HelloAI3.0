// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const getFirebaseApp = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyBhOs-z2x2t0gAJ8sMS7aphSossZbLr1M4",
    authDomain: "mind-4bdad.firebaseapp.com",
    projectId: "mind-4bdad",
    storageBucket: "mind-4bdad.appspot.com",
    messagingSenderId: "521217318633",
    appId: "1:521217318633:web:0110d06ca9daa2d24f9a78",
    measurementId: "G-GPZKQ8F5BP"
  };
      
      // Initialize Firebase
      return initializeApp(firebaseConfig);
}

