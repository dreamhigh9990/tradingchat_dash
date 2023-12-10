import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setCompanyNews, setFilter, setNews, setSymbols } from "@/components/partials/app/stocks/store";
import { getCompanyNews, getNews, getSymbols } from "@/libs/finnhub";
import { Icon } from "@iconify/react";
import moment from "moment";
import { Loader } from "@/components/ui/AppLoader";

const News = ({ className, newsClass }) => {
  const { news, companyNews, symbols, symbolSearch } = useSelector((state) => state.stocks);
  const [searchInput, setSearchInput] = useState(symbolSearch);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errSymbol, setErrSymbol] = useState("");
  const [suggestSymbol, setSuggestSymbol] = useState("");

  useEffect(() => {
    const unsubscribe = async () => {
      if (news.length == 0) {
        const _news = await getNews();
        dispatch(setNews(_news));
      }
      if (symbols.length == 0) {
        setLoading(true);
        try {
          const _symbols = await getSymbols();
          dispatch(setSymbols(_symbols));
        } catch (_ex) {
          console.log(`news error - ${_ex}`)
        } finally {
          setLoading(false);
        }
      }
    };
    // return () => unsubscribe();
    unsubscribe();
  }, []);

  const getCompany = async () => {
    if (searchInput !== symbolSearch) {
      setLoading(true);
      try {
        dispatch(setFilter(searchInput));
        const _cNews = await getCompanyNews(searchInput);
        dispatch(setCompanyNews(_cNews));
      } catch (_ex) {
        console.log(`news error - ${_ex}`)
      } finally {
        setLoading(false);
      }
    }
  }

  const onKeyUp = async (e) => {
    if (e.key === "Enter" && !!searchInput) {
      try {
        e.target.blur();
        const list = symbols.filter(_item => _item.symbol == searchInput);
        if (list && list.length > 0) {
          await getCompany();
        } else {
          setErrSymbol("It is not a known symbol.");
        }
      } catch (error) {
        console.error(error);
        setErrSymbol(error);
      }
    }
  };

  const updateSearch = (_searchInput) => {
    setSearchInput(_searchInput.toUpperCase(), false);
    if (_searchInput.length >= 2 && symbols.length > 0) {
      const _suggested = symbols.filter(_item => _item.symbol?.includes(_searchInput.toUpperCase())).map(_item => _item.symbol).join();
      setSuggestSymbol(_suggested);
    } else {
      setSuggestSymbol("");
    }
    if (errSymbol) {
      setErrSymbol("");
    }
  }

  const printData = () => {
    console.log({ news, companyNews, symbols })
  }

  return (
    <div className={className}>
      <div className="border-b border-slate-400 dark:border-slate-700 py-1">
        <div className="search px-3 mx-6 rounded flex items-center space-x-3 rtl:space-x-reverse">
          <div className="flex-none text-base text-slate-300 dark:text-slate-400">
            <Icon icon="bytesize:search" />
          </div>
          <input
            type="text"
            placeholder="Search here..."
            onChange={(e) => updateSearch(e.target.value)}
            onKeyUp={onKeyUp}
            value={searchInput}
            autoFocus
            className="w-full flex-1 block bg-transparent placeholder:font-normal placeholder:text-slate-400 py-2 focus:ring-0 focus:outline-none dark:text-slate-200 dark:placeholder:text-slate-400 rounded-xl"
          />
          {/* <div onClick={printData}
            className="inline-flex btn btn-md whitespace-nowrap space-x-2 rtl:space-x-reverse cursor-pointer bg-white dark:bg-slate-800 dark:text-slate-300 btn-md h-min w-min text-sm font-normal text-slate-900">
            <span className="text-lg">
              <Icon icon="heroicons:calendar" />
            </span>
            <span>Get Stock Data</span>
          </div> */}
        </div>
        <div className="flex items-center justify-center w-full flex-col">
          {suggestSymbol && <span className="text-slate-300 break-all">{suggestSymbol}</span>}
          {errSymbol && <span className="text-red-500">{errSymbol}</span>}
        </div>
      </div>
      {loading && <Loader />}
      <div className={`divide-y divide-slate-100 dark:divide-slate-700 mt-1 -mx-6 -mb-6 msgs overflow-y-auto ${newsClass ? newsClass : "news-height"} overflow-x-auto scrollbar`}>
        {((searchInput && companyNews.length > 0) ? companyNews : news)?.map((item, i) => (
          <div key={i}>
            <Link
              href={item.url} target="_blank"
              className="hover:bg-slate-100 dark:hover:bg-slate-600 dark:hover:bg-opacity-70 hover:text-slate-800 text-slate-600 dark:text-slate-300 block w-full px-4 py-3 text-sm mb-2 last:mb-0 cursor-pointer"
            >
              <div className="flex ltr:text-left rtl:text-right">
                <div className="flex-none ltr:mr-3 rtl:ml-3 flex items-center ">
                  <div className="h-8 w-8 bg-white dark:bg-slate-700 rounded-full ">
                    {/* <span
                      className={`${item.active ? "bg-secondary-500" : "bg-success-500"
                        } w-[10px] h-[10px] rounded-full border border-white dark:border-slate-700  inline-block absolute right-0 top-0`}
                    ></span> */}
                    <img
                      src={item.image}
                      alt=""
                      className="block w-full h-full object-cover rounded-full border hover:border-white border-transparent"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-slate-800 dark:text-slate-300 text-sm font-medium mb-1`">
                    {(item.headline.length > 50) ? item.headline.slice(0, 50) + "..." : item.headline}
                  </div>
                  <div className="flex mt-1 justify-between">
                    <div className="text-slate-400 dark:text-slate-400 text-xs mt-1">
                      {moment(item.datetime * 1000).format("MM/DD/YY hh:mm")}
                    </div>
                    {item.source && (
                      <span className="h-4 px-1 bg-danger-500 border border-none rounded-md text-[10px] flex items-center justify-center text-white " >
                        {item.source}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
