import React from "react";
import SearchIcon from '@material-ui/icons/Search';

export default function searchBar({ setContactsList, backUpContactsList }) {

    const handleChange = (e)=>{
        let enteredText = e.target.value;
        let enteredTextLength = enteredText.length;
        let filteredArray = [];

        // filtereing the ones that match the entered text. Note that when the field is empty, the if statement will return true for all contacts
        backUpContactsList.forEach((contact)=>{
            let contactUsername = contact.props.contactName;
            if(contactUsername.substring(0, enteredTextLength).toLowerCase() == enteredText.toLowerCase()){
                filteredArray.push(contact);
            }
        });

        if(enteredText == ""){filteredArray = backUpContactsList}

        if(filteredArray.length == 0){
            setContactsList(
                <div className="no-contacts-match-search">
                    <p className="no-contacts-text">No Contacts match<br/>your search</p>
                </div>
            )
        }else{
            setContactsList(filteredArray);
        }

    }

    return(
        <div className="chat-search-container">
            <SearchIcon className="search-icon" />
            <input onChange={handleChange} type="text" className="chat-search-bar" id="bar-for-searching-contacts" placeholder="Search your contacts..." />
        </div>
    )
}      