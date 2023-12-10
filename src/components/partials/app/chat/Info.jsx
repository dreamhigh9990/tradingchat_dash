import React, { useEffect, useRef, useState } from "react";
import SimpleBar from "simplebar-react";
import { useSelector } from "react-redux";
import Icon from "@/components/ui/Icon";
import { useChatContext } from "@/context/chatContext";
import Avatar from "@/components/Avatar";

const socials = [
  {
    name: "facebook",
    icon: "bi:facebook",
    link: "#",
  },
  {
    name: "twitter",
    link: "#",
    icon: "bi:twitter",
  },
  {
    name: "instagram",
    link: "#",
    icon: "bi:instagram",
  },
];

const Info = () => {
  const { selectedChat, users } = useChatContext();
  // const { activechat, user } = useSelector((state) => state.chat);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (users && selectedChat?.uid) {
      setUser(users[selectedChat?.uid])
    }
  }, [users, selectedChat]);

  return (
    <SimpleBar className="h-full p-6">
      <h4 className="text-xl text-slate-900 font-medium mb-8">About</h4>
      <Avatar size="xx-large" user={user} />
      <div className="text-center mt-4">
        <h5 className="text-base text-slate-600 dark:text-slate-300 font-medium mb-1">
          {user?.displayName}
        </h5>
        <h6 className="text-xs text-slate-600 dark:text-slate-300 font-normal">
          {user?.email}
        </h6>
      </div>
      {/* <ul className="list-item mt-5 space-y-4 border-b border-slate-100 dark:border-slate-700 pb-5 -mx-6 px-6">
        <li className="flex justify-between text-sm text-slate-600 dark:text-slate-300 leading-[1]">
          <div className="flex space-x-2 items-start rtl:space-x-reverse">
            <Icon
              icon="heroicons-outline:location-marker"
              className="text-base"
            />
            <span>Location</span>
          </div>
          <div className="font-medium">USA</div>
        </li>
        <li className="flex justify-between text-sm text-slate-600 dark:text-slate-300 leading-[1]">
          <div className="flex space-x-2 items-start rtl:space-x-reverse">
            <Icon icon="heroicons-outline:user" className="text-base" />
            <span>Members since</span>
          </div>
          <div className="font-medium">Aug 2023</div>
        </li>
        <li className="flex justify-between text-sm text-slate-600 dark:text-slate-300 leading-[1]">
          <div className="flex space-x-2 items-start rtl:space-x-reverse">
            <Icon icon="heroicons-outline:translate" className="text-base" />
            <span>Language</span>
          </div>
          <div className="font-medium">English</div>
        </li>
      </ul>
      <ul className="list-item space-y-3 border-b border-slate-100 dark:border-slate-700 pb-5 -mx-6 px-6 mt-5">
        {socials?.map((slink, sindex) => (
          <li
            key={sindex}
            className="text-sm text-slate-600 dark:text-slate-300 leading-[1]"
          >
            <button className="flex space-x-2 rtl:space-x-reverse">
              <Icon icon={slink.icon} className="text-base" />
              <span className="capitalize font-normal text-slate-600 dark:text-slate-300">
                {slink.name}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <h4 className="py-4 text-sm text-secondary-500 dark:text-slate-300 font-normal">
        Shared Files
      </h4>
      <ul className="grid grid-cols-3 gap-2">
        <li className="h-[46px]">
          <img
            src={"/assets/images/chat/sd1.png"}
            alt=""
            className="w-full h-full object-cover rounded-[3px]"
          />
        </li>
        <li className="h-[46px]">
          <img
            src={"/assets/images/chat/sd2.png"}
            alt=""
            className="w-full h-full object-cover rounded-[3px]"
          />
        </li>
        <li className="h-[46px]">
          <img
            src={"/assets/images/chat/sd3.png"}
            alt=""
            className="w-full h-full object-cover rounded-[3px]"
          />
        </li>
        <li className="h-[46px]">
          <img
            src={"/assets/images/chat/sd4.png"}
            alt=""
            className="w-full h-full object-cover rounded-[3px]"
          />
        </li>
        <li className="h-[46px]">
          <img
            src={"/assets/images/chat/sd5.png"}
            alt=""
            className="w-full h-full object-cover rounded-[3px]"
          />
        </li>
        <li className="h-[46px]">
          <img
            src={"/assets/images/chat/sd6.png"}
            alt=""
            className="w-full h-full object-cover rounded-[3px]"
          />
        </li>
      </ul> */}
    </SimpleBar>
  );
};

export default Info;
