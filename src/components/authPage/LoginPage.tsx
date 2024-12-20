import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { signIn, signUp } from '../../axios.ts';
import Button from '../utilsComponent/button/Button.tsx';
import { getToken, checkTokenExparation } from '../../utils.ts';
import './LoginPage.css'


const LoginPage: React.FC = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("");
    const [isRegister, setIsRegister] = useState(true);

    const navigate = useNavigate();

    const token = getToken();
    

    useEffect(() => {   
        if(token) {
            navigate('/main')
        }
    },[token])

    const login = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        signIn(e, username, password, setUsername, setPassword, navigate)
    }

    const register = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        signUp(e, setIsRegister, isRegister, email, password, username, setEmail, setUsername, setPassword)
    }

    const handleClick = () => {
        setIsRegister(!isRegister)
    }

    function navigated(url: string) {
        window.location.href = url;
    }

    async function auth() {
        const response = await axios.post('http://localhost:3001/auth/google');
        navigated(response.data.url);
    }

    return (
        <>
            <form className="auth_form">
                <label htmlFor="username" >
                    Username
                </label>
                <input
                    value={username}
                    className='auth_fields'
                    placeholder="Please enter username"
                    type="text"
                    name="username"
                    id="username"
                    onChange={(e) => setUsername(e.target.value)}
                />


                {!isRegister && (
                    <>
                        <label htmlFor="email" >
                            Email
                        </label>
                        <input
                            value={email}
                            className='auth_fields'
                            placeholder="Please enter email"
                            type="text"
                            name="email"
                            id="email"
                            onChange={(e) => setEmail(e.target.value)} />
                    </>
                )}


                <label htmlFor="password">
                    Password
                </label>
                <input
                    value={password}
                    className='auth_fields'
                    placeholder="Please enter password"
                    type="text"
                    name="password"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)} />

                {isRegister && (
                    <>
                        <div className='sign_in_btns'>
                            <Button onClick={login}>Sign In</Button>
                            <button className="btn-auth" type="button" onClick={() => auth()}>
                                <img className="btn-auth-img" src='/google_btn.png' alt='google sign in' />
                            </button>
                        </div>
                        <p className="form_text" onClick={handleClick}>Don't have an account? Click to register.</p>
                    </>)}

                {!isRegister && (<Button className="form_button" onClick={register} >Sign Up</Button>)}
            </form>
        </>
    );
}

export default LoginPage;