import firebase from "firebase/app"
import "firebase/auth"
import 'firebase/firestore';
import 'firebase/storage';

// const app = firebase.initializeApp({
//   apiKey: "AIzaSyD2ZQo2EKfnU1TSuOR6u6eg2t6UhLuyFWo",
//   authDomain: "baatein-development.firebaseapp.com",
//   projectId: "baatein-development",
//   storageBucket: "baatein-development.appspot.com",
//   messagingSenderId: "329510846600",
//   appId: "1:329510846600:web:d1b0047374f9b0c8899f3d"
// })
const app = firebase.initializeApp({
  apiKey: "AIzaSyCj2NII-9J52Pd5Jb2U5mthzPwMmmfOIgY",
  authDomain: "test-firestore-bc69b.firebaseapp.com",
  projectId: "test-firestore-bc69b",
  storageBucket: "test-firestore-bc69b.appspot.com",
  messagingSenderId: "881812761789",
  appId: "1:881812761789:web:2c185e0a60bb7652ad9bd4"
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
 