import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => any; 
}

const Button = ({ children, className, onClick }: ButtonProps) => {

    const buttonStyle = {
        height: '30px',
        width: '200px',
        backgroundColor: 'rgba(251, 79, 0, 0.7)',
        color: 'white',
        border: '1.5px solid rgba(251, 79, 0)',
        borderRadius: '5px'
    };

    return (
        <button  className={className} onClick={onClick} style={buttonStyle}> {children} </button>
    );
}

export default Button;
