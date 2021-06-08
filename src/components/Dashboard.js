import React, { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import ProfileSetup from "./ProfileSetup"
import { CircularProgress } from '@material-ui/core';
import ChatPanel from './ChatPanel';
import { projectFirestore } from '../firebase';


export default function Dashboard() {
  const [error, setError] = useState(false)
  const { currentUser, logout } = useAuth()
  const [ isLoading , setIsLoading ] = useState(true);
  const [ userProfile, setUserProfile ] = useState(null);

  useEffect(()=>{

    projectFirestore.collection("profiles").doc(currentUser.uid).onSnapshot((docRef)=>{
      setIsLoading(false);
      let receivedData = docRef.data();
      if(receivedData){
        setUserProfile(receivedData);
      }
    },
    err=>{

      console.log("AN ERROR OCCURED WHILE FETCHING USER PROFILE");
      setError(true)
    })

  }, [])


  return (
    <>

      { isLoading && <CircularProgress className="dashboard-loading-sign" size={50}/> }
      {!isLoading && userProfile && <ChatPanel userProfile={userProfile} /> }
      {!isLoading && !userProfile && <ProfileSetup setUserProfile={setUserProfile} /> }

    </>

  )
}