"use client";
import React, { useEffect, useState } from "react";
import StockTable from "../../components/stock-table";
import { useRouter } from "next/navigation";
import News_Carousel from "../../components/carousel";
import axios from 'axios';
import jwt from 'jsonwebtoken';
import ExpenseChart from "@/components/ExpenseChart";
import AddInvestment from "@/components/AddInvestment";
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';

const Investments = () => {
  const [user_id, setUserId] = useState('');
  const [newsData, setNewsData] = useState([]);
  const [viewNews, setViewNews] = useState(false);
  const [newsRender, setNewsRender] = useState(0);
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
      setNewsRender(newsRender + 1);
      setChartRender(chartRender + 1);
    }
  }, []);

  useEffect(() => {
    const fetchNewsData = async () => {
      if(user_id) {
        try {
          const response = await axios.post('http://127.0.0.1:5328/stock_news', {user_id: user_id});
          var data = response.data
          console.log(data)
          setNewsData(data)
          setViewNews(true)
          fetchNewsData
        } catch (error) {
          console.error('Network/Request Error:', error);
        }
      }
    }
    const fetchChartData = async () => {
      console.log(user_id);
      if(user_id) {
        try {
          const response = await axios.post('http://127.0.0.1:5328/get_portfolio_worth', {user_id: user_id});
          console.log(response.data)
          setChartData(response.data);
          setViewChart(true);
        } catch (error) {
          console.error('Network/Request Error:', error);
        }
      }
    }
    fetchNewsData();
    fetchChartData();
  }, [user_id, newsRender, chartRender]);

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
        {/* {viewChart ? <ExpenseChart title="Your Investments:" chartData={chartData} chartHeight={200} chartWidth={400} blockHeight={240} blockWidth={384}/> : null}
        <AddInvestment /> */}
        <div className="w-full h-full flex justify-center items-center">
            <Card className=" w-1/3 h-full bg-slate-200 rounded-3xl  m-3 shadow-lg border-2 border-black flex flex-col justify-between items-center ">
              
            </Card>
            <Card className=" w-2/3 h-full bg-slate-200 rounded-3xl  m-3 shadow-lg border-2 border-black">
              <div className=" flex flex-col justify-between items-center w-full h-full">
                <div className=" h-[5/8] flex justify-evenly items-center w-full">
                  {viewChart ? <ExpenseChart title="Portfolio Analysis" chartData={chartData} chartHeight={150} chartWidth={400} blockHeight={400} blockWidth={100}/> : null}
                  <div className="flex flex-col justify-center items-center">
                    <div className="mb-3">
                      <AddInvestment />
                    </div>
                    <div className="my-3">
                      <AddInvestment />
                    </div>
                    <div className="mt-3">
                      <Button variant="contained" onClick={() => setChartRender(chartRender + 1)} className="bg-blue-600 w-60">Refresh</Button>
                    </div>
                  </div>  
                </div>
                <div className="pb-3">
                  <StockTable />
                </div>
              </div>
            </Card>
            
          </div>
        <h3 className=" text-white font-semibold py-4 text-center">Created for HackTX by Shray Jain, Surya Sunkari, and Tarun Mohan</h3>
        {viewNews ? <News_Carousel news={newsData}/> : null}
    </div>
    {/* <StockTable/> */}
    </div>
    
  );
};

export default Investments;
