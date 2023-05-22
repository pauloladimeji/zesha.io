/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState } from "react";
import MoneyIcon from "@/components/Icons/MoneyIcon";
import VideoPlayIcon from "@/components/Icons/VideoPlayIcon";
import WalletIcon from "@/components/Icons/WalletIcon";
import Layout from "@/components/CreatorLayout/Layout";

import { Tabs } from "react-tabs";
import Tab from "react-tabs/lib/components/Tab";
import TabList from "react-tabs/lib/components/TabList";
import TabPanel from "react-tabs/lib/components/TabPanel";
import EyeIcon from "@/components/Icons/EyeIcon";
import VideoTimeIcon from "@/components/Icons/VideoTimeIcon";
import VideoAnalyticChart from "@/components/Charts/VideoAnalyticChart";

import useWeb3Auth from "@/hooks/useWeb3Auth";

const Dashboard = () => {
    const { account } = useWeb3Auth(
        `${process.env.NEXT_PUBLIC_BASE_URL}/creator`
    );

    const [analytics, setAnalytics] = useState(null);
    const [tfuelUsd, setTfuelUsd] = useState(0);

    const getAnalytics = async () => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/users/${account.userId}/analytics?type=CREATOR`
        );

        const data = await res.json();

        if (res.ok) {
            setAnalytics(data.data);
        } else {
            console.log(res);
            setAnalytics({
                totalcreatorviews: 0,
                totalcreatorviewers: 0,
                totaltimewatched: 0,
                totalcreatorearnings: 0,
                totalcreatorearningsgroupedbydate: [],
                walletbalance: "0.0",
            });
        }
    };

    const getTfuelPrice = async () => {
        const res2 = await fetch(
            "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=TFUEL&tsyms=USD"
        );

        const data2 = await res2.json();

        if (res2.ok) {
            const price = data2.RAW.TFUEL.USD.PRICE;

            setTfuelUsd(price * analytics.walletbalance);
        }
    };

    useEffect(() => {
        if (analytics?.walletbalance) {
            getTfuelPrice();
        }
    }, [analytics]);

    useEffect(() => {
        if (account) {
            getAnalytics();
        }
    }, [account]);

    return (
        <Layout>
            {analytics && (
                <div className="pb-20">
                    <div className="grow py-2 mb-3">
                        <h1 className="text-xl font-medium  ">Dashboard</h1>
                        <p className="text-[#7F8691] text-base">
                            View all activities on your zesha videos
                        </p>
                    </div>

                    <div className="mb-7">
                        <div className="grid grids-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            <div className="shadow_main w-full bg-white relative py-8 rounded-lg flex flex-col justify-between">
                                <div className="px-6 flex items-center justify-start gap-3 w-full">
                                    <span className="text-[#046ED1] text-xs rounded-full bg-[#F3F9FF] p-3 transition duration-200 ease">
                                        <WalletIcon />
                                    </span>
                                    <div className="flex items-start justify-start flex-col w-full">
                                        <h5 className="text-[#344054] text-xl font-bold">
                                            {analytics?.walletbalance || 0}{" "}
                                            TFUEL{" "}
                                            <span className="text-[#7F8691] text-sm font-normal">
                                                ~ ${tfuelUsd.toFixed(2)}
                                            </span>
                                        </h5>
                                        <span className="text-[#7F8691] text-sm">
                                            Wallet balance
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="shadow_main w-full bg-white relative py-8 rounded-lg flex flex-col justify-between">
                                <div className="px-6 flex items-center justify-start gap-3 w-full">
                                    <span className="text-[#046ED1] text-xs rounded-full bg-[#F3F9FF] p-3 transition duration-200 ease">
                                        <MoneyIcon />
                                    </span>
                                    <div className="flex items-start justify-start flex-col w-full">
                                        <h5 className="text-[#344054] text-xl font-bold">
                                            {analytics?.totalcreatorearnings ||
                                                0}{" "}
                                            TFUEL{" "}
                                            <span className="text-[#7F8691] text-sm font-normal">
                                                ~ $
                                                {analytics?.totalcreatorearnings *
                                                    tfuelUsd}
                                            </span>
                                        </h5>
                                        <span className="text-[#7F8691] text-sm">
                                            Money earned
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="shadow_main w-full bg-white relative py-8 rounded-lg  flex flex-col justify-between">
                                <div className="px-6 flex items-center justify-start gap-3 w-full">
                                    <span className="text-[#046ED1] text-xs rounded-full bg-[#F3F9FF] p-3 transition duration-200 ease">
                                        <VideoPlayIcon />
                                    </span>
                                    <div className="flex items-start justify-start flex-col w-full">
                                        <h5 className="text-[#344054] text-xl font-bold">
                                            {analytics?.totalcreatorviews || 0}
                                        </h5>
                                        <span className="text-[#7F8691] text-sm">
                                            Video views
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-full pb-24 px-4 md:px-6  bg-white mb-7 rounded-lg">
                        <div className="border-b border-[#EEEFF0] w-full mb-5 py-3">
                            <h4 className="text-[#344054] font-medium text-xl text-center py-2">
                                Your videos got {analytics.totalcreatorviewers}{" "}
                                viewers in the last 28 days
                            </h4>
                        </div>
                        <div className=" w-full  mt-3 md:mt-0 rounded fade-in relative py-6">
                            <Tabs>
                                <div className="flex gap-4 flex-wraps">
                                    <div className="flex items-center mb-3 flex-col lg:w-1/4 w-fulls">
                                        <TabList className="flex flex-col items-start justify-start flex-wrap inner_tab_header  rounded-md gap-3 w-full ">
                                            <Tab className="w-full">
                                                <button className="flex items-center justify-start text-sm p-2 px-3 w-full transition-colors duration-200 ease-in-out hover:bg-[#F6F6F7] hover:text-[#344054]  rounded-lg gap-2">
                                                    <span className="text-[#046ED1] text-xs rounded-full bg-[#F3F9FF] p-2 transition duration-200 ease">
                                                        <EyeIcon />
                                                    </span>
                                                    <b className="text-lg">
                                                        {
                                                            analytics.totalcreatorviews
                                                        }
                                                    </b>{" "}
                                                    Views
                                                </button>
                                            </Tab>
                                            <Tab className="w-full">
                                                <button className="flex items-center justify-start text-sm p-2 px-3 w-full transition-colors duration-200 ease-in-out hover:bg-[#F6F6F7] hover:text-[#344054]  rounded-lg gap-2">
                                                    <span className="text-[#046ED1] text-xs rounded-full bg-[#F3F9FF] p-2 transition duration-200 ease">
                                                        <VideoTimeIcon />
                                                    </span>
                                                    <b className="text-lg">
                                                        {
                                                            analytics.totaltimewatched
                                                        }
                                                    </b>{" "}
                                                    Hours watched
                                                </button>
                                            </Tab>
                                            <Tab className="w-full">
                                                <button className="flex items-center justify-start text-sm p-2 px-3 w-full transition-colors duration-200 ease-in-out hover:bg-[#F6F6F7] hover:text-[#344054]  rounded-lg gap-2">
                                                    <span className="text-[#046ED1] text-xs rounded-full bg-[#F3F9FF] p-2 transition duration-200 ease">
                                                        <MoneyIcon />
                                                    </span>
                                                    <b className="text-lg">
                                                        $
                                                        {
                                                            analytics.totalcreatorearnings
                                                        }{" "}
                                                    </b>
                                                    Earnings
                                                </button>
                                            </Tab>
                                        </TabList>
                                    </div>

                                    <div className="flex flex-col lg:w-3/4 w-fulls">
                                        <TabPanel>
                                            <div>
                                                <VideoAnalyticChart
                                                    data={
                                                        analytics.totalcreatorearningsgroupedbydate
                                                    }
                                                />
                                            </div>
                                        </TabPanel>
                                        <TabPanel>
                                            <div>
                                                <VideoAnalyticChart
                                                    data={
                                                        analytics.totalcreatorearningsgroupedbydate
                                                    }
                                                />
                                            </div>
                                        </TabPanel>
                                        <TabPanel>
                                            <div>
                                                <VideoAnalyticChart
                                                    data={
                                                        analytics.totalcreatorearningsgroupedbydate
                                                    }
                                                />
                                            </div>
                                        </TabPanel>
                                    </div>
                                </div>
                            </Tabs>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Dashboard;
