"use client";
import Card from "@/components/ui/Card";
import News from "@/components/partials/app/stocks/news";
import TradingChart from "@/components/partials/app/stocks/trading-chart";
import { useSelector } from "react-redux";

const TradingInfo = () => {
  const { symbolSearch } = useSelector((state) => state.stocks);

  return (
    <div className="h-full">
      <div className="gap-2 h-full">
        <TradingChart height={200} showToolBar={false} className="-ml-2 -mt-0 w-[320px] h-[200px]" />
        <News className="chat-content parent-height w-[240px] ml-6" />
      </div>
    </div >
  );
};

export default TradingInfo;
