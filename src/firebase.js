import firebase from "firebase/app"
import "firebase/auth"
import 'firebase/firestore';
import 'firebase/storage';

const app = firebase.initializeApp({
  apiKey: "AIzaSyD2ZQo2EKfnU1TSuOR6u6eg2t6UhLuyFWo",
  authDomain: "baatein-development.firebaseapp.com",
  projectId: "baatein-development",
  storageBucket: "baatein-development.appspot.com",
  messagingSenderId: "329510846600",
  appId: "1:329510846600:web:d1b0047374f9b0c8899f3d"
})

// export const auth = app.auth()
// export const db = app.firestore()
// export const projectStorage = app.storage()
// export default app

const auth = app.auth();
const projectFirestore = app.firestore();
const projectStorage = app.storage();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { auth, projectFirestore, projectStorage, timestamp };
 