'user client'
import React, { useState } from 'react'
import {
  deleteField,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { useAuth } from "@/context/authContext";
import { useChatContext } from "@/context/chatContext";
import Avatar from "@/components/Avatar";
import ModalNew from "@/components/ui/ModalNew";
import Search from "./Search";
import { db } from "@/configs/firebase";
import AppLoader from '@/components/ui/AppLoader';


function UsersPopup({ userPopup, setUserPopup, title }) {
  const { currentUser } = useAuth();
  const { users, dispatch } = useChatContext();
  const [loading, setLoading] = useState(false);

  const handleSelect = async (user) => {
    try {
      setLoading(true);
      const combinedId =
        currentUser.uid > user.uid
          ? currentUser.uid + user.uid
          : user.uid + currentUser.uid;

      const refer = await getDoc(doc(db, "chats", combinedId));

      if (!refer.exists()) {
        await setDoc(doc(db, "chats", combinedId), { typing: {} });

        const currentUserChatRef = await getDoc(
          doc(db, "userChats", currentUser.uid)
        );
        const userChatRef = await getDoc(
          doc(db, "userChats", user.uid)
        );

        if (!currentUserChatRef.exists()) {
          await setDoc(doc(db, "userChats", currentUser.uid), {});
        }
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL || null,
            color: user.color,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        if (!userChatRef.exists()) {
          await setDoc(doc(db, "userChats", user.uid), {});
        }
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL || null,
            color: currentUser.color,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      } else {
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".chatDeleted"]: deleteField(),
        });
      }

      dispatch({ type: "CHANGE_USER", payload: user });
      setUserPopup(false)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalNew
      activeModal={userPopup}
      title={title}
      onClose={() => setUserPopup(false)}
      centered
    >
      <Search handleSelect={handleSelect} />
      <div className="mt-5 flex flex-col gap-2 grow relative overflow-auto scrollbar max-h-[400px]">
        <div className="w-full">
          {users &&
            Object.values(users).filter(_user => _user.uid != currentUser.uid).map((user) => (
              <div
                key={user.uid}
                onClick={() => handleSelect(user)}
                className="flex items-center gap-4 rounded-xl hover:bg-c5 py-2 px-4 cursor-pointer"
              >
                <Avatar size="large" user={user} />
                <div className="flex flex-col gap-1 grow">
                  <span className="text-base text-white flex  items-center justify-between">
                    <div className="font-medium">
                      {user.displayName}
                    </div>
                  </span>
                  <p className="text-sm text-c3">
                    {user.email}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
      {loading && <AppLoader />}
    </ModalNew>
  );
}

export default UsersPopup
