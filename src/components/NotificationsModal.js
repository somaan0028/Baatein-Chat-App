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
import { projectFirestore } from '../firebase';
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
    const [pendingRequests, setPendingRequests ] = useState([]);
    const [isPending, setisPending] = useState(false);
    const [pendingContactsDisplay, setPendingContactsDisplay] = useState([]);

  const handleClose = () => {
    setOpen(false);
  };

  
  useEffect(()=>{
    projectFirestore.collection("notifications").doc(currentUser.uid).onSnapshot(docRef=>{
      let receivedData = docRef.data();
      var pendingArray = receivedData.pending;
      console.log(pendingArray);
      setPendingRequests(pendingArray);
      let pendingToDisplay = [];
      pendingArray.forEach(pendingID => {
        projectFirestore.collection("profiles").where("userId", "==", pendingID).get()
        .then(querySnapshot=>{
          let retrievedDocs = querySnapshot.docs;
          let docDetails =  retrievedDocs[0].data();
          console.log(docDetails);
          pendingToDisplay.push(
            <div className="single-req-pending">
              <img className="contact-profile-pic" alt="Profile Picture" src="https://www.worldfuturecouncil.org/wp-content/uploads/2020/02/dummy-profile-pic-300x300-1.png" />
              <p>{docDetails.username}</p>
            </div>
          )
          // console.log(pendingToDisplay.length, )
          if(pendingToDisplay.length >= pendingArray.length){
            console.log("reached here");
            setPendingContactsDisplay(pendingToDisplay);
          }
        })
        .catch(err=>{
          console.log(err);
        })
      });
    });

  }, [])


  const handleSubmit = (e)=>{

    e.preventDefault();
    let enteredText = e.target.querySelector(".chat-search-bar").value;
    if(!enteredText){return};
    setIsLoadingSearchResults(true);
    setisPending(false);
    setFieldText(enteredText);
    console.log(enteredText);

    if(!enteredText){return};



    // query db. set loading to false. set searchResults. set fieldText to 
    console.log("Searching for: " + enteredText);
    projectFirestore.collection("profiles").where("username", "==", enteredText).get()
    .then((querySnapshot)=>{
        let docs = querySnapshot.docs;
        console.log(docs.length);
        if(docs.length == 0){
            setSearchResults(false);
        }else{
            let userData = docs[0].data();
            if(pendingRequests.includes(userData.userId)){
              setisPending(true);
            }else{
              setisPending(false);
            }
            setSearchResults(docs[0].data())
        }
        console.log(querySnapshot.docs[0].data());
        setIsLoadingSearchResults(false);
    })
    .catch((err)=>{
        setSearchResults(null);
        setIsLoadingSearchResults(false);
    })
  }


  const handleRequest = ()=>{
    console.log("Send request to " + searchResults.username + " : " + searchResults.userId);
    setisPending(true);
    // add a new notification for the one to whom request is sent
    projectFirestore.collection("notifications").doc(searchResults.userId).get()
    .then((docRef)=>{
      // var receivedData = docRef.data();
      var oldNotifications = docRef.data().notifications;
      console.log(oldNotifications);
      let newRequest = {
        "userID": currentUser.uid,
        "type": "add_request"
      }
      projectFirestore.collection("notifications").doc(searchResults.userId).set({
        notifications: [...oldNotifications, newRequest],
      })
    })
    .catch(err=>{
      console.log(err);
    })

    // add the id of the person, to whom request is sent, to "pending" of current user
    projectFirestore.collection("notifications").doc(currentUser.uid).get()
    .then((docRef)=>{
      // let receivedData = docRef.data();
      var oldPending = docRef.data().pending;
      console.log(oldPending);

      projectFirestore.collection("notifications").doc(currentUser.uid).set({
        pending: [...oldPending, searchResults.userId],
      })
    })
    .catch(err=>{
      console.log(err);
    })
  }

  return (
    <div className="add-new-contact-modal">
      {/* <button type="button" onClick={handleOpen}>
        react-transition-group
      </button> */}
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
            <p id="transition-modal-description">description</p>
           
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
                            <img className="contact-profile-pic" alt="Profile Picture" src="https://www.worldfuturecouncil.org/wp-content/uploads/2020/02/dummy-profile-pic-300x300-1.png" />
                            <p>{searchResults.username}</p>
                        </div>
                        <Button disabled={isPending} className="send-request-btn" variant="contained" color="secondary" onClick={handleRequest}>{isPending ? "Request Pending" : "Send Request"}</Button>
                    </div>
                </div>
                }
                {fieldText && !isLoadingSearchResults && !searchResults &&
                <div className="search-results-container">
                    <p id="no-username">Nobody has this username!</p>
                </div>
                }
            </div>

            <div className="pending-requests-container">
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
                  {/* <div className="single-req-pending">
                    <img className="contact-profile-pic" alt="Profile Picture" src="https://www.worldfuturecouncil.org/wp-content/uploads/2020/02/dummy-profile-pic-300x300-1.png" />
                    <p>Dummy Name</p>
                  </div> */}
                </div>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}