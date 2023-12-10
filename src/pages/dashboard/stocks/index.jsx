"use client";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import NewsList from "@/components/partials/app/stocks/news-list";
import TradingChart from "@/components/partials/app/stocks/trading-chart";
import { useSelector } from "react-redux";

const ProjectPage = () => {
  const { symbolSearch } = useSelector((state) => state.stocks);

  return (
    <div className="space-y-5">
      <div className="flex justify-between flex-wrap items-center mb-6">
        <h4 className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
          {"Stocks"}
        </h4>
      </div>

      <div className="gap-5 h-full">
        <Card title={symbolSearch ? `Trading Chart - ${symbolSearch}` : 'Trading Chart'}>
          <TradingChart />
        </Card>
        <Card className="mt-2">
          <NewsList newsClass="max-h-[500px]" />
        </Card>
      </div>
    </div >
  );
};

export default ProjectPage;
