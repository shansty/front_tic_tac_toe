import React from 'react';
import './PopUp.css';


const PopUp = ({ message }: { message: string }) => {

    return (
        <div className='popUp'>
            <div className='loading'>
                <img src="/loading.svg" alt="Loading Animation" className='popUp'/>
            </div>
            <div className='text'>
                <p>{message}</p>
            </div>
        </div>
    );
}

export default PopUp;
