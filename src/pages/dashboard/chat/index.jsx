"use client";

import React, { useEffect, useState, useRef } from "react";
import useWidth from "@/hooks/useWidth";
import { useSelector, useDispatch } from "react-redux";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import MyProfile from "@/components/partials/app/chat/MyProfile";
import Contacts, { GroupItem, RoomUser } from "@/components/partials/app/chat/Contacts";
import Chat from "@/components/partials/app/chat/Chat";
import Blank from "@/components/partials/app/chat/Blank";
import Info from "@/components/partials/app/chat/Info";

import {
  toggleMobileChatSidebar,
  setContactSearch,
} from "@/components/partials/app/chat/store";
import { useAuth } from "@/context/authContext";
import { useChatContext } from "@/context/chatContext";

import {
  Timestamp,
} from "firebase/firestore";
import UsersPopup from "@/components/partials/app/chat/UsersPopup";
import CreateRoom from "@/components/partials/app/chat/CreateRoom";
import TradingInfo from "@/components/partials/app/chat/TradingInfo";

const buttons = [
  {
    title: "Groups",
    icon: "heroicons-outline:user-group",
  },
  {
    title: "Chats",
    icon: "heroicons-outline:chat",
  },
];

const ChatPage = () => {
  const { width, breakpoints } = useWidth();
  const dispatchRedux = useDispatch();
  const { activechat, openinfo, mobileChatSidebar, contacts, searchContact } =
    useSelector((state) => state.chat);

  /// Chat Context

  const [userPopup, setUserPopup] = useState(false);
  const [createRoom, setCreateRoom] = useState(false);

  const { currentUser } = useAuth();
  const {
    chats,
    selectedChat,
    users,
    channelList,
    selectedRoom,
    isRoom,
    setIsRoom,
    unreadMsgs,
    handleSelect,
    handleRoom,
  } = useChatContext();

  const filteredChats = Object.entries(chats || {})
    .filter(([, chat]) => !chat?.hasOwnProperty("chatDeleted"))
    .filter(([, chat]) =>
      chat?.userInfo?.displayName.toLowerCase().includes(searchContact.toLowerCase()) || chat?.lastMessage?.text.toLowerCase().includes(searchContact.toLowerCase())).sort((a, b) => b[1].date - a[1].date);

  const filteredGroups = channelList
    .filter(group =>
      group?.channelName.toLowerCase().includes(searchContact.toLowerCase()) && ((!group?.blocks?.includes(currentUser.uid)) || currentUser.uid == group.creator)); //.sort((a, b) => b[1].date - a[1].date);

  const groupUsers = Object.keys(selectedRoom?.typing || {}).map(_userId => users[_userId]);
  const unReadPersonalMsgCount = Object.keys(unreadMsgs).length || 0;

  return (
    <div className="flex lg:space-x-5 chat-height overflow-hidden relative rtl:space-x-reverse">
      <div className={`transition-all duration-150 flex-none min-w-[260px] 
        ${width < breakpoints.lg ? "absolute h-full top-0 md:w-[260px] w-[200px] z-[999]" : "flex-none min-w-[260px]"}
        ${width < breakpoints.lg && mobileChatSidebar ? "left-0 " : "-left-full "} `} >
        <Card bodyClass=" relative p-0 h-full overflow-hidden " className="h-full bg-white">
       
          <div className="border-b border-slate-100 dark:border-slate-700 py-2 flex items-center justify-center text-xs gap-16">
            <button onClick={() => setIsRoom(true)} type="button" className={`group hover:text-primary ${isRoom ? "text-slate-300" : "text-slate-500"}`}>
              <span className={` relative cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center mb-1
                        ${isRoom ? "text-primary-500" : "dark:text-white text-slate-900"} `}>
                <Icon icon="heroicons-outline:user-group" />
                {/* <span className="absolute right-[0px] lg:top-0 -top-2 h-4 w-4 bg-red-500 text-[8px] font-semibold flex flex-col items-center justify-center rounded-full text-white z-[99]">2</span> */}
              </span>
              <span className={` block text-[11px] ${isRoom ? "text-primary-500" : "text-slate-600 dark:text-slate-300"} `}>
                Rooms </span>
            </button>
            <button onClick={() => setIsRoom(false)} type="button" className={`group hover:text-primary  ${isRoom ? "text-slate-500" : "text-slate-300"}`}>
              <span className={` relative cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center mb-1
                        ${!isRoom ? "text-primary-500" : "dark:text-white text-slate-900"} `}>
                <Icon icon="heroicons-outline:chat" />
                {(unReadPersonalMsgCount > 0) &&
                  <span className="absolute right-[0px] lg:top-0 -top-2 h-4 w-4 bg-red-500 text-[8px] font-semibold flex flex-col items-center justify-center rounded-full text-white z-[99]">{unReadPersonalMsgCount}</span>
                }
              </span>
              <span className={` block text-[11px] ${!isRoom ? "text-primary-500" : "text-slate-600 dark:text-slate-300"} `}>
                Dash </span>
            </button>
          </div>
        
          <div className="contact-height">
            {(!isRoom) ?
              <div className="overflow-y-auto scrollbar">
                {Object.keys(users || {}).length > 0 &&
                  filteredChats?.map((chat) => {
                    const timestamp = new Timestamp(chat[1].date?.seconds, chat[1].date?.nanoseconds);
                    const date = timestamp.toDate();
                    const user = users[chat[1].userInfo.uid];
                    const contact = {
                      chatId: chat[0],
                      user,
                      lastmessage: chat[1].lastMessage?.text || (chat[1].lastMessage?.img && "image") || "Send first message",
                      unredmessage: unreadMsgs?.[chat[0]],
                      date,
                    }
                    if (!user) {
                      return '';
                    } else {
                      return <Contacts key={chat[0]} contact={contact} handleSelect={handleSelect} isSelected={selectedChat && selectedChat.uid === user.uid} />
                    }
                  })}
              </div>
              : <>
                <div className="h-[165px] overflow-y-auto scrollbar">
                  {
                    ((channelList || []).length > 0 &&
                      filteredGroups?.map((chat) => {
                        if (!chat) {
                          return '';
                        } else {
                          return <GroupItem key={chat.id} group={{ chatId: chat.id, channelName: chat.channelName, room: chat }} handleSelect={handleRoom} isSelected={selectedRoom && selectedRoom.id === chat.id} />
                        }
                      }))
                  }
                </div>
                <div className="border-b border-slate-100 dark:border-slate-700 py-1">
            
          </div><div className=" roomuser-height overflow-y-auto border-t-2 border-slate-100 dark:border-slate-700 h-full">
                  {
                    ((channelList || []).length > 0 &&
                      groupUsers?.map((_user) => {
                        if (!_user) {
                          return '';
                        } else {
                          return <RoomUser key={`${selectedRoom.id}-${_user.uid}`} user={_user} room={selectedRoom} currentUser={currentUser} />
                        }
                      }))
                  }
                </div>
              </>
            }
          </div>
         
        </Card>
      </div>

      {/* overlay */}
      {width < breakpoints.lg && mobileChatSidebar && (
        <div className="overlay bg-slate-900 dark:bg-slate-900 dark:bg-opacity-60 bg-opacity-60 backdrop-filter
         backdrop-blur-sm absolute w-full flex-1 inset-0 z-[99] rounded-md" onClick={() => dispatchRedux(toggleMobileChatSidebar(!mobileChatSidebar))}
        ></div>
      )}

      {/* mai  chat box*/}
      <div className="flex-1">
        <div className="parent flex space-x-5 h-full rtl:space-x-reverse">
          {/* main message body*/}
          <div className="flex-1">
            <Card bodyClass="p-0 h-full" className="h-full bg-white">
              {((activechat && selectedChat?.uid && !isRoom) || (activechat && selectedRoom?.id && isRoom)) ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-700 h-full">
                  <Chat />
                </div>
              ) : (<Blank />)}
            </Card>
          </div>
          {/* right side information*/}
          {width > breakpoints.lg && openinfo && activechat && (!isRoom) && (
            <div className="flex-none w-[285px]">
              <Card bodyClass="p-0 h-full" className="h-full bg-white">
                <Info />
              </Card>
            </div>
          )}
          {width > breakpoints.lg && !openinfo && (
            <div className="flex-none w-[285px]">
              <Card bodyClass="p-0 h-full" className="h-full bg-white">
                <TradingInfo />
              </Card>
            </div>
          )}
        </div>
      </div>
      {userPopup && <UsersPopup userPopup={userPopup} setUserPopup={setUserPopup} title='Find User' />}
      {createRoom && <CreateRoom open={createRoom} setOpen={setCreateRoom} title='Create A New Room' />}
    </div>
  );
};

export default ChatPage;
