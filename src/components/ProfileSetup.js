import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import { projectFirestore } from '../firebase';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import UploadForm from "./UploadForm";
import { useAuth } from "../contexts/AuthContext"
import { useHistory } from "react-router-dom"
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import pink from "@material-ui/core/colors/pink";
import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },

}));

const materialTheme = createMuiTheme({
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: pink.A200,
      },
    },
    MuiPickersCalendarHeader: {
      switchHeader: {
        // backgroundColor: pink.A200,
        // color: "white",
      },
    },
    MuiPickersDay: {
      day: {
        color: pink.A700,
      },
      daySelected: {
        backgroundColor: pink["400"],
      },
      dayDisabled: {
        color: pink["100"],
      },
      current: {
        color: pink["900"],
      },
    },
    MuiPickersModal: {
      dialogAction: {
        color: pink["400"],
      },
    },
  },
});

export default function ProfileSetup({ setUserProfile }) {
  const classes = useStyles();
  const { currentUser } = useAuth()
  const history = useHistory()

  const [username, setUsername] = useState(null);
  const [usernameError, setUsernameError] = useState('');
  const [isUsernameUnique, setIsUsernameUnique] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date('2014-08-18T21:11:54'));
  const [profilePicUrl, setProfilePicUrl] = useState("https://firebasestorage.googleapis.com/v0/b/test-firestore-bc69b.appspot.com/o/dummy-profile-pic.png?alt=media");
  const [profileCreationError, setProfileCreationError] = useState("");
  const [pictureID, setPictureID] = useState(uuidv4() + uuidv4());

  const handleUsername = async (e) => {
    let entered_username = e.target.value;
    setUsername(entered_username);

    // if empty username field
    if(entered_username.length == 0){

      setUsernameError('');
      setIsUsernameUnique(null);
      setisLoading(false);
      return
    };
    
    setisLoading(true);
    
    // checking if username is unique or not
    projectFirestore.collection("profiles").where("username", "==", entered_username).get()
    .then((querySnapshot) => {
      setisLoading(false);

      if(querySnapshot.docs.length == 0){
          // setUsername(username);
          setUsernameError('Good Username');
          setIsUsernameUnique(true);
      } else {
          setUsernameError('This username is already taken :(');
          setIsUsernameUnique(false);
      }

    })
    .catch((err)=>{
      setisLoading(false);
      console.log("Error while getting document");
    });
  }

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleProfileCreation = (e) => {
    e.preventDefault();
    let profileToSave = {
      username: username,
      userId: currentUser.uid,
      dateOfBirth: selectedDate,
      profilePicture: profilePicUrl,
      // profilePicture: pictureID,
      unreadNotf: 0,
      darkTheme: false
    };


    // check if profile with same id already exists
    projectFirestore.collection("profiles").where("userId", "==", currentUser.uid).get()
    .then(querySnapshot=>{
      if(querySnapshot.docs.length !== 0){
        setProfileCreationError("*Your Profile Already Exists.")
      }else{
        setProfileCreationError("")
        setisLoading(true);
        projectFirestore.collection("profiles").doc(currentUser.uid).set(profileToSave)
        projectFirestore.collection("contacts").doc(currentUser.uid).set({
          contacts: []
        })
        projectFirestore.collection("notifications").doc(currentUser.uid).set({
          notifications: [],
          pending: []
        })
        .then((docRef) => {
          setisLoading(false);
        //   console.log("THE PROFILE HAS BEEN SET")
        //   console.log(docRef);
        //   console.log(docRef.data());
        //   projectFirestore.collection("profiles").doc(docRef.id).get()
        //  .then(snap => {
        //     console.log("Got the profile that was just saved")
        //     console.log(snap);
        //     setUserProfile(snap.data());
        //  })
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
            setisLoading(false);
        });
      }
    })


  }

  return (
    <Container component="main" maxWidth="xs" style={{
        maxWidth: "600px", 
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        }}>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar} style={{width: "60px", height: "60px"}}>
          <AccountCircleRoundedIcon style={{width: "60px", height: "60px"}} />
        </Avatar>
        <Typography component="h1" variant="h5" style={{margin: "0 0 5px 0"}}>
          Create Your Profile
        </Typography>
          {profileCreationError && <h2 className="error-profile-creation">{profileCreationError}</h2>}
          <TextField
            margin="normal"
            color="secondary"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            onChange={handleUsername}
            autoFocus
            style={{marginBottom: "0"}}
          />
          <label htmlFor="Username" className="username-label">(Others will use your Username to search for you)</label>
          { isLoading ? <CircularProgress size={16} color="secondary"/> : <span className={isUsernameUnique ? "good-msg":"bad-msg"} >{usernameError}</span>}
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <ThemeProvider theme={materialTheme}>

                <KeyboardDatePicker
                // disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Date of Birth"
                color="secondary"
                // value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                />
              </ThemeProvider>
            </MuiPickersUtilsProvider>

            {<img alt="Profile Picture" src={profilePicUrl ? profilePicUrl : "https://firebasestorage.googleapis.com/v0/b/test-firestore-bc69b.appspot.com/o/dummy-profile-pic-300x300-1.png?alt=media&token=16776c42-a7dd-4d6c-a170-773d08b25df2"} 
            style={{
                border: '1px solid #f50057', 
                borderRadius: '50%', 
                boxShadow: '0 0 10px #222222',
                width: "150px",
                height: "150px",
                margin: "30px auto 30px auto"
            }} 
            /> }
            <UploadForm setProfilePicUrl={setProfilePicUrl} pictureID={pictureID} />
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.submit}
            onClick={handleProfileCreation}
            disabled={!isUsernameUnique && !isLoading}
          >
            Let's Go!
          </Button>
      </div>
    </Container>
  );
}