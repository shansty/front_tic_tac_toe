import React, { useEffect, useState } from 'react';
import { TypeNotification } from '../../types.ts';
import { getNotifications, declineNotifications, acceptNotifications } from '../../axios.ts';
import { getToken, checkTokenExparation, getIDFromToken } from '../../utils.ts';
import "./Notifications.css";

const Notitications:React.FC  = () => {

    const [notifications, setNotifications] = useState<TypeNotification[]>([]);

    const token = getToken() as string;
    const user_id = getIDFromToken(token);

    useEffect(() => {
            checkTokenExparation(token)
        }, [token])

    useEffect(() => {
        getNotifications(user_id as number, token, setNotifications)
        console.dir({ notifications })
    }, [])

    const handleAccept = (rival_username:string) => {
        acceptNotifications(user_id as number, rival_username, token)
        getNotifications(user_id as number, token, setNotifications)
    }

    const handleDecline = (rival_username:string) => {
        declineNotifications(user_id as number, rival_username, token)
        getNotifications(user_id as number, token, setNotifications)
    }

    return (
        <div className='data_container'>
            {notifications.map((notification, index) => (
                <div className="data" key={index}>
                    <p >
                        {notification.text}
                    </p>
                    <div className='notifications_btn'>
                        <button onClick={() => handleAccept(notification.rival_username)}>accept</button>
                        <button onClick={() => handleDecline(notification.rival_username)}>decline</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Notitications;
