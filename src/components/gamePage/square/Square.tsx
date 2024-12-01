import React from 'react';
import './Square.css'

type TypeSquareProps = {
    handleClick: () => void,
    value: string,
    isWinning?: boolean
}

const Square:React.FC<TypeSquareProps> = (props) => {
    return (
        <button onClick={props.handleClick} className={` ${props.isWinning ? 'winning' : 'square'}`}>
            {props.value}
        </button>
    );
}

export default Square;
