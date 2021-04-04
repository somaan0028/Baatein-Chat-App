import React, { useState, useEffect } from "react"
import { Card, Button, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import ProfileSetup from "./ProfileSetup"
import { CircularProgress } from '@material-ui/core';
import ChatPanel from './ChatPanel';
import { projectFirestore } from '../firebase';


export default function Dashboard() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const history = useHistory()
  const [ isLoading , setIsLoading ] = useState(true);
  const [ userProfile, setUserProfile ] = useState(null);



  useEffect(()=>{
    console.log(currentUser.uid);
    console.log("Going to check for current user profile")
    projectFirestore.collection("profiles").doc(currentUser.uid).get()
    .then((docRef)=>{
      console.log(docRef.data());
      setIsLoading(false);
      if(!docRef.data()){
        console.log("No user profile found");
        setUserProfile(null);
      }else{
        console.log("User profile found");
        setUserProfile(docRef.data());
      }
    })
    .catch((err)=>{
      setIsLoading(false);
      setUserProfile(null);
      console.log(err);
    })
  }, [])

  return (
    <>
      {/* <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email:</strong> {currentUser.email}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div> */}

      { isLoading && <CircularProgress className="dashboard-loading-sign" size={50}/> }
      {!isLoading && userProfile && <ChatPanel userProfile={userProfile} /> }
      {!isLoading && !userProfile && <ProfileSetup setUserProfile={setUserProfile} /> }
      {/* <CircularProgress className="dashboard-loading-sign" size={80}/> */}
      {/* <ChatPanel /> */}
    </>

  )
}