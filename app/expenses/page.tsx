"use client";
import React, { useEffect, useState } from "react";
import PowerTable from "../../components/table";
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
  const [tableRender, setTableRender] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [viewTable, setViewTable] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  
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
      setTableRender(tableRender + 1);
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

  useEffect(() => {
    const fetchTableData = async () => {
      console.log(user_id);
      if(user_id) {
        try {
          const response = await axios.post('http://127.0.0.1:5328/get_expenses', {user_id: user_id});
          console.log(response.data)
          setTableData(response.data.data);
          setViewTable(true);
        } catch (error) {
          console.error('Network/Request Error:', error);
        }
      }
    }

    fetchTableData();
    console.log("page");
    console.log(tableData);
    
  }, [user_id, tableRender]);

  const handleSignOutClick = () => {
    localStorage.removeItem('jwt_token');
    router.push('/signIn');
  }

  const handleGenerateRecommendations = async () => {
    try {
      
      console.log(user_id);
      const response = await axios.post('http://127.0.0.1:5328/get_recommendations', {user_id: user_id});
  
      if (response.status === 200) {
          var unparsedMessage = response.data.data;
          console.log(unparsedMessage);
          const blocks = unparsedMessage.split(/\n(?=Spending Analysis:|Recommendations:)/g);
          const parsedBlocks = blocks.map(block => block.trim());
          setRecommendations(parsedBlocks)
          setShowRecommendations(true);
      } else {
          console.error('Error:', response.data);
      }
    } catch (error) {
        console.error('Network/Request Error:', error);
    }
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
                  <PowerTable tableData={tableData} />
                </div>
                <div className=" h-[5/8] flex justify-evenly items-center w-full">
                  {viewChart ? <ExpenseChart title="Expense Analysis" chartData={chartData} chartHeight={150} chartWidth={500} blockHeight={200} blockWidth={375}/> : null}
                  <div className="flex flex-col justify-center items-center">
                    <div className="mb-3">
                      <AddExpense />
                    </div>
                    <div className="my-3">
                      <AddExpenses />
                    </div>
                    <div className="mt-3">
                      <Button variant="contained" onClick={() => {setChartRender(chartRender + 1)
                                                                  setTableRender(tableRender + 1)}} className="bg-blue-600 w-60">Refresh</Button>
                    </div>
                  </div>  
                </div>
              </div>
            </Card>
            <Card className=" w-1/3 h-full bg-slate-200 rounded-3xl  m-3 shadow-lg border-2 border-black flex flex-col justify-between items-center ">
              <h1 className="text-center text-black font-bold text-2xl py-4 ">AI Expenses Analysis</h1>
              <div className="text-black text-left px-3">
                {!showRecommendations ? "Press \"Generate Recommendations\" to get started!" : <div><p className="py-3">{recommendations[0]}</p><hr /><p className="py-3">{recommendations[1]}</p></div>}
              </div>
              <div className="pb-6">
                <Button variant="contained" onClick={handleGenerateRecommendations} className="bg-blue-600 text-center">Generate Recommendations</Button>
              </div>
            </Card>
          </div>
          
        <h3 className=" text-white font-semibold py-4 text-center">Created for HackTX by Shray Jain, Surya Sunkari, and Tarun Mohan</h3>
      </div>
    
    </div>
    
  );
};

export default Expenses;
