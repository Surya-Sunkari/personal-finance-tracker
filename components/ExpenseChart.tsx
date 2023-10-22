"use client";
import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts";

const ExpenseChart = ({title, chartData, chartHeight, chartWidth, blockHeight, blockWidth}) => {

    useEffect(() => {
        console.log("expense");
        console.log(chartData)
    });

    return (
        <div className={"bg-white m-5 flex flex-col justify-center items-center rounded-2xl w-[" + blockWidth + "] h-[" + blockHeight + "]"}>
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
