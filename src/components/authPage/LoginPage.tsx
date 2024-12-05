import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Button from '../utilsComponent/button/Button.tsx';
import './LoginPage.css'


const LoginPage: React.FC = () => {

    const LOGIN_URL = 'http://localhost:3001/login'
    const REGISTER_URL = 'http://localhost:3001/register';

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("");
    const [isRegister, setIsRegister] = useState(true);

    const navigate = useNavigate();


    const signIn = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

        try {
            e.preventDefault();
            const response = await axios.post(LOGIN_URL, { username, password },
                { headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' } });

            const token = response?.data?.token;
            localStorage.setItem("token", token);

            setUsername('');
            setPassword('');
            navigate("/main")

        } catch (err) {
            console.error(err)
            if (!err?.response) {
                console.log('No Server Response')
            } else if (err.response?.status === 401) {
                console.log('Invalid username or password')
            } else {
                console.log('Some error')
            }
            window.alert(`Error: ${err}`);
        }
    }

    const signUp = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setIsRegister(!isRegister)
        console.dir({username})
        try {
            await axios.post(REGISTER_URL, { email, password, username },
                { headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' } });
            setEmail('');
            setPassword('');
            setUsername('');

        } catch (err) {
            console.error(err)
            if (!err?.response) {
                console.log('No Server Response')
            } else if (err.response?.status === 401) {
                console.log('Invalid username or password')
            } else {
                console.log('Some error')
            }
            window.alert(`Error: ${err}`);
        }
    }

    const handleClick = () => {
        setIsRegister(!isRegister)
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

                {isRegister && (<Button className="form_button" onClick={signIn}>Sign In</Button>)}
                {isRegister && (<p className="form_text" onClick={handleClick}>Don't have an account? Click to register.</p>)}
                {!isRegister && (<Button className="form_button" onClick={signUp} >Sign Up</Button>)}
            </form>
        </>
    );
}

export default LoginPage;