'use client'

import React, { useRef, useState } from 'react'
import { Timestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { useChatContext } from '@/context/chatContext';
import { useAuth } from '@/context/authContext';
import { DELETED_FOR_EVERYONE, DELETED_FOR_ME, formatDate, wrapEmojisInHtmlTag } from '@/constant/constants';
import { db } from '@/configs/firebase';
import Avatar from '@/components/Avatar';
import Dropdown from '@/components/ui/Dropdown';
import Icon from "@/components/ui/Icon";
import DropdownAction from '@/components/ui/DropdownAction';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import ModalNew from '@/components/ui/ModalNew';
import { useSelector } from 'react-redux';



const time = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const hours12 = hours % 12 || 12;
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    return hours12 + ":" + minutesStr + " " + ampm;
};


function Message({ message, openModal }) {
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const { users, data, setEditMsg, imageViewer, setImageViewer, selectedRoom, isRoom } = useChatContext();
    const { currentUser } = useAuth();
    const [showMenu, setShowMenu] = useState(false);
    const { condense } = useSelector((state) => state.chat);
    
    const self = message.sender === currentUser.uid;
    const sender = self ? currentUser : users[message.sender];
    const isAdmin = (sender?.role == "admin") ? true : false;
    const admin = (currentUser?.role == "admin") ? true : false;
    const regUser = currentUser.role !== "admin" || currentUser !== self;
    const ref = useRef();

    const timestamp = new Timestamp(
        message.date?.seconds,
        message.date?.nanoseconds
    );
    const date = timestamp.toDate();

    const deletePopupHandler = () => {
        setShowDeletePopup(true);
        setShowMenu(false);
    };

    const deleteMessage = async (action) => {
        try {
            const _ID = message.id;
            const chatRef = (!isRoom) ? doc(db, "chats", data?.chatId, "messages", message.id)
                : doc(db, "channels", selectedRoom?.id, "messages", message.id);

            switch (true) {
                case message.id === _ID && action === DELETED_FOR_ME:
                    message.deletedInfo = {
                        [currentUser.uid]: DELETED_FOR_ME,
                    };
                    break;
                case message.id === _ID && action === DELETED_FOR_EVERYONE:
                    message.deletedInfo = {
                        deletedForEveryone: true,
                    };
                    break;

                default:
                    break;
            }

            // Update the chat document in Firestore with the new "messages" array
            await updateDoc(chatRef, { deletedInfo: message.deletedInfo });
        } catch (err) {
            console.error(err);
        }
    }

    return ( 
        /* below here colors every displayname */
        <div className="block md:px-4 px-2 ">
            {showDeletePopup && (
                <ModalNew
                    activeModal={showDeletePopup}
                    title="Warning"
                    labelClass="btn-outline-dark"
                    onClose={() => setShowDeletePopup(false)}
                    centered
                    footerContent={
                        <div className="flex items-center justify-center gap-4 w-full flex-col md:flex-row">
                            <Button
                                text="Delete for me"
                                className="btn-dark text-red-400 w-48"
                                onClick={() => deleteMessage(DELETED_FOR_ME)}
                            />
                            {self || admin && <Button
                                text="Delete for everyone"
                                className="btn-dark text-red-400 w-48"
                                onClick={() => deleteMessage(DELETED_FOR_EVERYONE)}
                            />}
                            <Button
                                text="Cancel"
                                className="btn-dark text-gray-200 w-48"
                                onClick={() => setShowDeletePopup(false)}
                            />
                        </div>
                    }
                >Are you sure, you want to delete message?</ModalNew>
            )}
            {(condense) ? <>
                <div className="flex space-x-1 items-start group rtl:space-x-reverse">
                    
                        <span className="font-normal text-xs text-slate-400 dark:text-slate-400">
                            {formatDate(date)}
                        </span>
                    
                    
                        
                            {(self) ? <span className={"font-normal text-xs text-green-400"}>{sender?.displayName}</span>
                            :   
                            (isAdmin) ? <span className={"font-normal text-xs text-yellow-400"}>{sender?.displayName}</span>
                               
                            :(regUser) ? <span className={"font-normal text-xs text-slate-400"}>{sender?.displayName}</span>
                            :   <span className={`font-normal text-xs `}>
                            
                                </span>}
                                
                             <div className="flex-1 flex space-x-1 rtl:space-x-reverse">
                             <div>
                                {/*post padding background color here*/}
                            <div className="px-1 bg-neutral-900 dark:bg-neutral-900 mb-1 rounded-md flex-1 whitespace-pre-wrap break-all">
                                {message.text && (
                                    <div className="text-contrent dark:text-slate-300 text-slate-600 text-sm font-normal mb-1"
                                        dangerouslySetInnerHTML={{ __html: wrapEmojisInHtmlTag(message.text), }} />)}

                            </div>
                        </div>
                        {message.img && (
                            <div>
                                <div className="px-1 bg-slate-100 dark:bg-neutral-900 mb-1 rounded-md flex-1 whitespace-pre-wrap break-all">
                                    <img src={message.img} width={'20px'} alt='image'
                                        className="rounded-xl max-w-[30px] mx-auto cursor-pointer"
                                        onClick={() => openModal({ alt: "", src: message.img, })}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                            <DropdownAction
                                classMenuItems=" w-[100px] top-0"
                                 /* allows edit removal but no post delete */
                                items={self || admin ? [{ label: "Edit", action: () => { setEditMsg(message); } },
                                { label: "Remove", action: () => { deletePopupHandler() } }]
                                    : [{ label: "Remove", action: () => { deletePopupHandler() } }]}
                                label={
                                    <div className="h-5 w-5 bg-slate-100 dark:bg-slate-600 dark:text-slate-300 text-slate-900 flex flex-col justify-center items-center text-xl rounded-full">
                                        <Icon icon="heroicons-outline:dots-horizontal" />
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </div>
            </>
                : <>
                    {!self && (
                        <div className="flex space-x-2 items-start group rtl:space-x-reverse">
                            <div className="flex-none">
                                <Avatar size="small" user={sender} className="mb-4" />
                            </div>
                            <div className="flex-1 flex space-x-4 rtl:space-x-reverse">
                                <div>
                                    {/*left uncondensed post padding bg color here*/}
                                    <div className="p-3 bg-slate-100 dark:bg-neutral-900 mb-1 rounded-md flex-1 whitespace-pre-wrap break-all">
                                        {message.text && (
                                            <div className="text-contrent dark:text-slate-300 text-slate-600 text-sm font-normal mb-1"
                                                dangerouslySetInnerHTML={{ __html: wrapEmojisInHtmlTag(message.text), }} />)}
                                        {message.img && (
                                            <img src={message.img} width={'70%'} alt='image'
                                                className="rounded-xl max-w-[250px] mx-auto cursor-pointer"
                                                onClick={() => openModal({ alt: "", src: message.img, })}
                                            />
                                        )}
                                    </div>
                                    <span className="font-normal text-xs text-slate-400 dark:text-slate-400">
                                        {formatDate(date)}
                                    </span>
                                </div>
                                <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                                    <DropdownAction
                                        classMenuItems=" w-[100px] top-0"
                                        items={[{ label: "Remove", action: () => { deletePopupHandler() } }]}
                                        label={
                                            <div className="h-8 w-8 bg-slate-100 dark:bg-slate-600 dark:text-slate-300 text-slate-900 flex flex-col justify-center items-center text-xl rounded-full">
                                                <Icon icon="heroicons-outline:dots-horizontal" />
                                            </div>
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {/* sender */}
                    {self && (
                        <div className="flex space-x-2 items-start justify-end group w-full rtl:space-x-reverse">
                            <div className="no flex space-x-4 rtl:space-x-reverse">
                                <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                                    <DropdownAction
                                        classMenuItems=" w-[100px] left-0 top-0  "
                                        items={[{
                                            label: "Edit", action: () => { setEditMsg(message); }
                                        },
                                        {
                                            label: "Remove", action: () => { deletePopupHandler() }
                                        }]}
                                        label={
                                            <div className="h-8 w-8 bg-slate-300 dark:bg-slate-900 dark:text-slate-400 flex flex-col justify-center items-center text-xl rounded-full text-slate-900">
                                                <Icon icon="heroicons-outline:dots-horizontal" />
                                            </div>
                                        }
                                    />
                                </div>
                                <div className="whitespace-pre-wrap break-all">
                                    {/*right side posts padding background color here*/}
                                    <div className="p-3 bg-slate-300 dark:bg-neutral-900 rounded-md flex-1 mb-1">
                                        {message.text && (
                                            <div className="text-contrent dark:text-slate-300 text-slate-800 text-sm font-normal mb-1"
                                                dangerouslySetInnerHTML={{ __html: wrapEmojisInHtmlTag(message.text), }} />)}
                                        {message.img && (
                                            <img src={message.img} width={'70%'} alt='image'
                                                className="rounded-xl max-w-[250px] mx-auto cursor-pointer"
                                                onClick={() => openModal({ alt: "", src: message.img, })} />
                                        )}
                                    </div>
                                    <span className="font-normal text-xs text-slate-400">{formatDate(date)}</span>
                                </div>
                            </div>
                            <div className="flex-none">
                                <Avatar size="small" user={sender} className="mb-4" />
                            </div>
                        </div>
                    )}
                    {/* me */}
                    
                </>
            }
        </div>
    )
}

export default Message
