import React from 'react';
import { cursorTo } from 'readline';

interface ButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => any; 
    width?: string; // Optional width prop
}

const Button = ({ children, className, onClick, width = '200px' }: ButtonProps) => { 
    const buttonStyle = {
        height: '30px',
        width, 
        backgroundColor: 'rgba(251, 79, 0, 0.7)',
        color: 'white',
        border: '1.5px solid rgba(251, 79, 0)',
        borderRadius: '10px',
        cursor: 'pointer'
    };

    return (
        <button className={className} onClick={onClick} style={buttonStyle}>
            {children}
        </button>
    );
}

export default Button;