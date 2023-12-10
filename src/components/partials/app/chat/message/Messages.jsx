'use client'
import React, { useEffect, useState, useRef } from 'react'
import Message from './Message'
import { collection, doc, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from '@/configs/firebase';
import { useAuth } from '@/context/authContext';
import { useChatContext } from '@/context/chatContext';
import { DELETED_FOR_ME } from '@/constant/constants';
import { useSelector } from 'react-redux';

function Messages({ openModal }) {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const { data, setIsTyping, selectedRoom, isRoom } = useChatContext();
    const ref = useRef(null);
    const { condense } = useSelector((state) => state.chat);
    const maxLimit = 50;

    useEffect(() => {
        if (!isRoom && data?.chatId) {
            const qMessage = query(collection(db, 'chats', data.chatId, "messages"), orderBy("date", "desc"), limit(maxLimit));
            const unsubscribe = onSnapshot(qMessage, (snapshot) => {
                let _messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) || [];
                setMessages(_messages);
                scrollToChat();
            });
            return () => unsubscribe();
        }
    }, [data?.chatId, isRoom]);

    useEffect(() => {
        if (!isRoom) {
            const unsubscribe = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
                if (doc.exists()) {
                    setIsTyping(doc.data()?.typing?.[data.user.uid] || false);
                }
            });
            return () => unsubscribe();
        }
    }, [setIsTyping, isRoom]);

    // Group Message
    useEffect(() => {
        if (isRoom && selectedRoom?.id) {
            const qMessage = query(collection(db, 'channels', selectedRoom.id, "messages"), orderBy("date", "desc"), limit(maxLimit));
            const unsubscribe = onSnapshot(qMessage, (snapshot) => {
                let _messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) || [];
                setMessages(_messages);
                scrollToChat();
            });
            return () => unsubscribe();
        }
    }, [selectedRoom?.id, isRoom]);

    const scrollToChat = (delay) => {
        const chatElement = document.getElementById("chatBottomItem");
        setTimeout(() => {
            chatElement?.scrollIntoView({ behavior: 'smooth' });
        }, delay ?? 100);
    };

    // console.log(messages);
    const finalMessages = messages?.filter((m) => {
        if ((m?.deletedInfo?.[currentUser.uid] == DELETED_FOR_ME )|| m?.deletedInfo?.deletedForEveryone || m?.deleteChatInfo?.[currentUser.uid]) {
            return false
        }
        if (currentUser?.blockedUsers?.includes(m.sender)) {
            return false
        }
        return true        
    })
    return (
        <div ref={ref}
            className={`msgs overflow-y-auto msg-height overflow-x-auto flex flex-col-reverse scrollbar ${(condense) ? "pt-3 space-y-0" : "pt-5 space-y-5"}`}
        >
            <div id="chatBottomItem"></div>
            {finalMessages?.map((m) => (
                <Message message={m} key={m.id} openModal={openModal} />
            ))}
        </div>
    );
}

export default Messages
