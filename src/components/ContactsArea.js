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


    useEffect(()=>{
        // everytime the document in "contacts" changes, they are loaded again, ordered and set to the state named contactsFromDB
        projectFirestore.collection("contacts").doc(currentUser.uid).onSnapshot((docRef)=>{

            let receivedContacts = docRef.data().contacts;
            console.log("something changed in contacts collection");

            // ordering w.r.t to latest message
            receivedContacts.sort((a, b) => b.latestTimestamp - a.latestTimestamp);
            console.log("setting contactsFromDB");
            setContactsFromDB(receivedContacts);

        })
    }, [])

    // this function replaces the unread value of the data associated with the activeContact
    const resetUnreadAmount = (modifiedContact) => {
        var newContacts = [];
        console.log("modified contact");
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

    // runs when the state contactsFromDB changes
    useEffect(()=>{
        console.log("contacts changed");
        let tempArray = [];
        contactsFromDB.forEach((contact)=>{
            projectFirestore.collection("profiles").doc(contact.userID).get()
            .then((docRef)=>{

                if(!docRef.data()){
                    console.log("Contact not found");

                }else{

                    var modifiedContact = null;
                    // if unread messages are not equal to zero, then we replace it with zero temporarily and send it into
                    // the SingleContact components. Then we also call the function resetUnreadAmount() to replace it in the db as well. 
                    if(activeContact && contact.userID == activeContact.userID && contact.unread != 0){
                        modifiedContact = {
                            userID: contact.userID,
                            latestTimestamp: contact.latestTimestamp,
                            unread: 0, 
                        }
                        resetUnreadAmount(modifiedContact);
                    }else{
                        modifiedContact = contact;
                    }
                    tempArray.push(<SingleContact 
                        key={contact.userID} 
                        id={contact.userID} 
                        contactName={docRef.data().username}
                        contactDetails={modifiedContact} 
                        activeContact={activeContact} 
                        setActiveContact={setActiveContact} 
                    />);
                }
                if(tempArray.length == contactsFromDB.length){
                    setContactsList(tempArray);
                    setbackUpContactsList(tempArray);
                    setIsLoading(false);
                }
            })
        })

    }, [contactsFromDB]);

    // to add a className to selected contact, we filter through the contactsList and replace the one selected with a new component.
    useEffect(()=>{
        if(!activeContact){return};
        console.log("activeContact changed!!!!!");

        let updatedUnreadContactList = [];
        
        contactsFromDB.forEach((contact)=>{
            if(contact.userID == activeContact.userID){
                updatedUnreadContactList.push({
                    latestTimestamp: contact.latestTimestamp,
                    unread: 0,
                    userID: contact.userID
                })
            }else{
                updatedUnreadContactList.push(contact);
            }
        })
        console.log("Here is the updated contacts with unread set to 0");
        console.log(updatedUnreadContactList);
        projectFirestore.collection("contacts").doc(currentUser.uid).set({
            contacts: updatedUnreadContactList
        })

        let newContactList = [];
        contactsList.forEach((contactComponent)=>{
            newContactList.push(<SingleContact 
                key={contactComponent.props.key} 
                id={contactComponent.props.id} 
                contactName={contactComponent.props.contactName}
                contactDetails={contactComponent.props.contactDetails} 
                activeContact={activeContact} 
                setActiveContact={setActiveContact} 
            />);
            // console.log(contactComponent);
        })
        setContactsList(newContactList);
        setbackUpContactsList(newContactList);
        
    }, [activeContact])

    return (
        <div className="contacts-area">
            <h3 className="chats-heading">Chats</h3>

            <SearchBar setContactsList={setContactsList} backUpContactsList={backUpContactsList} />
            <div className="contacts-list scroll-section">

                {isLoading ? <CircularProgress className="contacts-loading-sign" size={30}/> : contactsList}                
            
            </div>
        </div>
    )
}

export default ContactsArea;
