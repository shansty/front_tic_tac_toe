import React from 'react';
import './PopUp.css';
import Button from '../button/Button.tsx';

interface PopUpProps {
  imgSrc: string;
  text: string;
  onClick: () => void;
  buttonText: string;
  secondButton?: {
    text: string;
    onClick: () => void;
  };
  optionalButton?: {
    text: string;
    onClick: () => void;
  };
  closeButtononClose?: {
    onClick: () => void;
  }; 
}


const PopUp: React.FC<PopUpProps> = ({
  imgSrc,
  text,
  onClick,
  buttonText,
  secondButton,
  optionalButton,
  closeButtononClose
}) => {

  return (
    <div className='popUp'>
      {closeButtononClose && (
        <button className='close_btn' onClick={closeButtononClose?.onClick}>X</button>
        )}
      <img src={imgSrc} alt="PopUp image" />
      <p>{text}</p>
      <div className="buttonContainer">
        <Button className="button" onClick={onClick}>{buttonText}</Button>
        {secondButton && (
          <Button onClick={secondButton.onClick} className="secondButton">{secondButton.text}</Button>
        )}
        {optionalButton && (
          <Button onClick={optionalButton.onClick} className="optionalButton">{optionalButton.text}</Button>
        )}
      </div>
    </div>

  );
}

export default PopUp;
