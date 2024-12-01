import React from 'react';
import Square from '../square/Square.tsx';
import './Board.css'


type TypeBoardProps = {
    squares: string[]; 
    handleClick: (index: number) => void; 
    winningIndexes?: number[]; 
};

const Board: React.FC<TypeBoardProps> = ({squares, handleClick, winningIndexes}) => {

    const isWinningSquare = (index: number) => {
        return winningIndexes && winningIndexes.includes(index);
    };

    return (
        <div className='board'>
            {
            squares.map((square, index) => (
                <Square key={index} value={square} handleClick={() => handleClick(index)} isWinning={isWinningSquare(index)}/>
            ))
            }
        </div>
    );
}

export default Board;
