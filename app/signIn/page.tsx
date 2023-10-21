"use client";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { Router } from "next/router";
import Link from "next/link";


const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSignIn = async () => {
    console.log("handling sign in");
    console.log(`Email: ${email}, Password: ${password}`);
  }

  return (
    <div className="flex h-screen w-screen justify-center items-center m-0 p-0 bg-gradient-to-tr from-blue-100 via-orange-100 to-orange-200">
      <div className="w-[800px] h-[500px] min-h-min min-w-min bg-stone-50 p-6 rounded-3xl shadow-lg flex flex-col justify-evenly ">
        <div>
            <div className="text-center">
                <h1 className=" text-xl text-sky-900 font-bold">Welcome back!</h1>
            </div>
            <div className="text-center">
                <h1 className=" text-4xl text-sky-900 font-bold">Sign in</h1>
            </div>
        </div>
        <div className="mb-4 mx-20">
            <label className="block text-sm font-semibold mb-2 text-black dark:text-white">Email:</label>
            <input type="email" className="py-3 px-4 block w-full border border-stone-300 rounded-full text-sm shadow-lg" 
                value={email} onChange={(e) => setEmail(e.target.value)} 
            />
        </div>
        <div className="mb-6 mx-20">
            <label className="block text-sm font-semibold mb-2 text-black dark:text-white">Password:</label>
            <input type="password" className="py-3 px-4 block w-full border border-stone-300 rounded-full text-sm shadow-lg" 
                value={password} onChange={(e) => setPassword(e.target.value)} 
            />
        </div>
        <div className=" flex flex-col justify-center items-center">
            <button
                className="bg-sky-900 text-white rounded-full py-2 px-4 hover:bg-sky-700 transition duration-300"
                onClick={handleSignIn}
            >
                <h2 className=" mx-8 font-semibold">Login</h2>
            </button>
            <p className="pt-4">Don't have an account? <Link className=" text-blue-700"  href="/signUp">Sign up</Link> instead.</p>
            </div>
        </div>
    </div>
  );
};

export default Login;
