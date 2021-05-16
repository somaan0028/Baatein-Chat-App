import React, { useState, useEffect } from "react"
import { Card, Button, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import ProfileSetup from "./ProfileSetup"
import { CircularProgress } from '@material-ui/core';
import ChatPanel from './ChatPanel';
import { projectFirestore, projectDatabase } from '../firebase';
import NetworkError from "./NetworkError"


export default function Dashboard() {
  const [error, setError] = useState(false)
  const { currentUser, logout } = useAuth()
  const history = useHistory()
  const [ isLoading , setIsLoading ] = useState(true);
  const [ userProfile, setUserProfile ] = useState(null);



  useEffect(()=>{
    console.log(currentUser.uid);
    console.log("Going to check for current user profile")
    projectFirestore.collection("profiles").doc(currentUser.uid).onSnapshot((docRef)=>{
      console.log(docRef.data());
      setIsLoading(false);
      if(!docRef.data()){
        console.log("No user profile found");
        setUserProfile(null);
      }else{
        console.log("User profile found");
        setUserProfile(docRef.data());
      }
    }, 
    err=>{
      // console.log(err);
      console.log("AN ERROR OCCURED WHILE FETCHING USER PROFILE");
      setError(true)
    })

    // projectDatabase.ref("/status/").onDisconnect().set("Just Disconnected").then(()=>{
    //   projectFirestore.collection("profiles").doc(currentUser.uid).update({
    //     status: "I disconnected"
    //   })
    // })

    // firebase.database().ref('.info/connected').on('value', function(snapshot) {
    //   if (snapshot.val() == false) {
    //       // Instead of simply returning, we'll also set Firestore's state
    //       // to 'offline'. This ensures that our Firestore cache is aware
    //       // of the switch to 'offline.'
    //       userStatusFirestoreRef.set(isOfflineForFirestore);
    //       return;
    //   };
  
    //   userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
    //       userStatusDatabaseRef.set(isOnlineForDatabase);
  
    //       // We'll also add Firestore set here for when we come online.
    //       userStatusFirestoreRef.set(isOnlineForFirestore);
    //   });
  // });
  }, [])

  return (
    <>

      { isLoading && <CircularProgress className="dashboard-loading-sign" size={50}/> }
      {!isLoading && userProfile && <ChatPanel userProfile={userProfile} /> }
      {!isLoading && !userProfile && <ProfileSetup setUserProfile={setUserProfile} /> }

    </>

  )
}