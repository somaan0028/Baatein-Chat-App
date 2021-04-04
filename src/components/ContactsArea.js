import React, { useState, useEffect } from "react"
import SearchBar from './SearchBar';
import SingleContact from './SingleContact';
import { projectFirestore } from '../firebase';
import { CircularProgress } from '@material-ui/core';
import { useAuth } from "../contexts/AuthContext"

const ContactsArea = ({ activeContactID, setActiveContactID }) => {

    const { currentUser } = useAuth();
    const [contacts, setContacts] = useState([]);
    const [contactsList, setContactsList] = useState([]);
    const [backUpContactsList, setbackUpContactsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const generateConvoId = (id_1, id_2) => {
        if(id_1 > id_2){
            return id_1 + "-" + id_2;
        }else{
            return id_2 + "-" + id_1;
        }
    }

    useEffect(()=>{
        projectFirestore.collection("contacts").doc(currentUser.uid).get()
        .then((docRef)=>{
            // console.log(docRef.data());
            setContacts(docRef.data().contacts);
        })
    }, [])

    useEffect(()=>{
        let tempArray = [];
        contacts.forEach((contact)=>{
            projectFirestore.collection("profiles").doc(contact.userID).get()
            .then((docRef)=>{
            // console.log(docRef.data());

            if(!docRef.data()){
                console.log("Contact not found");

            }else{
                // console.log("User profile found");
                // let generatedId = generateConvoId(currentUser.uid, contactId);
                tempArray.push(<SingleContact 
                    key={contact.userID} 
                    id={contact.userID} 
                    contactName={docRef.data().username}
                    contactDetails={contact} 
                    activeContactID={activeContactID} 
                    setActiveContactID={setActiveContactID} 
                />);
            }
            if(tempArray.length == contacts.length){
                setContactsList(tempArray);
                setbackUpContactsList(tempArray);
                setIsLoading(false);
            }
            })
        })

    }, [contacts]);

    // to add a className to selected contact, we filter through the contactsList and replace the one selected with a new component.
    useEffect(()=>{
        console.log("activeContactID changed!!!!!");
        let newContactList = [];
        contactsList.forEach((contactComponent)=>{
            newContactList.push(<SingleContact 
                key={contactComponent.props.key} 
                id={contactComponent.props.id} 
                contactName={contactComponent.props.contactName}
                contactDetails={contactComponent.props.contactDetails} 
                activeContactID={activeContactID} 
                setActiveContactID={setActiveContactID} 
            />);
            // console.log(contactComponent);
        })
        setContactsList(newContactList);
        setbackUpContactsList(newContactList);
        
    }, [activeContactID])

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
