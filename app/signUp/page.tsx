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
  const [showPasswordMessage, setShowPasswordMessage] = useState(false);
  
  const handleSignUp = async () => {
    console.log("handling sign up");
    console.log(`Email: ${email}, Password: ${password} Confirm Password: ${confirmPassword} firstName: ${firstName} lastName: ${lastName}`);
    if(password !== confirmPassword) {
        console.log("passwords did not match")
        setShowPasswordMessage(true);
    } else {
        //TODO: automatically sign in and route to home page instead of routing to sign in page
        console.log("passwords matched")
        setShowPasswordMessage(false);
        router.push("/signIn");
    }
    
  };

  useEffect(() => {
    console.log("show password: " + showPasswordMessage);
  }, []);

  return (
    <div className="flex h-screen w-screen justify-center items-center m-0 p-0 bg-gradient-to-tr from-blue-100 via-orange-100 to-orange-200">
        <div className="w-[800px] h-[650px] min-h-min min-w-min bg-stone-50 p-6 rounded-3xl shadow-lg flex flex-col justify-evenly ">
            <div className="pb-5">
                <div className="text-center">
                    <h1 className=" text-4xl text-sky-900 font-bold">Sign up</h1>
                </div>
            </div>
            <div className="mb-3 mx-20 flex justify-center items-center">
                <div className="w-1/2 pr-4">
                    <label className="block text-sm font-semibold mb-2 text-black dark:text-white">First Name:</label>
                    <input type="email" className="py-3 px-4 block w-full border border-stone-300 rounded-full text-sm shadow-lg" 
                        value={firstName} onChange={(e) => setFirstName(e.target.value)} 
                    />
                </div>
                <div className="w-1/2 pl-4">
                    <label className="block text-sm font-semibold mb-2 text-black dark:text-white">Last Name:</label>
                    <input type="email" className="py-3 px-4 block w-full border border-stone-300 rounded-full text-sm shadow-lg" 
                        value={lastName} onChange={(e) => setLastName(e.target.value)} 
                    />
                </div>
            </div>
            <div className="mb-3 mx-20">
                <label className="block text-sm font-semibold mb-2 text-black dark:text-white">Email:</label>
                <input type="text" className="py-3 px-4 block w-full border border-stone-300 rounded-full text-sm shadow-lg" 
                    value={email} onChange={(e) => setEmail(e.target.value)} 
                />
            </div>
            <div className="mb-3 mx-20">
                <label className="block text-sm font-semibold mb-2 text-black dark:text-white">Password:</label>
                <input type="password" className="py-3 px-4 block w-full border border-stone-300 rounded-full text-sm shadow-lg" 
                    value={password} onChange={(e) => setPassword(e.target.value)} 
                />
            </div>
            <div className="mb-10 mx-20">
                <label className="block text-sm font-semibold mb-2 text-black dark:text-white">Confirm Password:</label>
                <input type="password" className="py-3 px-4 block w-full border border-stone-300 rounded-full text-sm shadow-lg" 
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} 
                />
            </div>
            <div className=" flex flex-col justify-center items-center">
                {showPasswordMessage ? <p className=" text-red-700 text-sm pb-2">Passwords must match!</p> : null}
                <button
                    className="bg-sky-900 text-white rounded-full py-2 px-4 hover:bg-sky-700 transition duration-300"
                    onClick={handleSignUp}
                >
                    <h2 className=" mx-8 font-semibold">Sign up</h2>
                </button>
                <p className="pt-4">Already have an account? <Link className=" text-blue-700"  href="/signUp">Sign in</Link> instead.</p>
            </div>
        </div>
    </div>
  );
};

export default SignUp;
