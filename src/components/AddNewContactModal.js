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
//   const [open, setOpen] = React.useState(false);
    const [fieldText, setFieldText] = useState("");
    const [isLoadingSearchResults, setIsLoadingSearchResults] = useState(false);
    const [searchResults, setSearchResults] = useState(null);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e)=>{

    e.preventDefault();
    let enteredText = e.target.querySelector(".chat-search-bar").value;
    if(!enteredText){return};
    setIsLoadingSearchResults(true);
    setFieldText(enteredText);
    console.log(enteredText);
  }

  useEffect(()=>{
    if(!fieldText){return};

    // query db. set loading to false. set searchResults. set fieldText to 
    console.log("Searching for: " + fieldText);
    projectFirestore.collection("profiles").where("username", "==", fieldText).get()
    .then((querySnapshot)=>{
        let docs = querySnapshot.docs;
        console.log(docs.length);
        if(docs.length == 0){
            setSearchResults(false);
        }else{
            setSearchResults(docs[0].data())
        }
        console.log(querySnapshot.docs[0].data());
        setIsLoadingSearchResults(false);
    })
    .catch((err)=>{
        setSearchResults(null);
        setIsLoadingSearchResults(false);
    })
  }, [fieldText])

  const handleRequest = ()=>{
    console.log("Send request to " + searchResults.username + " : " + searchResults.userId);
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
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Add New Friends!</h2>
            <p id="transition-modal-description">Just type their username to find them.</p>
           
            <div className="newContact-search-container">
                <form onSubmit={handleSubmit} className="search-area">
                    <SearchIcon className="search-icon" />
                    <input type="text" className="chat-search-bar" placeholder="Search your contacts..." />
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
                        <Button className="send-request-btn" variant="contained" color="secondary" onClick={handleRequest}>Send Request</Button>
                    </div>
                </div>
                }
                {fieldText && !isLoadingSearchResults && !searchResults &&
                <div className="search-results-container">
                    <p>Nobody has this username!</p>
                </div>
                }
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}