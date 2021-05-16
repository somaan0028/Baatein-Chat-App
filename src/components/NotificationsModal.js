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

export default function AddNewContactModal({ open, setOpen }) {
    const classes = useStyles();

    const { currentUser } = useAuth();
    const [fieldText, setFieldText] = useState("");
    const [isLoadingSearchResults, setIsLoadingSearchResults] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [notificationsRequests, setNotificationsRequests ] = useState([]);
    const [isPending, setisPending] = useState(false);
    const [pendingContactsDisplay, setPendingContactsDisplay] = useState([]);

  const handleClose = () => {
    setOpen(false);
  };


  // handleAccept function does 6 things
  // 1.  Removes notification from receiver's db
  // 2.  Remove id from pending list of sender
  // 3.  Add notification in sender's db about successful request acceptence
  // 4.  Increments the unreadNotf of the sender by 1
  // 5.  Adds the contact id of sender's to the acceptor's db
  // 6.  Adds the contact id of acceptor to the sender's db
  const handleAccept = (e) => {
    let idToAccept = e.target.id;
    console.log(e.target);
    console.log("Accept req from: " + idToAccept);

    // to close the notifications panel
    handleClose();

    // removing notification from own db
    projectFirestore.collection("notifications").doc(currentUser.uid).get()
    .then(docRef=>{
      let newNotificationsArray = [];
      let old_notications_from_own_db = docRef.data().notifications;
      old_notications_from_own_db.forEach((notification)=>{
        if (notification.userID !== idToAccept || notification.type !== "add_request") {
          newNotificationsArray.push(notification);
        }
      });
      setNotificationsRequests(newNotificationsArray);
      console.log("removing notification from own db");
      projectFirestore.collection("notifications").doc(currentUser.uid).update({
        notifications: newNotificationsArray
      })

    })

    // removing pending from other persons db and adding request accepted notification for them.
    projectFirestore.collection("notifications").doc(idToAccept).get()
    .then((docRef)=>{
      let oldPending = docRef.data().pending;
      let oldNotifications = docRef.data().notifications;
      let newPending = [];
      oldPending.forEach((pendingID)=>{
        if (pendingID !== currentUser.uid) {
          newPending.push(pendingID);
        }
      });
      console.log("Removing pending from other persons db");
      projectFirestore.collection("notifications").doc(idToAccept).update({
        pending: newPending,
        notifications: [...oldNotifications, {type: "req_accepted", userID: currentUser.uid}]
      })
    })
    .catch((err)=>{
      console.log(err);
    })

    // increaments unreadNotf (no of unread notifications) of the person who sent the request
    projectFirestore.collection("profiles").doc(idToAccept).update({
      unreadNotf: increment
    })

    // adding the contact id of person who sent the request into the account of acceptor
    console.log("About to add new contact")
    projectFirestore.collection("contacts").doc(currentUser.uid).get()
    .then(docRef=>{
      let theContacts = [];
      let newContactToAdd = {
        latestTimestamp: 0,
        unread: 0,
        userID: idToAccept,
        latestMsg: ""
      };

      if(!docRef.data().contacts){
        theContacts.push(newContactToAdd);
      }else{
        theContacts = docRef.data().contacts;
        theContacts.push(newContactToAdd);
        console.log("New contact list: ");
        console.log(theContacts);
      }

      projectFirestore.collection("contacts").doc(currentUser.uid).update({
        contacts: theContacts,
      })
    })
    .catch(err=>{
      console.log(err);
    })

    // adding the contact id of request receiver to the request senders account
    projectFirestore.collection("contacts").doc(idToAccept).get()
    .then(docRef=>{
      let theContacts = [];
      let newContactToAdd = {
        latestTimestamp: 111111111,
        unread: 0,
        userID: currentUser.uid
      };

      if(!docRef.data().contacts){
        theContacts.push(newContactToAdd);
      }else{
        theContacts = docRef.data().contacts;
        theContacts.push(newContactToAdd);
        console.log("New contact list: ");
        console.log(theContacts);
      }

      projectFirestore.collection("contacts").doc(idToAccept).update({
        contacts: theContacts,
      })
    })
    .catch(err=>{
      console.log(err);
    })
  }

  // this does the same things as the handleAccept except adding contact id's into each others dbs.
  // It also add "req_declined" notification instead of "req_accepted" in the senders db
  const handleDecline = (e) => {
    let idToAccept = e.target.id;
    console.log("Decline req from: " + idToAccept);

    // to close the notifications panel
    handleClose();

    // removing notification from own db
    let newNotificationsArray = [];
    console.log("Looping through notificationsRequests to filter notifications:");
    console.log(notificationsRequests);
    projectFirestore.collection("notifications").doc(currentUser.uid).get()
    .then(docRef=>{
      // getting own notifications and then filtering
      let notifications_from_own_db = docRef.data().notifications
      notifications_from_own_db.forEach((notification)=>{
        if (notification.userID !== idToAccept || notification.type !== "add_request") {
          newNotificationsArray.push(notification);
        }else{
          console.log("REMOVING:");
          console.log(notification);
        }
      });
      setNotificationsRequests(newNotificationsArray);
      console.log("Declined request. Removing notification from own db");
      projectFirestore.collection("notifications").doc(currentUser.uid).update({
        notifications: newNotificationsArray
      });
    })


    // removing pending from other persons db and adding "request declined" notification for them.
    projectFirestore.collection("notifications").doc(idToAccept).get()
    .then((docRef)=>{
      let oldPending = docRef.data().pending;
      let oldNotifications = docRef.data().notifications;
      let newPending = [];
      oldPending.forEach((pendingID)=>{
        if (pendingID !== currentUser.uid) {
          newPending.push(pendingID);
        }
      });
      console.log("Removing pending from other persons db");
      projectFirestore.collection("notifications").doc(idToAccept).update({
        pending: newPending,
        notifications: [...oldNotifications, {type: "req_declined", userID: currentUser.uid}]
      })
    })
    .catch((err)=>{
      console.log(err);
    })


    // increaments unreadNotf (no of unread notifications) of the person who sent the request
    projectFirestore.collection("profiles").doc(idToAccept).update({
      unreadNotf: increment
    })
  }

  useEffect(()=>{
  projectFirestore.collection("notifications").doc(currentUser.uid).onSnapshot(docRef=>{
    console.log("Fetching notifications");
    let receivedData = docRef.data();
    var notificationsArray = receivedData.notifications;
    console.log(notificationsArray);
    if(notificationsArray){
      notificationsArray.reverse();
    }
    setNotificationsRequests(notificationsArray);
    let notificationsToDisplay = [];
    if(notificationsArray){
      notificationsArray.forEach(notification => {
        projectFirestore.collection("profiles").where("userId", "==", notification.userID).get()
        .then(querySnapshot=>{
          let retrievedDocs = querySnapshot.docs;
          console.log(notification.userID);
          let docDetails =  retrievedDocs[0].data();
          console.log(docDetails);
          switch (notification.type) {
            case "add_request":
            console.log("new req notification");
              notificationsToDisplay.push(
                <div className="single-friend-req new_request">
                
                <div className="user-info">
                  <img className="contact-profile-pic" alt="Profile Picture" src={docDetails.profilePicture} />
                  <p><strong>{docDetails.username}</strong> sent you a friend request</p>              
                </div>
  
                <div className="acc-dec-btns">
                  <button id={docDetails.userId} className="accept-button buttons" onClick={handleAccept}>Accept</button>
                  <button id={docDetails.userId} className="decline-button buttons" onClick={handleDecline}>Decline</button>
                </div>
  
              </div>
              )
              break;
            case "req_accepted":
            notificationsToDisplay.push(
  
                <div className="single-friend-req req-accepted">
                  <img className="contact-profile-pic" alt="Profile Picture" src={docDetails.profilePicture} />
                  <p><strong>{docDetails.username}</strong> accepted your request!!!</p>
                </div>
            )
              break;
            case "req_declined":
              notificationsToDisplay.push(
                <div className="single-friend-req req-declined">
                  <img className="contact-profile-pic" alt="Profile Picture" src={docDetails.profilePicture} />
                  <p><strong>{docDetails.username}</strong> declined your request :(</p>
                </div>
              )
              break;
          
            default:
              break;
          }
  
          // console.log(notificationsToDisplay.length, )
          if(notificationsToDisplay.length >= notificationsArray.length){
            console.log("reached here");
            setPendingContactsDisplay(notificationsToDisplay);
          }
        })
        .catch(err=>{
          console.log(err);
        })
      });

    }
  });

}, [])


  

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
      >
        <Fade in={open}>
          <div className={classes.paper + " modal-container"} >
            <h2 id="transition-modal-title">Notifications</h2>
           
            <div className="newContact-search-container">

              <div className="pending-requests-container notifications-container scroll-section">
                  <div className="notifications-list">
                    {pendingContactsDisplay.length !== 0 ? 
                    <>
                    {/* <p className="small-msg">You have friend requests!!</p> */}
                    {pendingContactsDisplay}
                    </>
                    : 
                      <p className="small-msg">No notifications :(</p>
                    }

                  </div>
              </div>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}