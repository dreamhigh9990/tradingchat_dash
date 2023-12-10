'user client'
import React, { useState } from 'react'
import {
  addDoc,
  collection,
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
import { Icon } from '@iconify/react';
import Icons from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';


function CreateRoom({ open, setOpen, title }) {
  const { currentUser } = useAuth();
  const { channelList } = useChatContext();
  const [roomName, setRoomName] = useState("");
  const [err, setErr] = useState("");

  const updateName = (_name) => {
    setRoomName(_name, false);
    if (err) {
      setErr("", false);
    }
  }

  const addChannel = async () => {
    try {
      if (roomName) {
        let _roomName = roomName.toLowerCase().trim();
        if (_roomName === "") {
          setErr("Please put the room name.");
          return;
        }
        for (var i = 0; i < channelList.length; i++) {
          if (_roomName === channelList[i].channelName) {
            setErr("The room name exists.");
            return;
          }
        }
        setOpen(false);
        toast.promise(
          async () => {
            try {
              await addDoc(collection(db, "channels"), { channelName: _roomName, creator: currentUser.uid, blocks: [] });
            } catch (error) {
              console.log({ error })
            }
          },
          {
            pending: "Creating a new room.",
            success: "New Room created successfully.",
            error: "Room creating failed.",
          },
          {
            autoClose: 3000,
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ModalNew
      activeModal={open}
      title={title}
      onClose={() => setOpen(false)}
      centered
      footerContent={
        <div className="flex items-center justify-end gap-4 w-full flex-col md:flex-row">
          <Button
            text="Create"
            className="btn-dark text-green-500 w-48"
            onClick={() => { addChannel() }}
          />
          <Button
            text="Cancel"
            className="btn-dark text-gray-400 w-48"
            onClick={() => setOpen(false)}
          />
        </div>
      }
    >
      <div className="flex items-center justify-center w-full flex-col">
        <div className="border-b border-slate-700 w-full ">
          <div className="search px-3 mx-6 rounded flex items-center space-x-3 rtl:space-x-reverse">
            <div className="flex-none text-base text-slate-300">
              <Icons icon="fluent:channel-share-12-regular" />
            </div>
            <input
              onChange={(e) => updateName(e.target.value)}
              placeholder="Enter Room Name..."
              className="w-full flex-1 block bg-transparent placeholder:font-normal placeholder:text-slate-400 py-2 focus:ring-0 focus:outline-none dark:text-slate-200 dark:placeholder:text-slate-400"
            />
          </div>
        </div>
        {err && <span className="text-red-500 mt-1">{err}</span>}
      </div>
    </ModalNew>
  );
}

export default CreateRoom
