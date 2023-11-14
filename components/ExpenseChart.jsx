"use client";
import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts";

const ExpenseChart = ({title, chartData, chartHeight, chartWidth, blockHeight, blockWidth, bgColor}) => {

    useEffect(() => {
        console.log("expense");
        console.log(chartData)
    });

    return (
        <div className={bgColor + " m-5 flex flex-col justify-center items-center rounded-2xl w-[" + blockWidth + "px] h-[" + blockHeight + "px]"}>
            <div className=" w-1/2 flex flex-col justify-center items-center">
                <h1 className="text-xl text-black py-3 font-bold">{title}</h1>
                <PieChart className="flex justify-center items-center"
                    series={[
                        {
                            data: chartData.data,
                        },
                    ]}
                    width={chartWidth}
                    height={chartHeight}
                />
            </div> 
        </div>
    );
};

export default ExpenseChart;
