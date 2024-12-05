import React from 'react';
import './Notification.css';


interface NotificationProps {
    imgSrc: string;
    notificationText: string;
    firstOnClick: () => void;
    firstButtonText: string;
    secondButtonText: string;
    secondOnClick: () => void;
}


const Notification: React.FC<NotificationProps> = ({
    imgSrc,
    notificationText,
    firstOnClick,
    firstButtonText,
    secondButtonText,
    secondOnClick
}) => {

    return (
        <div className='notification'>
            <div className='notification_text_container'>
                <img src={imgSrc}/>
                <p>{notificationText}</p>
            </div>
            <div className='buttons'>
                <button className='button_agree' onClick={firstOnClick}>{firstButtonText}</button>
                <button className='button_decline' onClick={secondOnClick}>{secondButtonText}</button>
            </div>
        </div>
    );
}

export default Notification;
