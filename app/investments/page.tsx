"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import News_Carousel from "../../components/carousel";
import axios from 'axios';
import jwt from 'jsonwebtoken';

const Investments = () => {
  const [user_id, setUserId] = useState('');
  const [newsData, setNewsData] = useState([]);
  const [viewNews, setViewNews] = useState(false);
  const [newsRender, setNewsRender] = useState(0);

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
        } catch (error) {
          console.error('Network/Request Error:', error);
        }
      }
    }
    fetchNewsData();
  }, [user_id, newsRender]);


  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800">
        investments page
        {viewNews ? <News_Carousel news={newsData}/> : null}
    </div>
  );
};

export default Investments;
