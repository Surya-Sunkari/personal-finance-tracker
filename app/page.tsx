"use client";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { Router } from "next/router";
import Link from "next/link";
import {AiOutlineStock} from 'react-icons/ai';
import {BiSolidBadgeDollar} from 'react-icons/bi';

const Home = () => {
  const router = useRouter();
  
  const handleExpenseTrackerClick = () => {
    console.log("routing to expense tracker");
    router.push('/expenses');
  };

  const handleInvestmentsTrackerClick = () => {
    console.log("routing to investments tracker");
    router.push('/investments');
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800">
      <div className=" h-5/6 flex flex-col w-screen justify-center items-center m-0 p-0">
          <div className=" px-8 flex flex-col justify-center items-center">
              <div className="flex flex-col justify-center items-center">
                <p className=" text-5xl font-bold text-rose-400 font-mono pb-4 text-center">Cash Guardian: Your Personal Finance Accountability Tracker</p>
                <p className=" text-3xl font-bold text-rose-300 font-mono pb-4">Let's get started!</p>
              </div>
              <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 lg:py-14 mx-auto     ">
                  <div className="grid grid-cols-2 gap-52">

                      <div className="group flex flex-col h-full bg-white shadow-xl rounded-xl dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7]  hover:scale-110 transition cursor-pointer" onClick={handleExpenseTrackerClick}>
                          <div className="h-52 flex flex-col justify-center items-center bg-green-600 rounded-t-xl">
                              <BiSolidBadgeDollar size={200} />
                          </div>
                          <div className="p-4 h-full flex flex-col justify-evenly items-center">
                              <div className="block mb-1 text-xs font-semibold uppercase text-green-600">
                                Get personalized feedback on your spending habits!
                              </div>
                              <div className="text-xl font-semibold text-gray-800 dark:text-gray-300 dark:hover:text-white">
                                Expense Tracker
                              </div>
                          </div>
                      </div>

                      <div className="group flex flex-col h-full bg-white shadow-xl rounded-xl dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7]  hover:scale-110 transition cursor-pointer" onClick={handleInvestmentsTrackerClick}>
                          <div className="h-52 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl">
                              <AiOutlineStock size={200} />
                          </div>
                          <div className="p-4 h-full flex flex-col justify-evenly items-center">
                              <div className="block mb-1 text-xs font-semibold uppercase text-blue-600">
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
      <h3 className=" text-white font-semibold pt-4">Created for HackTX by Shray Jain, Surya Sunkari, and Tarun Mohan</h3>
    </div>
  );
};

export default Home;
