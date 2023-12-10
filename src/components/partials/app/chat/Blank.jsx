import React from "react";
import { useSelector, useDispatch } from "react-redux";
import useWidth from "@/hooks/useWidth";
import { toggleMobileChatSidebar } from "./store";

const Blank = () => {
  const { width, breakpoints } = useWidth();
  const dispatch = useDispatch();
  return (
    <div className="h-full flex flex-col items-center text-center xl:space-y-2 space-y-6">
      <img src="/assets/images/svg/blank.svg" alt="" />
      <h4 className="text-2xl text-slate-600 dark:text-slate-300 font-medium">
        Pick a <span className="text-2xl  dark:text-blue-300 font-medium">
        room</span> from the list<br></br>
        to get started!
      </h4>

      <p className="text-md text-slate-500 lg:pt-0 pt-4">
        {width > breakpoints.lg ? (
          <span>
            {"Don't"} worry, just take a deep breath, pick a chat<br></br>
            from the <h3 className="text-2xl  dark:text-blue-300 font-medium">
        channel</h3> list and start your journey!<br></br> 
            <br></br>
            {""}
          </span>
        ) : (
          <span
            className="btn btn-dark cursor-pointer"
            onClick={() => dispatch(toggleMobileChatSidebar(true))}
          >
            Start Conversation
          </span>
        )}
      </p>
    </div>
  );
};

export default Blank;
