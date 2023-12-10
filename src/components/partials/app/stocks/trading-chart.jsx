import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import useDarkMode from "@/hooks/useDarkMode";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setCompanyNews, setFilter, setNews, setStockGraph, setSymbols } from "@/components/partials/app/stocks/store";
import { getCompanyNews, getNews, getStocksWithSymbol, getSymbols } from "@/libs/finnhub";
import { Icon } from "@iconify/react";
import moment from "moment";
import { Loader } from "@/components/ui/AppLoader";
import { convertToInternationalCurrencySystem, getMSFT } from "@/libs/msft";

const TradingChart = ({ height = 350, showToolBar = true, className = "" }) => {
  const [isDark] = useDarkMode();
  const { stockGraph, symbolSearch } = useSelector((state) => state.stocks);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [symbol, setSymbol] = useState("AAPL")

  useEffect(() => {
    const unsubscribe = async () => {
      if ((stockGraph?.stocks?.length == 0) || stockGraph?.volumes?.length == 0 || symbolSearch != symbol) {
        if (symbolSearch || symbol) {
          setLoading(true);
          try {
            setSymbol(symbolSearch || symbol, false);
            await getStocksWithSymbol(symbolSearch || symbol).then(async data => {
              // console.log({ data });
              dispatch(setStockGraph(data));
              setTimeout(() => {
                setLoading(false);
              }, 3000);
            })
          } catch (_ex) {
            setLoading(false);
            console.log(`news error - ${_ex}`)
          }
        }
      }
    };
    // return () => unsubscribe();
    unsubscribe();
  }, [symbolSearch]);

  // useEffect(() => {
  //   const unsubscribe = async () => {
  //     if ((!stockGraph?.stocks) || stockGraph?.volumes?.length == 0) {
  //       setLoading(true);
  //       try {
  //         await getMSFT().then(async data => {
  //           dispatch(setStockGraph({ stocks: data.stocks, volumes: data.volumes }));
  //           setTimeout(() => {
  //             setLoading(false);
  //           }, 3000);
  //         })
  //       } catch (_ex) {
  //         setLoading(false);
  //         console.log(`news error - ${_ex}`)
  //       }
  //     }
  //   };
  //   // return () => unsubscribe();
  //   unsubscribe();
  // }, []);

  return (
    <div className={className}>
      {(loading || (!stockGraph?.stocks) || stockGraph?.stocks.length == 0 || (!stockGraph?.volumes) || stockGraph?.volumes.length == 0) ? (<div className="pt-12"><Loader /></div>)
        : <>
          <Chart options={{
            chart: {
              toolbar: {
                show: showToolBar,
              },
              zoom: {
                enabled: true,
                type: 'x',
                autoScaleYaxis: false,
                zoomedArea: {
                  fill: {
                    color: '#90CAF9',
                    opacity: 0.4
                  },
                  stroke: {
                    color: '#0D47A1',
                    opacity: 0.4,
                    width: 1
                  }
                }
              }
            },
            stroke: {
              show: true,
              curve: 'smooth',
              lineCap: 'butt',
              colors: undefined,
              width: 1,
              dashArray: 0,
            },
            plotOptions: {
              candlestick: {
                colors: {
                  upward: "#4669FA",
                  downward: "#F1595C",
                },
              },
            },
            xaxis: {
              type: "datetime",
              // type: "string",
              labels: {
                style: {
                  colors: isDark ? "#CBD5E1" : "#475569",
                  fontFamily: "Inter",
                },
              },
              axisBorder: {
                show: false,
              },
              axisTicks: {
                show: false,
              },
            },
            legend: {
              labels: {
                colors: "#CBD5E1",
                useSeriesColors: false
              },
              position: 'bottom',
            },
            fill: {
              opacity: [0.85, 0.25, 1],
              gradient: {
                inverseColors: false,
                shade: "light",
                type: "vertical",
                opacityFrom: 0.85,
                opacityTo: 0.55,
                stops: [0, 100, 100, 100],
              },
            },
            grid: {
              show: true,
              borderColor: isDark ? "#334155" : "#e2e8f0",
              position: "back",
            },
            yaxis: [{
              min: stockGraph.minStock,
              max: stockGraph.maxStock,
              tooltip: {
                enabled: true,
              },
              labels: {
                formatter: function (value) {
                  return `$${parseInt(value)}`;
                },
                style: {
                  colors: isDark ? "#CBD5E1" : "#475569",
                  fontFamily: "Inter",
                },
              },
            },
            {
              max: stockGraph.maxVolume * 3,
              opposite: true,
              labels: {
                formatter: function (value) {
                  return convertToInternationalCurrencySystem(value);
                },
                style: {
                  colors: isDark ? "#CBD5E1" : "#475569",
                  fontFamily: "Inter",
                },
              },
            }
            ],
            colors: ["#4669FA", "#50C793"],
          }}
            series={[
              {
                name: "Stocks",
                type: "candlestick",
                data: stockGraph?.stocks,
              },
              {
                name: "Volumes",
                type: "area",
                data: stockGraph?.volumes,
              },
              // {
              //   name: "Line",
              //   type: "line",
              //   data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
              // },
            ]} height={height} />
        </>
      }
    </div>
  );
};

export default TradingChart;
