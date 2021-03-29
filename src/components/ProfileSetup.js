import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { useState, useEffect } from 'react';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import { projectFirestore } from '../firebase';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import UploadForm from "./UploadForm"

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

export default function ProfileSetup() {
  const classes = useStyles();

  const [username, setUsername] = useState(null);
  const [usernameError, setUsernameError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date('2014-08-18T21:11:54'));
  const [profilePicUrl, setProfilePicUrl] = useState(null);

  const handleUsername = async (e) => {
    let username = e.target.value;
    console.log(username);
    // check if user name is unique, then do setUsername(username);
    // projectFirestore.collection('profiles').where('username', '==', username).get().then(snapshot => {
    //     if(snapshot.length==0){
    //         setUsernameError('');
    //         setUsername(username);
    //         console.log("Good Username");
    //     } else {
    //         setUsernameError('This username is already taken :(');
    //     }
    // });
    // projectFirestore.collection('profiles').get().then(snapshot => {
    //     console.log(snapshot);
        
    // });
    const profiles_ref = projectFirestore.collection('conversations');
    const data = await profiles_ref.get();
    console.log(data.docs);
  }

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleProfileCreation = (e) => {
    e.preventDefault();

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
          {/* <LockOutlinedIcon /> */}
          <AccountCircleRoundedIcon style={{width: "60px", height: "60px"}} />
        </Avatar>
        <Typography component="h1" variant="h5" style={{margin: "0 0 5px 0"}}>
          Create Your Profile
        </Typography>
        {/* <form className={classes.form} noValidate style={{
            maxWidth: "600px", 
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
            }}> */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            onChange={handleUsername}
            autoFocus
            style={{marginBottom: "0"}}
          />
          <label for="Username" className="username-label">(Others will use your Username to search for you)</label>
            <span style={{color: "red", fontSize: "10px"}}>{usernameError}</span>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Date of Birth"
                // value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
                />
            </MuiPickersUtilsProvider>

            {<img src={profilePicUrl ? profilePicUrl : "https://www.worldfuturecouncil.org/wp-content/uploads/2020/02/dummy-profile-pic-300x300-1.png"} 
            style={{
                border: '1px solid #f50057', 
                borderRadius: '50%', 
                boxShadow: '0 0 10px #222222',
                width: "150px",
                height: "150px",
                margin: "30px auto 30px auto"
            }} 
            /> }
            <UploadForm setProfilePicUrl={setProfilePicUrl} />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleProfileCreation}
            disabled={!username}
          >
            Let's Go!
          </Button>
          {/* <h1>{profilePicUrl && "We got the url:"+profilePicUrl}</h1> */}
        {/* </form> */}
      </div>
    </Container>
  );
}