import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleMobileChatSidebar, infoToggle, condenseToggle } from "./store";
import useWidth from "@/hooks/useWidth";
import Icon from "@/components/ui/Icon";
import { useChatContext } from "@/context/chatContext";
import Avatar from "@/components/Avatar";
import DropdownAction from "@/components/ui/DropdownAction";
import { useAuth } from "@/context/authContext";
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc, } from "firebase/firestore";
import { db } from "@/configs/firebase";

function ChatHeader() {
    const { width, breakpoints } = useWidth();
    const dispatchRedux = useDispatch();
    const { openinfo, condense } = useSelector((state) => state.chat);

    const { data, users, dispatch, chats, setSelectedChat, isRoom, selectedRoom } = useChatContext();
    const user = users[data?.user?.uid];
    const { currentUser } = useAuth();

    const isUserBlocked = users[currentUser.uid]?.blockedUsers?.find(
        (u) => u === currentUser?.uid
    );

    const IamBlocked = users[data?.user?.uid]?.blockedUsers?.find(
        (u) => u === currentUser?.uid
    );

    const handleBlock = async (type) => {
        if (type === "block") {
            await updateDoc(doc(db, "users", currentUser.uid), {
                blockedUsers: arrayUnion(data.user.uid),
            });
        }
        if (type === "unblock") {
            await updateDoc(doc(db, "users", currentUser.uid), {
                blockedUsers: arrayRemove(data.user.uid),
            });
        }
    };
    const handleDelete = async () => {
        try {
            const chatRef = doc(db, "chats", data.chatId);

            // Retrieve the chat document from Firestore
            const chatDoc = await getDoc(chatRef);

            // Create a new "messages" array that excludes the message with the matching ID
            const updatedMessages = chatDoc.data()?.messages?.map((message) => {
                message.deleteChatInfo = {
                    ...message.deleteChatInfo,
                    [currentUser.uid]: true,
                };
                return message;
            });

            // Update the chat document in Firestore with the new "messages" array
            if (updatedMessages) {
                await updateDoc(chatRef, { messages: updatedMessages });
            }

            await updateDoc(doc(db, "userChats", currentUser.uid), {
                [data.chatId + ".chatDeleted"]: true,
            });

             const chatId = Object.keys(chats || {}).filter(
                 (id) => id !== data.chatId
             );

          
            
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <header className="border-b border-slate-100 dark:border-slate-700">
            <div className="flex py-6 md:px-6 px-3 items-center">
                <div className="flex-1">
                    <div className="flex space-x-3 rtl:space-x-reverse">
                        {width <= breakpoints.lg && (
                            <span
                                onClick={() => dispatchRedux(toggleMobileChatSidebar(true))}
                                className="text-slate-900 dark:text-white cursor-pointer text-xl self-center ltr:mr-3 rtl:ml-3"
                            >
                                <Icon icon="heroicons-outline:menu-alt-1" />
                            </span>
                        )}
                        {
                            (!isRoom) ? (<>
                                <div className="flex-none">
                                    <div className="h-10 w-10 rounded-full relative">
                                        <Avatar size="large" user={user} />
                                    </div>
                                </div>
                                <div className="flex-1 text-start">
                                    <span className="block text-slate-800 dark:text-slate-300 text-sm font-medium mb-[2px] truncate">
                                        {user?.displayName}
                                    </span>
                                    <span className="block text-slate-500 dark:text-slate-300 text-xs font-normal">
                                        {!(user?.isOnline) ? "Offline" : "Active now"}
                                    </span>
                                </div>
                            </>)
                                : (<>
                                    <div className="flex-1 text-start">
                                        <span className="block text-slate-800 dark:text-slate-300 text-base font-medium mb-[2px] truncate">
                                            #{selectedRoom?.channelName}
                                        </span>
                                    </div>
                                </>)
                        }
                    </div>
                </div>
                {(!isRoom) ?
                    <div className="flex-none flex md:space-x-3 space-x-1 items-center rtl:space-x-reverse">
                        {/* <div className="msg-action-btn">
                        <Icon icon="heroicons-outline:phone" />
                    </div>
                    <div className="msg-action-btn">
                        <Icon icon="heroicons-outline:video-camera" />
                    </div> */}
                        <div className="msg-action-btn" onClick={() => dispatchRedux(condenseToggle(!condense))}>
                            {(condense) ? <Icon icon="ic:sharp-expand" />
                                : <Icon icon="ic:sharp-compress" />}
                        </div>
                        <DropdownAction
                            classMenuItems=" w-[112px] right-0 top-[40px]  "
                            classItem="cursor-pointer px-4 py-2"
                            items={!IamBlocked ? [{
                                label: isUserBlocked ? "Unblock" : "Block user", action: () => {
                                    handleBlock(isUserBlocked ? "unblock" : "block");
                                }
                            },
                            {
                                label: "Delete Chat", action: () => { handleDelete(); }
                            }] : [{ label: "Delete Chat", action: () => { handleDelete(); } }]}
                            label={
                                <div className="msg-action-btn">
                                    <Icon icon="heroicons-outline:dots-horizontal" />
                                </div>
                            }
                        />
                        <div className="msg-action-btn" onClick={() => dispatchRedux(infoToggle(!openinfo))}>
                            <Icon icon="heroicons-outline:identification" />
                        </div>
                    </div>
                    : <div className="flex-none flex md:space-x-3 space-x-1 items-center rtl:space-x-reverse">
                        <div className="msg-action-btn" onClick={() => dispatchRedux(condenseToggle(!condense))}>
                            {(condense) ? <Icon icon="ic:sharp-expand" />
                                : <Icon icon="ic:sharp-compress" />}
                        </div>
                    </div>
                }
            </div>
        </header>
    )
}

export default ChatHeader
