import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"; 
const firebaseConfig = {
  apiKey: "AIzaSyCIKpYISy796PTfoVOyHsTfO0ELm5ILyrk",
  authDomain: "subscription-tracker-c5ebb.firebaseapp.com",
  projectId: "subscription-tracker-c5ebb",
  storageBucket:" ",
  messagingSenderId:" ",
  appId:" ",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app);

export const auth = getAuth(app)