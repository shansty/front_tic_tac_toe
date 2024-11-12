import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Button from '../utilsComponent/Button.tsx';


const LoginPage = () => {

    const LOGIN_URL = 'http://localhost:3001/login'
    const REGISTER_URL= 'http://localhost:3001/register';

    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("")

    const navigate = useNavigate();


    const signIn = async (e) => {

        try {
            e.preventDefault();
            const response = await axios.post(LOGIN_URL, {email, password},  
                {headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}});

            const token = response?.data?.token;
            localStorage.setItem("token", token);

            setEmail('');
            setPassword('');
            navigate("/main")
            
        } catch (err) {
            console.error(err)
            if(!err?.response) {
                console.log('No Server Response')
            } else if (err.response?.status === 401) {
                console.log('Invalid username or password')
            } else {
                console.log('Some error')
            }
            window.alert(`Error: ${err}`);
        }
    }

    const signUp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(REGISTER_URL, {email, password},  
                {headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}});
            setEmail('');
            setPassword('');
            
        } catch (err) {
            console.error(err)
            if(!err?.response) {
                console.log('No Server Response')
            } else if (err.response?.status === 401) {
                console.log('Invalid username or password')
            } else {
                console.log('Some error')
            }
            window.alert(`Error: ${err}`);
        }
    }

    return(
        <>
            <form className="auth_form">
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
                    onChange={(e) => setEmail(e.target.value)}/>
        
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
                    onChange={(e) => setPassword(e.target.value)}/>

                <Button className="form_button" onClick={signIn}>Sign In</Button>   
                <Button className="form_button" onClick={signUp} >Sign Up</Button>   
            </form>
        </>
    );
}

export default LoginPage;