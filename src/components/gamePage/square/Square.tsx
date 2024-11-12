import React from 'react';
import './Square.css'

const Square = (props) => {
    return (
        <button onClick={props.handleClick} className={` ${props.isWinning ? 'winning' : 'square'}`}>
            {props.value}
        </button>
    );
}

export default Square;
