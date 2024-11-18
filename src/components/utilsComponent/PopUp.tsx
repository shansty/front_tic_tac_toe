import React from 'react';
import './PopUp.css';
import Button from './Button.tsx';

interface PopUpProps {
    imgSrc: string; // The image source URL
    text: string; // The main message text
    onClick: () => void; 
    buttonText: string;// Function for the close button
    secondButton?: {
      text: string; // Label for the second button
      onClick: () => void; // Function to call when the second button is clicked
    };
  }


  const PopUp: React.FC<PopUpProps> = ({
    imgSrc,
    text,
    onClick,
    buttonText, // Default value for the close button label
    secondButton,
  }) => {

    return (
        <div className='popUp'>
            <img src={imgSrc} alt="PopUp image"/>
            <p>{text}</p>
            <div className="buttonContainer">
            <Button className="button" onClick={onClick}>{buttonText}</Button>
            {secondButton && (
                <Button onClick={secondButton.onClick} className="secondButton">{secondButton.text}</Button>
            )}
            </div>
        </div>
        
    );
}

export default PopUp;
