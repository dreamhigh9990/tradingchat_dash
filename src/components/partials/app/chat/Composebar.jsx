'use client'

import Icon from "@/components/ui/Icon";
import Dropdown from "@/components/ui/Dropdown";

import React from 'react'
import { v4 as uuid } from "uuid";

import {
    Timestamp,
    addDoc,
    arrayUnion,
    collection,
    deleteField,
    doc,
    getDoc,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useAuth } from "@/context/authContext";
import { useChatContext } from "@/context/chatContext";
import { db, storage } from "@/configs/firebase";

let typingTimeout = null;

function Composebar() {

    const { currentUser } = useAuth();
    const {
        inputText,
        setInputText,
        attachment,
        setAttachment,
        setAttachmentPreview,
        data,
        editMsg,
        setEditMsg,
        isRoom,
        selectedRoom,
    } = useChatContext();

    const handleTyping = async (e) => {
        setInputText(e.target.value);
        if (isRoom) {
            await updateDoc(doc(db, "channels", selectedRoom.id), { [`typing.${currentUser.uid}`]: true, });
        } else {
            await updateDoc(doc(db, "chats", data.chatId), { [`typing.${currentUser.uid}`]: true, });
        }

        // If the user was previously typing, clear the timeout
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        // Set a new timeout for 1.5 seconds after the last keystroke
        typingTimeout = setTimeout(async () => {
            // Send a typing indicator to other users indicating that this user has stopped typing
            if (isRoom) {
                await updateDoc(doc(db, "channels", selectedRoom.id), { [`typing.${currentUser.uid}`]: false, });
            } else {
                await updateDoc(doc(db, "chats", data.chatId), { [`typing.${currentUser.uid}`]: false, });
            }

            // Reset the timeout
            typingTimeout = null;
        }, 500);
    }
    const handleSend = async () => {
        const messageRef = (!isRoom) ? collection(db, "chats", data.chatId, "messages")
            : collection(db, "channels", selectedRoom.id, "messages");

        let unreadCount = 0;
        if (!isRoom) {
            const chatDoc = await getDoc(doc(db, "chats", data.chatId));
            unreadCount = chatDoc.data().unread?.[currentUser.uid] || 0;
        }

        if (attachment) {
            const storageRef = ref(storage, uuid());
            const uploadTask = uploadBytesResumable(storageRef, attachment);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    // console.log("Upload is " + progress + "% done");
                    switch (snapshot.state) {
                        case "paused":
                            // console.log("Upload is paused");
                            break;
                        case "running":
                            // console.log("Upload is running");
                            break;
                    }
                },
                (error) => {
                    console.error(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        async (downloadURL) => {
                            await addDoc(messageRef,
                                {
                                    text: inputText.trim(),
                                    sender: currentUser.uid,
                                    date: Timestamp.now(),
                                    img: downloadURL,
                                });
                            if (!isRoom) {
                                await updateDoc(doc(db, "chats", data.chatId), {
                                    [`unread.${currentUser.uid}`]: unreadCount + 1,
                                });
                            }
                        }
                    );
                }
            );
        } else {
            await addDoc(messageRef,
                {
                    text: inputText.trim(),
                    sender: currentUser.uid,
                    date: Timestamp.now(),
                });
            if (!isRoom) {
                await updateDoc(doc(db, "chats", data.chatId), {
                    [`unread.${currentUser.uid}`]: unreadCount + 1,
                });
            }
        }

        let msg = { text: inputText.trim() };
        if (attachment) {
            msg.img = true;
        }

        if (!isRoom) {
            await updateDoc(doc(db, "userChats", currentUser.uid), {
                [data.chatId + ".lastMessage"]: msg,
                [data.chatId + ".date"]: serverTimestamp(),
            });

            await updateDoc(doc(db, "userChats", data.user.uid), {
                [data.chatId + ".lastMessage"]: msg,
                [data.chatId + ".date"]: serverTimestamp(),
                [data.chatId + ".chatDeleted"]: deleteField(),
            });
        }

        setInputText("");
        setAttachment(null);
        setAttachmentPreview(null);

    }

    const handleEdit = async () => {
        try {
            const _ID = editMsg.id;
            const chatRef = (isRoom) ? doc(db, "channels", selectedRoom.id, "messages", editMsg.id)
                : doc(db, "chats", data.chatId, "messages", editMsg.id);

            if (attachment) {
                const storageRef = ref(storage, uuid());
                const uploadTask = uploadBytesResumable(storageRef, attachment);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress =
                            (snapshot.bytesTransferred / snapshot.totalBytes) *
                            100;
                        console.log("Upload is " + progress + "% done");
                        switch (snapshot.state) {
                            case "paused":
                                console.log("Upload is paused");
                                break;
                            case "running":
                                console.log("Upload is running");
                                break;
                        }
                    },
                    (error) => {
                        console.error(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then(
                            async (downloadURL) => {
                                // Create a new "messages" array that excludes the message with the matching ID
                                await updateDoc(chatRef, {
                                    text: inputText.trim(),
                                    img: downloadURL,
                                });
                            }
                        );
                    }
                );
            } else {
                // Create a new "messages" array that excludes the message with the matching ID
                await updateDoc(chatRef, {
                    text: inputText.trim(),
                });
            }

            setInputText("");
            setAttachment(null);
            setAttachmentPreview(null);
            setEditMsg(null);
        } catch (err) {
            console.error(err);
        }
    }

    const onKeyUp = (e) => {
        if (editMsg && e.key === 'Escape') {
            setEditMsg(null);
        }

        if (e.key === "Enter" && !e.shiftKey && (inputText?.trim() || attachment)) {
            e.preventDefault();
            if (editMsg) {
                handleEdit();
            } else {
                handleSend();
            }
        }
    }


    return (
        <div className="flex-1 relative flex space-x-2 rtl:space-x-reverse items-center ">
            <div className="flex-1">
                <textarea
                    type="text"
                    value={inputText}
                    placeholder="Type your message..."
                    // className="focus:ring-0 focus:outline-0 block w-full bg-transparent dark:text-white resize-none"
                    className="focus:ring-0 focus:outline-0 block text-gray-400 focus:shadow-outline w-full resize-none rounded-lg border-none bg-gray-700/50 py-2 px-3 placeholder:text-c3 outline-none transition-all hover:brightness-110 hover:duration-300 focus:text-primary/80 focus:brightness-[1.15] active:scale-[0.98] active:duration-150 disabled:cursor-not-allowed disabled:brightness-90 disabled:hover:brightness-100"
                    onChange={handleTyping}
                    onKeyDown={onKeyUp}
                />
            </div>
            <div className="flex-none md:pr-0 pr-0">
                <button className="h-8 w-8 bg-slate-900 text-white flex flex-col justify-center items-center text-lg rounded-full"
                    onClick={!editMsg ? handleSend : handleEdit}>
                    <Icon
                        icon="heroicons-outline:paper-airplane"
                        className="transform rotate-[60deg]"
                    />
                </button>
            </div>
        </div>
    )
}

export default Composebar
