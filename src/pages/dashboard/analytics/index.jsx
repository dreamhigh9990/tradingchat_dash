"use client";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import Card from "@/components/ui/Card";
import ImageBlock1 from "@/components/partials/widget/block/image-block-1";



import SelectMonth from "@/components/partials/SelectMonth";

import RecentActivity from "@/components/partials/widget/activity";

import HomeBredCurbs from "@/components/partials/HomeBredCurbs";


const Dashboard = () => {
  const [filterMap, setFilterMap] = useState("usa");
  return (
    <div>
      <HomeBredCurbs title="Dashboard" />
      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="2xl:col-span-3 lg:col-span-4 col-span-12">
          <ImageBlock1 />
        </div>
        <div className="2xl:col-span-9 lg:col-span-8 col-span-12">
         
        </div>
      </div>
      <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-8 col-span-12">
        
        </div>
        <div className="lg:col-span-4 col-span-12">
         
        </div>
        <div className="lg:col-span-8 col-span-12">
        
        </div>
        <div className="lg:col-span-4 col-span-12">
          <Card title="Recent Activity" headerslot={<SelectMonth />}>
            <RecentActivity />
          </Card>
        </div>
        <div className="lg:col-span-8 col-span-12">
          
        </div>
        <div className="lg:col-span-4 col-span-12">
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
