import React, { useState } from 'react';
import Notitications from './Notitications.tsx';
import UserGamesData from './UserGamesData.tsx';
import "./Header.css"

const Header:React.FC = () => {

    const [visibleList, setVisibleList] = useState("");

    const toggleList = (listName: string) => {

        if (visibleList === listName) {
            setVisibleList("");
        } else {
            setVisibleList(listName);
        }
    };


    return (
        <>
        <div className='header'>
            <div className='header_buttons'>
                <p className='header_info' onClick={() => toggleList("notifications")}>
                    Notifications
                </p>
                <p className='header_info' onClick={() => toggleList("allGames")}>
                    Your challenges hisory
                </p>
            </div>
            {/* {visibleList === "notifications" && (
                <div className='dpopdown_container'>
                    <Notitications />
                </div>
            )}
            {visibleList === "allGames" && (
                <div className="dpopdown_container">
                    <UserGamesData/>
                </div>
            )} */}
        </div>
        {visibleList === "notifications" && (
            <div className='dpopdown_container'>
                <Notitications />
            </div>
        )}
        {visibleList === "allGames" && (
            <div className="dpopdown_container">
                <UserGamesData/>
            </div>
        )}
        </>
    );
}

export default Header;
