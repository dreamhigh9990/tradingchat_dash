// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: `${process.env.NEXT_PUBLIC_Firebase_API_Key}`,
  authDomain: `${process.env.NEXT_PUBLIC_Auth_Domain}`,
  databaseURL: `${process.env.NEXT_PUBLIC_Database_Url}`,
  projectId: `${process.env.NEXT_PUBLIC_Project_Id}`,
  storageBucket: `${process.env.NEXT_PUBLIC_Storage_Bucket}`,
  messagingSenderId: `${process.env.NEXT_PUBLIC_Message_Sender_Id}`,
  appId: `${process.env.NEXT_PUBLIC_App_Id}`,
  measurementId: `${process.env.NEXT_PUBLIC_MeasurementId}`,
};

export const otherKeys = {
  finhubAPIKey: `${process.env.finhubAPIKey}`,
  stripeSecretKey: `${process.env.stripeSecretKey}`,
  stripePublishableKey: `${process.env.stripePublishableKey}`,
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
// Initialize Realtime Database and get a reference to the service
export const rmDb = getDatabase(app);