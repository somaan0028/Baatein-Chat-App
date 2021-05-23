import React, { useState, useEffect } from "react"
import { Card, Button, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import ProfileSetup from "./ProfileSetup"
import { CircularProgress } from '@material-ui/core';
import ChatPanel from './ChatPanel';
import { projectFirestore, projectDatabase, projectStorage } from '../firebase';
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
      let receivedData = docRef.data();
      if(!receivedData){
        console.log("No user profile found");
        setUserProfile(null);
      }else{
        console.log("User profile found");
        setUserProfile(receivedData);
      }
    }, 
    err=>{
      // console.log(err);
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