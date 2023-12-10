'use client'

import React, { useState, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import Icon from "@/components/ui/Icon";
// import { CgAttachmentIcon, HiOutlineEmojiHappyIcon, IoCloseIcon, MdDeleteForeverIcon } from "../Icons";
import Image from "next/image";
import Composebar from "./Composebar";
import { useChatContext } from "@/context/chatContext";
import DropdownAction from "@/components/ui/DropdownAction";
import Dropdown from "@/components/ui/Dropdown";

function ChatFooter() {
    const {
        inputText,
        setInputText,
        data,
        editMsg,
        setEditMsg,
        isTyping,
        setAttachment,
        attachmentPreview,
        setAttachmentPreview,
        isRoom,
    } = useChatContext();

    useEffect(() => {
        setInputText(editMsg?.text || "");
    }, [editMsg, setInputText]);

    const onEmojiClick = (emojiData, event) => {
        // console.log(emojiData, event);
        let text = inputText;
        setInputText((text += emojiData.emoji));
    };

    const onFileChange = (e) => {
        const file = e.target.files[0];
        setAttachment(file);

        if (file) {
            const blobUrl = URL.createObjectURL(file);
            setAttachmentPreview(blobUrl);
        }
    };
    return (
        <footer className="md:px-4 px-2 flex space-x-1 rtl:space-x-reverse border-t md:pt-7 pt-7 border-slate-100 dark:border-slate-700 relative items-center ">
            {/* <div className="flex space-x-1 rtl:space-x-reverse"> */}
            {attachmentPreview && (
                <div className="absolute max-w-[200px] max-h-[200px] bottom-20 left-0 bg-slate-200 dark:bg-slate-900/50 p-2 rounded-md">
                    <Image
                        src={attachmentPreview}
                        alt=""
                        width={200}
                        height={200}
                        quality={100}
                        className="max-w-[180px] object-contain max-h-[180px] rounded-md"
                    />
                    <div
                        className="w-6 h-6 rounded-full bg-red-500 flex justify-center items-center absolute -right-2 -top-2 cursor-pointer"
                        onClick={() => {
                            setAttachment(null);
                            setAttachmentPreview(null);
                        }}
                    >
                        <Icon icon="heroicons-outline:x" />
                    </div>
                </div>
            )}
            <div className="h-8 w-8 cursor-pointer bg-slate-100 dark:bg-slate-900 dark:text-slate-400 flex flex-col justify-center items-center text-xl rounded-full">
                <input
                    type="file"
                    id="fileUploader"
                    className="hidden"
                    onChange={onFileChange}
                />
                <label htmlFor="fileUploader">
                    <Icon icon="heroicons-outline:link" className="cursor-pointer" />
                </label>
            </div>

            <Dropdown
                classMenuItems=" w-[100px] left-0 top-0 border-none "
                label={
                    <div className="h-8 w-8 cursor-pointer bg-slate-100 dark:bg-slate-900 dark:text-slate-400 flex flex-col justify-center items-center text-xl rounded-full">
                        <Icon icon="heroicons-outline:emoji-happy" />
                    </div>
                }>
                <div className="absolute bottom-8 -left-10 shadow-lg">
                    <EmojiPicker
                        emojiStyle="native"
                        theme="dark"
                        onEmojiClick={onEmojiClick}
                        autoFocusSearch={false}
                    />
                </div>
            </Dropdown>
            {/* </div> */}

            {
                (isTyping && !isRoom) && (
                    <div className="absolute top-0.5 left-4 w-full h-6">
                        <div className="flex gap-2 w-full h-full opacity-50 text-sm text-white">
                            {`${data.user.displayName} is typing`}
                            <Image src="/typing.svg" alt={`${data?.user?.displayName} is typing`} width={20} height={20} />
                        </div>
                    </div>
                )
            }

            {
                editMsg && (
                    <div
                        className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-100 dark:bg-slate-700 flex items-center gap-2 py-2 px-4 pr-2 rounded-full text-sm font-semibold cursor-pointer shadow-lg"
                        onClick={() => setEditMsg(null)}
                    >
                        <span>Cancel edit</span>
                        <Icon icon="heroicons-outline:x" />
                    </div>
                )
            }
            <Composebar />
        </footer >
    )
}

export default ChatFooter
