'use client'
import {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    useReducer,
} from "react";

import { auth } from "@/configs/firebase";
import { db } from "@/configs/firebase";

import {
    collection,
    doc,
    onSnapshot,
    query,
    Timestamp,
    where,
    getDoc,
    updateDoc,
    orderBy,
} from "firebase/firestore";
import { useAuth } from "@/context/authContext";

const ChatContext = createContext();

const INITIAL_STATE = {
    chatId: "",
    user: null,
};

export const ChatContextProvider = ({ children }) => {
    const [chats, setChats] = useState({});
    const [channelList, setChannelList] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [users, setUsers] = useState(false);
    const [inputText, setInputText] = useState("");
    const [attachment, setAttachment] = useState(null);
    const [attachmentPreview, setAttachmentPreview] = useState(null);
    const [editMsg, setEditMsg] = useState(null);
    const [isTyping, setIsTyping] = useState(null);
    const [isRoom, setIsRoom] = useState(true);
    const [imageViewer, setImageViewer] = useState(null);
    const [unreadMsgs, setUnreadMsgs] = useState({});

    const chatReducer = (state, action) => {
        const currentUser = auth.currentUser
        const uid = currentUser ? currentUser.uid : null;
        switch (action.type) {
            case "CHANGE_USER":
                return {
                    user: action.payload,
                    chatId:
                        currentUser && uid && currentUser.uid > action.payload.uid // Add null check here
                            ? currentUser.uid + action.payload.uid
                            : action.payload.uid + currentUser.uid,
                };
            case "EMPTY":
                return INITIAL_STATE;
            default:
                return state;
        }
    };
    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    const { currentUser } = useAuth();
    const isUsersFetchedRef = useRef(false);
    const isBlockExecutedRef = useRef(false);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
            const updatedUsers = {};
            snapshot.forEach((doc) => {
                updatedUsers[doc.id] = doc.data();
            });
            setUsers(updatedUsers);
            if (!isBlockExecutedRef.current) {
                isUsersFetchedRef.current = true;
            }
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const documentIds = Object.keys(chats);
        if (documentIds.length === 0) return;

        const q = query(
            collection(db, "chats"),
            where("__name__", "in", documentIds)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            let msgs = {};
            snapshot.forEach((doc) => {
                if (doc.id !== state?.chatId) {
                    let unread = doc.data()?.unread || {};
                    Object.keys(unread).map((c) => {
                        if (c !== currentUser.uid && unread[c] > 0) {
                            msgs[doc.id] = unread[c];
                        }
                    });
                }
                Object.keys(msgs || {}).map((c) => {
                    if (msgs[c] < 1) {
                        delete msgs[c];
                    }
                });
            });
            setUnreadMsgs(msgs);
        });
        return unsubscribe;
    }, [chats, selectedChat]);

    useEffect(() => {
        const unsub = onSnapshot(
            doc(db, "userChats", currentUser?.uid),
            (doc) => {
                if (doc.exists()) {
                    const data = doc.data();

                    setChats(data);

                    if (data.hasOwnProperty("isTyping"))
                        delete data.isTyping;

                    if (
                        isUsersFetchedRef.current &&
                        !isBlockExecutedRef.current &&
                        users
                    ) {
                        // const firstChat = Object.values(data)
                        //     .filter(
                        //         (chat) =>
                        //             !chat?.hasOwnProperty("chatDeleted")
                        //     )
                        //     .sort((a, b) => {
                        //         return b.date - a.date;
                        //     })[0];

                        // if (firstChat) {
                        //     const user = users[firstChat?.userInfo?.uid];
                        //     const chatId =
                        //         currentUser?.uid && user?.uid
                        //             ? currentUser.uid > user.uid
                        //                 ? currentUser.uid + user.uid
                        //                 : user.uid + currentUser.uid
                        //             : null;

                        //     handleSelect(user);
                        //     readChat(chatId);
                        // }
                        // isBlockExecutedRef.current = true;
                    }
                }
            }
        );
        // getChats
        if (currentUser?.uid) {
            return () => unsub();
        }
    }, [isBlockExecutedRef.current, users]);

    useEffect(() => {
        resetFooterStates();
    }, [state?.chatId]);

    useEffect(() => {
        const qChannels = query(collection(db, "channels"));
        const unsubscribe = onSnapshot(qChannels, (snapshot) => {
            const _channelList = snapshot.docs.map((channel) => ({
                blocks: channel.data().blocks || [],
                channelName: channel.data().channelName,
                creator: channel.data().creator,
                typing: channel.data().typing || {},
                id: channel.id,
            })).filter(group =>
                ((!group?.blocks?.includes(currentUser.uid)) || currentUser.uid == group.creator));;
            setChannelList(_channelList, true);
           
        });
        return unsubscribe;
    }, []);

    const readChat = async (chatId) => {
        const chatRef = doc(db, "chats", chatId);
        const chatDoc = await getDoc(chatRef);
        let unread = chatDoc.data()?.unread || {};
        Object.keys(unread).map((c) => {
            if (c !== currentUser.uid && unread[c] > 0) {
                unread[c] = 0;
            }
        });
        await updateDoc(chatRef, { unread });
    };

    const handleSelect = (user, selectedChatId) => {
        setSelectedChat(user);
        dispatch({ type: "CHANGE_USER", payload: user });

        if (unreadMsgs?.[selectedChatId] > 0) {
            readChat(selectedChatId);
        }
    };

    const handleRoom = (room, selectedRoomId) => {
        setSelectedRoom(room);
        // dispatch({ type: "CHANGE_USER", payload: user });
    };

    const resetFooterStates = () => {
        setInputText("");
        setAttachment(null);
        setAttachmentPreview(null);
        setEditMsg(null);
        setImageViewer(null);
    };

    return (
        <ChatContext.Provider
            value={{
                chats,
                setChats,
                selectedChat,
                setSelectedChat,
                users,
                setUsers,
                inputText,
                setInputText,
                attachment,
                setAttachment,
                attachmentPreview,
                setAttachmentPreview,
                data: state,
                dispatch,
                editMsg,
                setEditMsg,
                isTyping,
                setIsTyping,
                resetFooterStates,
                imageViewer,
                setImageViewer,
                unreadMsgs,
                setUnreadMsgs,
                handleSelect,
                handleRoom,

                channelList,
                setChannelList,
                selectedRoom,
                setSelectedRoom,
                isRoom,
                setIsRoom,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => useContext(ChatContext);