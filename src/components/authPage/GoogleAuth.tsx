import React from 'react';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


const GoogleAuth: React.FC  = () => {

    const {token: token} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("token", token as string);
        console.dir({token})
        navigate("/main")
    }, [token, navigate]); 

    return (
        <div>
            Please wait
        </div>
    );
}

export default GoogleAuth;
