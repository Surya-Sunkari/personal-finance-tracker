"use client";
import React, { useEffect, useState } from "react";
import StockTable from "../../components/stock-table";
import { useRouter } from "next/navigation";
import News_Carousel from "../../components/carousel";
import axios from 'axios';
import jwt from 'jsonwebtoken';
import ExpenseChart from "@/components/ExpenseChart";
import AddInvestment from "@/components/AddInvestment";

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
      <div className="px-7 py-5 flex justify-end">
          <p className="  text-2xl text-white font-semibold cursor-pointer text-right hover:scale-110 transition" onClick={handleSignOutClick}>Sign Out</p>
      </div>
      {viewChart ? <ExpenseChart title="Your Investments:" chartData={chartData} chartHeight={200} chartWidth={400} blockHeight={240} blockWidth={384}/> : null}
      <AddInvestment></AddInvestment>
      <h3 className=" text-white font-semibold py-4 text-center">Created for HackTX by Shray Jain, Surya Sunkari, and Tarun Mohan</h3>
      {viewNews ? <News_Carousel news={newsData}/> : null}
    </div>
    <StockTable/>
    </div>
    
  );
};

export default Investments;
