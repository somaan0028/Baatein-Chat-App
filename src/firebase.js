import firebase from "firebase/app"
import "firebase/auth"
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/database';

const app = firebase.initializeApp({
  apiKey: "AIzaSyCj2NII-9J52Pd5Jb2U5mthzPwMmmfOIgY",
  authDomain: "test-firestore-bc69b.firebaseapp.com",
  projectId: "test-firestore-bc69b",
  storageBucket: "test-firestore-bc69b.appspot.com",
  messagingSenderId: "881812761789",
  appId: "1:881812761789:web:2c185e0a60bb7652ad9bd4"
})

const auth = app.auth();
const projectFirestore = app.firestore();
const projectStorage = app.storage();
const projectDatabase = firebase.database();
// const timestamp = firebase.firestore.FieldValue.serverTimestamp();
const timestamp = firebase.firestore.Timestamp;
const increment = firebase.firestore.FieldValue.increment(1);

export { auth, projectFirestore, projectStorage, timestamp, increment, projectDatabase };
 