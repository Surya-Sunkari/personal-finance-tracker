"use client";
import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts";

const ExpenseChart = ({title, chartData, chartHeight, chartWidth, blockHeight, blockWidth}) => {
    const [user_id, setUserId] = useState('');


    useEffect(() => {
        console.log("expense");
        console.log(chartData)
    });

    return (
        <div className="bg-white w-96 h-60 pb-3 m-5 flex flex-col justify-center items-center rounded-2xl">
            <h1 className="text-xl text-black py-3 font-bold">{title}</h1>
            <PieChart
                series={[
                    {
                        data: chartData.data,
                    },
                ]}
                width={chartWidth}
                height={chartHeight}
            />
        </div>
    );
};

export default ExpenseChart;
