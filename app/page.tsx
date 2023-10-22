"use client";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import axios from 'axios';
import jwt from 'jsonwebtoken';
import Link from "next/link";
import {AiOutlineStock} from 'react-icons/ai';
import {MdAttachMoney} from 'react-icons/md';

const Home = () => {
  const router = useRouter();

  const [user_id, setUserId] = useState('');

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

  const handleExpenseTrackerClick = () => {
    console.log("routing to expense tracker");
    router.push('/expenses');
  };

  const handleInvestmentsTrackerClick = () => {
    console.log("routing to investments tracker");
    router.push('/investments');
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-r justify-between from-slate-800 via-slate-700 to-slate-800">
      <div className="px-7 py-5 flex justify-between">
          <p className="  text-2xl text-white font-semibold cursor-pointer text-right hover:scale-110 transition" onClick={() => router.push("/")}>Home</p>
          <p className="  text-2xl text-white font-semibold cursor-pointer text-right hover:scale-110 transition" onClick={handleSignOutClick}>Sign Out</p>
      </div>
      <div className=" h-5/6 flex flex-col w-screen justify-center items-center m-0 p-0">
          <div className=" px-8 flex flex-col justify-center items-center">
              <div className="flex flex-col justify-center items-center">
                <p className=" text-6xl font-bold text-white font-mono pb-4 text-center mb-6">Cash Guardian</p>
                <p className=" text-3xl font-bold text-white font-mono pb-4">Your Personal Finance Accountability Tracker</p>
              </div>
              <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 lg:py-14 mx-auto">
                  <div className="grid grid-cols-2 gap-52">

                      <div className="group flex flex-col h-full bg-white shadow-xl rounded-xl dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7]  hover:scale-110 transition cursor-pointer" onClick={handleExpenseTrackerClick}>
                          <div className="h-52 flex flex-col justify-center items-center bg-slate-400 rounded-t-xl">
                              <MdAttachMoney size={200} />
                          </div>
                          <div className="p-4 h-full flex flex-col justify-evenly items-center">
                              <div className="block mb-1 text-xs font-semibold uppercase text-slate-400">
                                Get personalized feedback on your spending habits!
                              </div>
                              <div className="text-xl font-semibold text-gray-800 dark:text-gray-300 dark:hover:text-white">
                                Expense Tracker
                              </div>
                          </div>
                      </div>

                      <div className="group flex flex-col h-full bg-white shadow-xl rounded-xl dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7]  hover:scale-110 transition cursor-pointer" onClick={handleInvestmentsTrackerClick}>
                          <div className="h-52 flex flex-col justify-center items-center bg-slate-400 rounded-t-xl">
                              <AiOutlineStock size={200} />
                          </div>
                          <div className="p-4 h-full flex flex-col justify-evenly items-center">
                              <div className="block mb-1 text-xs font-semibold uppercase text-slate-400">
                                Gain insights related to your investments portfolio!
                              </div>
                              <div className="text-xl font-semibold text-gray-800 dark:text-gray-300 dark:hover:text-white">
                                Investments Tracker
                              </div>
                          </div>
                      </div>
          
                  </div>
              </div>
          </div>
      </div>
      <h3 className=" text-white font-semibold py-4 text-center">Created for HackTX by Shray Jain, Surya Sunkari, and Tarun Mohan</h3>
    </div>
  );
};

export default Home;
