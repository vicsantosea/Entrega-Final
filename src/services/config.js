
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyDQoL5_0lso_2_KbTLOqP3zWM2lqZlAQSs",
  authDomain: "futurestore-95.firebaseapp.com",
  projectId: "futurestore-95",
  storageBucket: "futurestore-95.appspot.com",
  messagingSenderId: "586917920406",
  appId: "1:586917920406:web:8a90c890f2bc0573cb4cb7"
};


const app = initializeApp(firebaseConfig);

export const db= getFirestore(app)


