import React from 'react';
import Square from '../square/Square.tsx';
import './Board.css'

type SquaresArray = string[];

const Board = ({squares, handleClick, winningIndexes}) => {

    const isWinningSquare = (index: number) => {
        return winningIndexes && winningIndexes.includes(index);
    };

    return (
        <div className='board'>
            {
            squares.map((square:SquaresArray, index:number) => (
                <Square key={index} value={square} handleClick={() => handleClick(index)} isWinning={isWinningSquare(index)}/>
            ))
            }
        </div>
    );
}

export default Board;
