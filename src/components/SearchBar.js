import React, { useState, useEffect } from "react";
import SearchIcon from '@material-ui/icons/Search';
import "./searchBar.css";

export default function searchBar() {

    return(
        <div className="chat-search-container">
            <SearchIcon className="search-icon" />
            <input type="text" className="chat-search-bar" placeholder="Search your contacts..." />
        </div>
    )
}      