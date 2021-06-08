import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import { CircularProgress } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import { projectFirestore, increment } from '../firebase';
import { useAuth } from "../contexts/AuthContext"

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function AddNewContactModal({ open, setOpen, userProfile }) {
  const classes = useStyles();

  const { currentUser } = useAuth();
  const [fieldText, setFieldText] = useState("");
  const [isLoadingSearchResults, setIsLoadingSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [pendingRequests, setPendingRequests ] = useState([]);
  const [isPending, setisPending] = useState(false);
  const [contactAlreadyExists, setContactAlreadyExists] = useState(false);
  const [isOwnUsername, setIsOwnUsername] = useState(false);
  const [pendingContactsDisplay, setPendingContactsDisplay] = useState([]);

  const handleClose = () => {
    setOpen(false);
  };

  
  useEffect(()=>{
    projectFirestore.collection("notifications").doc(currentUser.uid).onSnapshot(docRef=>{
      let receivedData = docRef.data();
      var pendingArray = receivedData.pending;

      setPendingRequests(pendingArray);
      let pendingToDisplay = [];
      if(pendingArray){

        pendingArray.forEach(pendingID => {
          projectFirestore.collection("profiles").where("userId", "==", pendingID).get()
          .then(querySnapshot=>{
            let retrievedDocs = querySnapshot.docs;
            let docDetails =  retrievedDocs[0].data();

            pendingToDisplay.push(
              <div className="single-req-pending" key={Math.floor((Math.random() * 10000000) + 1).toString()}>
                <img className="contact-profile-pic" alt="Profile" src={docDetails.profilePicture} />
                <p>{docDetails.username}</p>
              </div>
            )

            if(pendingToDisplay.length >= pendingArray.length){

              setPendingContactsDisplay(pendingToDisplay);
            }
          })
          .catch(err=>{
            console.log(err);
          })
        });
      }
    });

  }, [])


  // query db and show the person with the entered username if exists
  const handleSubmit = (e)=>{

    e.preventDefault();
    let enteredText = e.target.querySelector(".chat-search-bar").value;
    if(!enteredText){return};
    setIsLoadingSearchResults(true);
    setisPending(false);
    setFieldText(enteredText);

    
    if(!enteredText){return};



    // query db. set loading to false. set searchResults. set fieldText to 
    projectFirestore.collection("profiles").where("username", "==", enteredText).get()
    .then((querySnapshot)=>{
        let docs = querySnapshot.docs;

        if(docs.length == 0){
            setIsOwnUsername(false)
            setSearchResults(false);
        }else{
            let userData = docs[0].data();

            if(userProfile.username == userData.username){

              setIsOwnUsername(true)
              setContactAlreadyExists(false)
              setisPending(false);
              setSearchResults(null)
            }else{
              setIsOwnUsername(false)

              // checking if user already in contacts
              projectFirestore.collection("contacts").doc(currentUser.uid).get()
              .then((docRef)=>{
                let own_contacts = docRef.data().contacts
                setContactAlreadyExists(false)
                own_contacts.forEach(contact =>{
                  if(contact.userID == userData.userId){
                    setContactAlreadyExists(true)
                  }
                })
              })
  
              if(pendingRequests.includes(userData.userId)){
                setisPending(true);
              }else{
                setisPending(false);
              }
              setSearchResults(docs[0].data())
            }
        }

        setIsLoadingSearchResults(false);
    })
    .catch((err)=>{
        setSearchResults(null);
        setIsLoadingSearchResults(false);
    })
  }

  // does 3 things: 
  // 1. adds a new notification for the one to whom the request is sent to
  // 2. increaments unreadNotf of the person who received the request
  // 3. add a contact id (of the one to whom request is sent to) to the pending list of the sender
  const handleRequest = ()=>{

    setisPending(true);

    // add a new notification for the one to whom request is sent
    projectFirestore.collection("notifications").doc(searchResults.userId).get()
    .then((docRef)=>{

      var oldNotifications = docRef.data().notifications;

      let newRequest = {
        "userID": currentUser.uid,
        "type": "add_request"
      }
      projectFirestore.collection("notifications").doc(searchResults.userId).set({
        notifications: [...oldNotifications, newRequest],
        pending: docRef.data().pending
      })
    })
    .catch(err=>{
      console.log(err);
    })

    // increaments unreadNotf (no of unread notifications) of the person who received the request
    projectFirestore.collection("profiles").doc(searchResults.userId).update({
      unreadNotf: increment
    })

    // add the id of the person, to whom request is sent, to "pending" of current user
    projectFirestore.collection("notifications").doc(currentUser.uid).get()
    .then((docRef)=>{

      var oldPending = docRef.data().pending;

      
      projectFirestore.collection("notifications").doc(currentUser.uid).set({
        notifications: docRef.data().notifications,
        pending: [...oldPending, searchResults.userId],
      })
    })
    .catch(err=>{
      console.log(err);
    })
  }

  return (
    <div className="add-new-contact-modal">

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        className="add_new_contact_popup"
      >
        <Fade in={open}>
          <div className={classes.paper + " modal-container"} >
            <h2 id="transition-modal-title">Add New Friends!</h2>
            <p id="transition-modal-description">Type their EXACT username to find them.</p>
           
            <div className="newContact-search-container">
                <form onSubmit={handleSubmit} className="search-area">
                    <SearchIcon className="search-icon" />
                    <input type="text" className="chat-search-bar" placeholder="Enter username..." />
                    <IconButton type="submit" id="search-user-btn" aria-label="Search for User" color="inherit">
                        <SendIcon className="submit-icon" />
                    </IconButton>
                </form>
                
                {fieldText && isLoadingSearchResults &&
                <div className="search-results-container">
                    <CircularProgress size={40} />
                </div> }
                {fieldText && !isLoadingSearchResults && searchResults &&
                <div className="search-results-container">
                    <div className="single-search-result">
                        <div className="pic-name">
                            <img className="contact-profile-pic" alt="Profile Picture" src={searchResults.profilePicture} />
                            <p>{searchResults.username}</p>
                        </div>
                        {contactAlreadyExists ? 
                          <Button disabled={true} className="send-request-btn" variant="contained" color="secondary" onClick={handleRequest}>Already Added</Button>
                        :
                          <Button disabled={isPending} className="send-request-btn" variant="contained" color="secondary" onClick={handleRequest}>{isPending ? "Request Pending" : "Send Request"}</Button>
                        }

                    </div>
                </div>
                }
                {fieldText && !isLoadingSearchResults && !searchResults &&
                <div className="search-results-container">
                  {isOwnUsername ? 
                    <p id="no-username">This is your own Username!!!</p>
                    :
                    <p id="no-username">Nobody has this username!</p>
                  }
                </div>
                }
            </div>

            <div className="pending-requests-container scroll-section">
                <h3>Pending Requests</h3>
                <div className="pending-requests-list">
                  {pendingContactsDisplay.length !== 0 ? 
                  <>
                  <p className="small-msg">Wait for them to accept :)</p>
                  {pendingContactsDisplay}
                  </>
                  : 
                    <p className="small-msg">No pending requests at the moment.</p>
                  }

                </div>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}