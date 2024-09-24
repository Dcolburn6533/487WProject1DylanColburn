//firebase page
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyBCm5QtNQDHsiwy76jUmUjlpNxgE8Ol87A",
    authDomain: "psuidcheck.firebaseapp.com",
    projectId: "psuidcheck",
    storageBucket: "psuidcheck.appspot.com",
    messagingSenderId: "161280987935",
    appId: "1:161280987935:web:f8b804ec050d6abb58162a",
    measurementId: "G-DPN95C7S5G"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);