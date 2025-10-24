import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDcEpz7y-UdceHfclowTnuMUQFkfh4Y1CQ",
  authDomain: "graduationproject-8fc97.firebaseapp.com",
  projectId: "graduationproject-8fc97",
  storageBucket: "graduationproject-8fc97.appspot.com",
  messagingSenderId: "9029606585",
  appId: "1:9029606585:web:7f59b32dd2855ee8af4f68",
  measurementId: "G-KN1X9CSYJK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
