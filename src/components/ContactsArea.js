import React, { useState, useEffect } from "react"
import SearchBar from './SearchBar';
import SingleContact from './SingleContact';
import { projectFirestore } from '../firebase';
import { CircularProgress } from '@material-ui/core';
import { useAuth } from "../contexts/AuthContext"

const ContactsArea = ({ activeContact, setActiveContact }) => {

    const { currentUser } = useAuth();
    const [contactsFromDB, setContactsFromDB] = useState([]);
    const [contactsList, setContactsList] = useState([]);
    const [backUpContactsList, setbackUpContactsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [noContacts, setNoContacts] = useState(false)
    const [initialContactsDisplayed, setInitialContactsDisplayed] = useState(false);

    useEffect(()=>{
        // everytime the document in "contacts" changes, they are loaded again, ordered and set to the state named contactsFromDB
        projectFirestore.collection("contacts").doc(currentUser.uid).onSnapshot((docRef)=>{

            let receivedContacts = docRef.data().contacts;

            // ordering w.r.t to latest message
            receivedContacts.sort((a, b) => b.latestTimestamp - a.latestTimestamp);

            if(receivedContacts.length == 0){

                setContactsList([]);
                setbackUpContactsList([]);
                setIsLoading(false);
                setNoContacts(true);
            }else{
                setNoContacts(false)
            }

            setContactsFromDB(receivedContacts);

        })
    }, [])

    // this function replaces the unread value of the data associated with the activeContact
    const resetUnreadAmount = (modifiedContact) => {
        var newContacts = [];

        contactsFromDB.forEach((contact)=>{
            if(contact.userID == activeContact.userID){
                newContacts.push(modifiedContact);
            }else{
                newContacts.push(contact);
            }
        });
        projectFirestore.collection("contacts").doc(currentUser.uid).set({
            contacts: newContacts
        });
    }

    const convert24HourTo12Hour = (hrEle, minEle)=>{
        if(hrEle>=0 && hrEle<=24 && minEle >=0 && minEle <= 60){
            let AMorPM='AM';
            if(hrEle>=12)AMorPM='PM';
            if(hrEle!==12){
                hrEle = (hrEle % 12);
            }
            if(minEle < 10){minEle = "0" + minEle}
            return hrEle+':'+minEle+' '+AMorPM;
        }
    }



    // runs when the state contactsFromDB changes
    useEffect(()=>{

        let tempArray = [];
        contactsFromDB.forEach((contact)=>{

            projectFirestore.collection("profiles").doc(contact.userID).get()
            .then((docRef)=>{

                if(!docRef.data()){
                    // console.log("Contact not found");

                }else{

                    var modifiedContact = null;
                    let profilePicture = docRef.data().profilePicture
                    // if unread messages are not equal to zero, then we replace it with zero temporarily and send it into
                    // the SingleContact components. Then we also call the function resetUnreadAmount() to replace it in the db as well. 
                    let date = new Date(contact.latestTimestamp.seconds*1000);
                    let latestTime = convert24HourTo12Hour(date.getHours(), date.getMinutes());

                    if(activeContact && contact.userID == activeContact.userID && contact.unread != 0){
                        modifiedContact = {
                            userID: contact.userID,
                            latestTimestamp: contact.latestTimestamp,
                            unread: 0, 
                            latestMsg: contact.latestMsg,
                        }
                        resetUnreadAmount(modifiedContact);
                    }else{
                        modifiedContact = contact;
                        modifiedContact = {
                            latestTimestamp: contact.latestTimestamp,
                            unread: contact.unread,
                            userID: contact.userID,
                            latestMsg: contact.latestMsg,
                        };
                    }

                    let timeToDisplay = latestTime;
                    let latestMsgDate = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
                    let todaysDate = new Date();
                    todaysDate = todaysDate.getDate()+"/"+todaysDate.getMonth()+"/"+todaysDate.getFullYear()
                    if(latestMsgDate !== todaysDate){timeToDisplay = latestMsgDate}
                    if(contact.latestTimestamp == 0){timeToDisplay = null}
                    tempArray.push(<SingleContact 
                        key={contact.userID} 
                        id={contact.userID} 
                        contactName={docRef.data().username}
                        contactDetails={modifiedContact} 
                        activeContact={activeContact} 
                        setActiveContact={setActiveContact}
                        profilePicture={profilePicture}
                        timeToDisplay={timeToDisplay}
                    />);
                }
                if(tempArray.length == contactsFromDB.length){
                    setContactsList(tempArray);
                    setbackUpContactsList(tempArray);
                    setIsLoading(false);
                }
            })
        })
        // }

    }, [contactsFromDB]);

    // to add a className to selected contact, we filter through the contactsList and replace the one selected with a new component.
    useEffect(()=>{
        if(!activeContact && !initialContactsDisplayed){
            setInitialContactsDisplayed(true);
            return
        };

        document.querySelector("#bar-for-searching-contacts").value = "";     // clearing search bar


        let updatedUnreadContactList = [];
        
        contactsFromDB.forEach((contact)=>{
            if(activeContact && contact.userID == activeContact.userID){
                updatedUnreadContactList.push({
                    latestTimestamp: contact.latestTimestamp,
                    unread: 0,
                    userID: contact.userID,
                    latestMsg: contact.latestMsg
                })
            }else{
                updatedUnreadContactList.push(contact);
            }
        })

        projectFirestore.collection("contacts").doc(currentUser.uid).set({
            contacts: updatedUnreadContactList
        })

        let newContactList = [];
        backUpContactsList.forEach((contactComponent)=>{
            newContactList.push(<SingleContact 
                key={contactComponent.props.id} 
                id={contactComponent.props.id} 
                contactName={contactComponent.props.contactName}
                contactDetails={contactComponent.props.contactDetails} 
                activeContact={activeContact} 
                setActiveContact={setActiveContact} 
                profilePicture={contactComponent.props.profilePicture}
                timeToDisplay={contactComponent.props.timeToDisplay}
            />);
        })
        setContactsList(newContactList);
        setbackUpContactsList(newContactList);
        
    }, [activeContact])

    return (
        <div className="contacts-area">
            <h3 className="chats-heading">Chats</h3>

            <SearchBar setContactsList={setContactsList} backUpContactsList={backUpContactsList} />
            <div className="contacts-list scroll-section">

                {isLoading && <CircularProgress className="contacts-loading-sign" size={30}/> }
                {noContacts && <div className="no-contacts-match-search">
                    <p className="no-contacts-text">Add new Contacts!</p>
                </div>}
                {!isLoading && !noContacts && contactsList}

            </div>
        </div>
    )
}

export default ContactsArea;
