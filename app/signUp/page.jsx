"use client";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { Router } from "next/router";
import Link from "next/link";


const SignUp = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [showPasswordMessage, setShowPasswordMessage] = useState(false);
  
  const handleSignUp = async () => {
    console.log("handling sign up");
    console.log(`Email: ${email}, Password: ${password} Confirm Password: ${confirmPassword} firstName: ${firstName} lastName: ${lastName}`);
    if(password !== confirmPassword) {
        console.log("passwords did not match")
        setPasswordMessage("Passwords Must Match!");
        setShowPasswordMessage(true);
    } else {
        //TODO: automatically sign in and route to home page instead of routing to sign in page
        try {
            const user_data = {
                first_name: firstName,
                last_name: lastName,
                username: email,
                password: password,
            };
        
            const response = await axios.post('http://127.0.0.1:5328/create_user', user_data);
        
            if (response.status === 200) {
                if(response.data.success) {
                    const token = response.data.token;
                    localStorage.setItem('jwt_token', token);
                    setShowPasswordMessage(false);
                    router.push('/');
                } else {
                    setPasswordMessage("Username Already in Use!");
                    setShowPasswordMessage(true);
                    console.error('Username Already in User', response.data);
                }
            } else {
                setPasswordMessage("Error!");
                setShowPasswordMessage(true);
                console.error('Error:', response.data);
            }
        } catch (error) {
            setPasswordMessage("Network/Request Error!")
            setShowPasswordMessage(true);
            // Handle any network or request error
            console.error('Network/Request Error:', error);
        }
    }
    
  };

  useEffect(() => {
    console.log("show password: " + showPasswordMessage);
  }, []);

  return (
    <div className="flex h-screen w-screen justify-center items-center m-0 p-0 bg-gradient-to-r  from-slate-800 via-slate-700 to-slate-800">
        <div className="w-[800px] h-[650px] min-h-min min-w-min bg-stone-50 p-6 rounded-3xl shadow-lg flex flex-col justify-evenly ">
            <div className="pb-5">
                <div className="text-center">
                    <h1 className=" text-4xl text-sky-900 font-bold">Sign up</h1>
                </div>
            </div>
            <div className="mb-3 mx-20 flex justify-center items-center">
                <div className="w-1/2 pr-4">
                    <label className="block text-sm font-semibold mb-2 text-black">First Name:</label>
                    <input type="email" className="py-3 px-4 block w-full border border-stone-300 rounded-full text-sm shadow-lg" 
                        value={firstName} onChange={(e) => setFirstName(e.target.value)} 
                    />
                </div>
                <div className="w-1/2 pl-4">
                    <label className="block text-sm font-semibold mb-2 text-black">Last Name:</label>
                    <input type="email" className="py-3 px-4 block w-full border border-stone-300 rounded-full text-sm shadow-lg" 
                        value={lastName} onChange={(e) => setLastName(e.target.value)} 
                    />
                </div>
            </div>
            <div className="mb-3 mx-20">
                <label className="block text-sm font-semibold mb-2 text-black">Email:</label>
                <input type="text" className="py-3 px-4 block w-full border border-stone-300 rounded-full text-sm shadow-lg" 
                    value={email} onChange={(e) => setEmail(e.target.value)} 
                />
            </div>
            <div className="mb-3 mx-20">
                <label className="block text-sm font-semibold mb-2 text-black">Password:</label>
                <input type="password" className="py-3 px-4 block w-full border border-stone-300 rounded-full text-sm shadow-lg" 
                    value={password} onChange={(e) => setPassword(e.target.value)} 
                />
            </div>
            <div className="mb-10 mx-20">
                <label className="block text-sm font-semibold mb-2 text-black">Confirm Password:</label>
                <input type="password" className="py-3 px-4 block w-full border border-stone-300 rounded-full text-sm shadow-lg" 
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} 
                />
            </div>
            <div className=" flex flex-col justify-center items-center">
                {showPasswordMessage ? <p className=" text-red-700 text-sm pb-2">{passwordMessage}</p> : null}
                <button
                    className="bg-sky-900 text-white rounded-full py-2 px-4 hover:bg-sky-700 transition duration-300"
                    onClick={handleSignUp}
                >
                    <h2 className=" mx-8 font-semibold">Sign up</h2>
                </button>
                <p className="pt-4">Already have an account? <Link className=" text-blue-700"  href="/signIn">Sign in</Link> instead.</p>
            </div>
        </div>
    </div>
  );
};

export default SignUp;
