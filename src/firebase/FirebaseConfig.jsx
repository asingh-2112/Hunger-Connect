// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJZufjVBvCcYdu5cJjHubWKXp_RHY1eIY",
  authDomain: "myblog-3450f.firebaseapp.com",
  projectId: "myblog-3450f",
  storageBucket: "myblog-3450f.firebasestorage.app",
  messagingSenderId: "110673509026",
  appId: "1:110673509026:web:9adb2ecca9047224cbb5fb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fireDb=getFirestore(app);
const auth=getAuth(app);
const storage=getStorage(app);

export {fireDb,auth,storage}