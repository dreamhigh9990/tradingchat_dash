import React, { useEffect } from "react";
import Image from "next/image";
import { auth, db, rmDb } from "@/configs/firebase";
import { child, get, ref } from "firebase/database";
import { doc, updateDoc } from "firebase/firestore";

const Avatar = ({ size, user, onClick }) => {
    useEffect(() => {
        const unsubscribe = () => {
            if (user?.isOnline && user?.uid) {
                if (user.uid != auth.currentUser.uid) {
                    get(child(ref(rmDb), `status/${user.uid}`)).then(async (snapshot) => {
                        if (snapshot.exists()) {
                            if (snapshot.val().state != 'online') {
                                await updateDoc(doc(db, "users", user.uid), { isOnline: false, });
                                user.isOnline = false;
                            }
                        } else {
                            console.log("No data available");
                        }
                    }).catch((error) => {
                        console.error(error);
                    });
                }
            }
        };
        return unsubscribe;
    }, [user?.uid]);

    const s =
        size === "small"
            ? 32
            : size === "medium"
                ? 36
                : size === "x-large"
                    ? 56
                    : size === "xx-large"
                        ? 96
                        : 40;
    const c =
        size === "small"
            ? "w-8 h-8"
            : size === "medium"
                ? "w-9 h-9"
                : size === "large"
                    ? "w-10 h-10"
                    : size === "x-large"
                        ? "w-14 h-14"
                        : "w-24 h-24";
    const f =
        size === "x-large"
            ? "text-2xl"
            : size === "xx-large"
                ? "text-4xl"
                : "text-base";
    return (
        <div
            className={`${c} rounded-full flex items-center justify-center text-base flex-shrink-0 relative mx-auto`}
            style={{ backgroundColor: user?.color }}
            onClick={onClick}
        >
            {user?.isOnline && (
                <>
                    {size === "large" && (
                        <span className="w-[10px] h-[10px] bg-green-500 rounded-full absolute top-[2px] right-[2px] " />
                    )}
                    {size === "x-large" && (
                        <span className="w-[12px] h-[12px] bg-green-500 rounded-full absolute top-[3px] right-[3px] " />
                    )}
                </>
            )}

            {user?.photoURL ? (
                <div className={`${c} overflow-hidden rounded-full custom-dropshadow`}>
                    <img
                        width={s}
                        height={s}
                        src={user?.photoURL}
                        alt="avatar"
                        className="object-cover object-center w-full h-full"
                    />
                </div>
            ) : (
                <span className={`uppercase font-semibold ${f}`}>
                    {user?.displayName?.charAt(0)}
                </span>
            )}
        </div>
    );
};

export default Avatar;