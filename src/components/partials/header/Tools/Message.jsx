import React from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import Link from "next/link";
import { Menu } from "@headlessui/react";
import { LINKS } from "@/constant/links";
import { Timestamp } from "firebase/firestore";
import Avatar from "@/components/Avatar";
import { useChatContext } from "@/context/chatContext";
import { formatDate } from "@/constant/constants";
import { useDispatch } from "react-redux";
import { openChat } from "../../app/chat/store";
import { useRouter } from "next/navigation";

const messagelabel = (unReadPersonalMsgCount) => {
  return (
    <span className="relative lg:h-[32px] lg:w-[32px] lg:bg-slate-100 lg:dark:bg-slate-900 dark:text-white text-slate-900 cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center">
      <Icon icon="heroicons-outline:mail" />
      {(unReadPersonalMsgCount > 0) &&
        <span className="absolute lg:right-0 lg:top-0 -top-2 -right-2 h-4 w-4 bg-red-500 text-[8px] font-semibold flex flex-col items-center justify-center rounded-full text-white z-[99]">
          {unReadPersonalMsgCount}
        </span>
      }
    </span>
  );
};

const Message = () => {
  const {
    chats,
    users,
    unreadMsgs,
    setIsRoom,
    handleSelect,
  } = useChatContext();
  const dispatch = useDispatch();
  const router = useRouter();

  const filteredChats = Object.entries(chats || {})
    .filter(([, chat]) => !chat?.hasOwnProperty("chatDeleted")).sort((a, b) => b[1].date - a[1].date);
  const newMessage = filteredChats.slice(0, Math.min(4, filteredChats.length));
  const unReadPersonalMsgCount = Object.keys(unreadMsgs).length || 0;

  return (
    <Dropdown
      classMenuItems="md:w-[335px] w-min top-[58px]"
      label={messagelabel(unReadPersonalMsgCount)}
    >
      <div className="flex justify-between px-4 py-4 border-b border-slate-100 dark:border-slate-600">
        <div className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-6">
          Messages
        </div>
        <div className="text-slate-800 dark:text-slate-200 text-xs md:text-right">
          <Link href={LINKS.CHAT.ROUTE} className="underline">
            View all
          </Link>
        </div>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {Object.keys(users || {}).length > 0 && newMessage?.map((chat, i) => {
          const timestamp = new Timestamp(chat[1].date?.seconds, chat[1].date?.nanoseconds);
          const date = timestamp.toDate();
          const user = users[chat[1].userInfo.uid];
          const lastmessage = chat[1].lastMessage?.text || (chat[1].lastMessage?.img && "image") || "Send first message";
          const unredmessage = unreadMsgs?.[chat[0]];
          if (!user) {
            return '';
          } else {
            return <Menu.Item key={chat[0]}>
              {({ active }) => (
                <div onClick={() => {
                  dispatch(openChat({ contact: user, activechat: true, }));
                  handleSelect(user, chat[0]);
                  setIsRoom(false);
                  router.push(LINKS.CHAT.ROUTE);
                }}
                  className={`${active
                    ? "bg-slate-100 text-slate-800 dark:bg-slate-600 dark:bg-opacity-70"
                    : "text-slate-600 dark:text-slate-300"
                    } block w-full px-4 py-2 text-sm  cursor-pointer`}
                >
                  <div className="flex ltr:text-left rtl:text-right space-x-3 rtl:space-x-reverse">
                    <div className="flex-none">
                      <Avatar size="large" user={user} />
                    </div>
                    <div className="flex-1">
                      <div className="text-slate-800 dark:text-slate-300 text-sm font-medium mb-1`">
                        {user?.displayName}
                      </div>
                      <div className="text-xs hover:text-[#68768A] text-slate-600 dark:text-slate-300 mb-1">
                        {(lastmessage.length > 15) ? lastmessage.slice(0, 35) + "..." : lastmessage}
                      </div>
                      <div className="text-slate-400 dark:text-slate-400 text-xs">
                        {formatDate(date)}
                      </div>
                    </div>
                    {unredmessage > 0 && (
                      <div className="flex-0">
                        <span className="h-4 w-4 bg-danger-500 border border-white rounded-full text-[10px] flex items-center justify-center text-white">
                          {unredmessage}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Menu.Item>
          }
        })}
      </div>
    </Dropdown>
  );
};

export default Message;
