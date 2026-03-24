import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCIKpYISy796PTfoVOyHsTfO0ELm5ILyrk",
  authDomain: "subscription-tracker-c5ebb.firebaseapp.com",
  projectId: "subscription-tracker-c5ebb",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)