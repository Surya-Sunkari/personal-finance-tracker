"use client";
import React, { useEffect, useState } from "react";
import PowerTable from "./table";
import { useRouter } from "next/navigation";
import axios from 'axios';
import jwt from 'jsonwebtoken';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ExpenseChart from "@/components/ExpenseChart";
import AddExpense from "@/components/AddExpense";
import AddExpenses from "@/components/AddExpenses";

const Expenses = () => {
  const [user_id, setUserId] = useState('');
  const [chartRender, setChartRender] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [viewChart, setViewChart] = useState(false);
  
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
      setChartRender(chartRender + 1);
    }
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      console.log(user_id);
      if(user_id) {
        try {
          const response = await axios.post('http://127.0.0.1:5328/category_costs', {user_id: user_id});
          console.log(response.data)
          setChartData(response.data);
          setViewChart(true);
        } catch (error) {
          console.error('Network/Request Error:', error);
        }
      }
    }

    fetchChartData();
    console.log("page");
    console.log(chartData);
    
  }, [user_id, chartRender]);

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
          <div className="w-full h-full flex justify-center items-center">
            <Card className=" w-2/3 h-full bg-slate-200 rounded-3xl  m-3 shadow-lg border-2 border-black">
              <div className=" flex flex-col justify-between items-center w-full h-full">
                <div className="">
                  <PowerTable />
                </div>
                <div className=" h-[5/8] flex justify-evenly items-center w-full">
                  {viewChart ? <ExpenseChart title="Your Expenses:" chartData={chartData} chartHeight={150} chartWidth={500} blockHeight={200} blockWidth={375}/> : null}
                  <div className="flex flex-col justify-center items-center">
                    <div className="mb-3">
                      <AddExpense />
                    </div>
                    <div className="my-3">
                      <AddExpenses />
                    </div>
                    <div className="mt-3">
                      <Button variant="contained" onClick={() => setChartRender(chartRender + 1)} className="bg-blue-600 w-60">Refresh</Button>
                    </div>
                  </div>  
                </div>
              </div>
            </Card>
            <Card className=" w-1/3 h-full bg-slate-200 rounded-3xl  m-3 shadow-lg border-2 border-black">
              

            </Card>
          </div>
          

        

        {/* {viewChart ? <ExpenseChart title="Your Expenses:" chartData={chartData} chartHeight={200} chartWidth={400} blockHeight={240} blockWidth={384}/> : null} */}
        {/* <AddExpense /> */}
        <h3 className=" text-white font-semibold py-4 text-center">Created for HackTX by Shray Jain, Surya Sunkari, and Tarun Mohan</h3>
      </div>
    
    </div>
    
  );
};

export default Expenses;
