"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';
import jwt from 'jsonwebtoken';

const Investments = () => {
  const [user_id, setUserId] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if(!token) {
      console.log("no token found, routing to sign in page");
      router.push('/signIn');
    } else {
      const user_id = jwt.decode(token).user_id;
      console.log(user_id);
      setUserId(user_id);
    }
  }, []);

  const handleSignOutClick = () => {
    localStorage.removeItem('jwt_token');
    router.push('/signIn');
  }

  return (
    <div>
      <div className="h-screen flex flex-col justify-between bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800">
        <div className="px-7 py-5 flex justify-between">
          <p className="  text-2xl text-white font-semibold cursor-pointer text-right hover:scale-110 transition" onClick={() => router.push("/")}>Home</p>
          <p className="  text-3xl text-white font-semibold text-right " >Cash Guardian</p>
          <p className="  text-2xl text-white font-semibold cursor-pointer text-right hover:scale-110 transition" onClick={handleSignOutClick}>Sign Out</p>
        </div>
          
          
        <h3 className=" text-white font-semibold py-4 text-center">Created for HackTX by Shray Jain, Surya Sunkari, and Tarun Mohan</h3>
      </div>
    
    </div>
    
  );
};

export default Investments;
