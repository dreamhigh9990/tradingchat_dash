'use client'

import React, { useState } from "react";
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    serverTimestamp,
    getDoc,
    setDoc,
    deleteField,
} from "firebase/firestore";

import { useAuth } from "@/context/authContext";
import { useChatContext } from "@/context/chatContext";
import { db } from "@/configs/firebase";
import Avatar from "@/components/Avatar";
import { Icon } from "@iconify/react";

function Search({ handleSelect }) {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);

    const { currentUser } = useAuth();
    const { dispatch } = useChatContext();

    const onKeyUp = async (e) => {
        if (e.code === "Enter" && !!username) {
            try {
                setErr(false);
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("displayName", "==", username));

                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    setErr(true);
                    setUser(null);
                } else {
                    querySnapshot.forEach((doc) => {
                        setUser(doc.data());
                    });
                }
            } catch (error) {
                console.error(error);
                setErr(error);
            }
        }
    };

    return (
        <div className="shrink-0">
            <div className="border-b border-slate-400 dark:border-slate-700 py-1">
                <div className="search px-3 mx-6 rounded flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="flex-none text-base text-slate-300 dark:text-slate-400">
                        <Icon icon="bytesize:search" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search here..."
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyUp={onKeyUp}
                        value={username}
                        autoFocus
                        className="w-full flex-1 block bg-transparent placeholder:font-normal placeholder:text-slate-400 py-2 focus:ring-0 focus:outline-none dark:text-slate-200 dark:placeholder:text-slate-400 rounded-xl"
                    />
                </div>
            </div>
            {err && (
                <>
                    <div className="mt-5 w-full text-center text-sm">
                        User not found!
                    </div>
                    <div className="w-full h-[1px] bg-white/[0.1] mt-5"></div>
                </>
            )}
            {user && (
                <>
                    <div
                        onClick={() => handleSelect(user)}
                        className="mt-5 flex items-center gap-4 rounded-xl hover:bg-c5 py-2 px-4 cursor-pointer"
                    >
                        <Avatar size="medium" user={user} />
                        <div className="flex flex-col gap-1 grow">
                            <span className="text-base text-white flex  items-center justify-between">
                                <div className="font-medium">
                                    {user.displayName}
                                </div>
                            </span>
                            <p className="text-sm text-c3">{user.email}</p>
                        </div>
                    </div>
                    <div className="w-full h-[1px] bg-white/[0.1] mt-5"></div>
                </>
            )}
        </div>
    );
}

export default Search
