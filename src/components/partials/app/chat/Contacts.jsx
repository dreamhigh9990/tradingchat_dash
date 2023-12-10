import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { openChat } from "./store";
import Avatar from "@/components/Avatar";
import { formatDate } from "@/constant/constants";
import { auth, db } from "@/configs/firebase";
import Icon from "@/components/ui/Icon";
import { collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import ModalNew from "@/components/ui/ModalNew";
import Button from "@/components/ui/Button";

const Contacts = ({ contact, handleSelect, isSelected }) => {
  const { chatId, user, lastmessage, unredmessage, date } = contact;

  const dispatch = useDispatch();

  return (
    <div
      className={`block w-full py-4 focus:ring-0 outline-none cursor-pointer group transition-all duration-150 hover:bg-slate-100 dark:hover:bg-slate-600 dark:hover:bg-opacity-70 
      ${isSelected ? "bg-slate-800 dark:bg-slate-700" : ""}`}
      onClick={() => {
        dispatch(openChat({ contact, activechat: true, }));
        handleSelect(user, chatId);
      }}
    >
      <div className="flex space-x-3 px-6 rtl:space-x-reverse">
        <div className="flex-none">
          <div className="h-10 w-10 rounded-full relative">
            <Avatar size="large" user={user} />
          </div>
        </div>
        <div className="flex-1 text-start flex">
          <div className="flex-1">
            <span className="block text-slate-800 dark:text-slate-300 text-sm font-medium mb-[2px]">
              {user?.displayName}
            </span>
            <span className="block text-slate-600 dark:text-slate-300 text-xs font-normal">
              {(lastmessage.length > 15) ? lastmessage.slice(0, 14) + "..." : lastmessage}
            </span>
          </div>
          <div className="flex-none ltr:text-right rtl:text-end">
            <span className="block text-xs text-slate-400 dark:text-slate-400 font-normal">
              {formatDate(date)}
            </span>
            {unredmessage > 0 && (
              <span className="inline-flex flex-col items-center justify-center text-[10px] font-medium w-4 h-4 bg-[#FFC155] text-white rounded-full">
                {unredmessage}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export const GroupItem = ({ group, handleSelect, isSelected }) => {
  const { chatId, channelName, room } = group;
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const dispatch = useDispatch();

  const deleteChannel = async () => {
    const channelRef = doc(db, "channels", chatId);
    await deleteDoc(channelRef).then((res) => {
      console.log("deleted successfully");
    }).catch((err) => {
      console.log(err);
    });
    setShowDeletePopup(false);
  }

  return (
    <div
      className={`block w-full py-3 focus:ring-0 outline-none cursor-pointer group transition-all duration-150 hover:bg-slate-100 dark:hover:bg-slate-600 dark:hover:bg-opacity-70 
      ${isSelected ? "bg-slate-800 dark:bg-slate-700" : ""}`}
      onClick={() => {
        dispatch(openChat({ group, activechat: true, }));
        handleSelect(room);
      }}
    >
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
                text="Delete Channel"
                className="btn-dark text-red-400 w-48"
                onClick={deleteChannel}
              />
              <Button
                text="Cancel"
                className="btn-dark text-gray-200 w-48"
                onClick={() => setShowDeletePopup(false)}
              />
            </div>
          }
        >Are you sure, you want to delete channel?</ModalNew>
      )}
      <div className="flex space-x-3 px-6 rtl:space-x-reverse">
        <div className="flex-1 text-start flex">
          <div className="flex-1">
            <span className="block text-slate-800 dark:text-slate-300 text-base font-medium mb-[2px] text-center">
              {`#${channelName}`}
            </span>
            {/* <span className="block text-slate-600 dark:text-slate-300 text-xs font-normal">
              {(lastmessage.length > 15) ? lastmessage.slice(0, 14) + "..." : lastmessage}
            </span> */}
          </div>
          <div className="flex-none ltr:text-right rtl:text-end">
            {/* <span className="block text-xs text-slate-400 dark:text-slate-400 font-normal">
              {room?.creator}
            </span> */}
            {/* {unredmessage > 0 && (
              <span className="inline-flex flex-col items-center justify-center text-[10px] font-medium w-4 h-4 bg-[#FFC155] text-white rounded-full">
              {unredmessage}
              </span>
            )} */}

            <span className="inline-flex flex-col items-center justify-center text-[12px] w-6 h-5 bg-[#475569] rounded-full">
              {Object.keys(room?.typing || {}).length}
            </span>

            {(auth.currentUser.uid == room?.creator) && (
              <span className="inline-flex flex-col items-center justify-center text-[10px] font-medium ml-5 w-6 h-6 bg-[#aa0000] text-white rounded-full" onClick={() => setShowDeletePopup(true)}>
                <Icon
                  icon="ion:trash-bin-sharp"
                  className="w-3 h-3"
                />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const RoomUser = ({ user, room, currentUser }) => {
  const [showBlockPopup, setShowBlockPopup] = useState(false);
  const [showUnBlockPopup, setShowUnBlockPopup] = useState(false);

  const blockUser = async () => {
    if (currentUser.uid == room?.creator) {
      var _blocks = room.blocks || [];
      const channelRef = doc(db, "channels", room.id);
      await updateDoc(channelRef, {
        blocks: [..._blocks, user.uid],
      }).then((res) => {
        console.log("blocked successfully");
      }).catch((err) => {
        console.log(err);
      });
    } else {
      var blocks = currentUser.blockedUsers || []
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        blockedUsers: [...blocks, user.uid],
      }).then((res) => {
        console.log("blocked successfully");
      }).catch((err) => {
        console.log(err);
      });
    }
    setShowBlockPopup(false);
  }

  const unblockUser = async () => {
    if (currentUser.uid == room?.creator) {
      const channelRef = doc(db, "channels", room.id);
      await updateDoc(channelRef, {
        blocks: room.blocks.filter(_uid => _uid != user.uid),
      }).then((res) => {
        console.log("blocked successfully");
      }).catch((err) => {
        console.log(err);
      });
    } else {
      var blocks = currentUser.blockedUsers || []
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        blockedUsers: blocks.filter(_uid => _uid != user.uid),
      }).then((res) => {
        console.log("blocked successfully");
      }).catch((err) => {
        console.log(err);
      });
    }
    setShowUnBlockPopup(false);
  }

  return (
    <div
      className={`block w-full py-2 focus:ring-0 outline-none cursor-pointer group transition-all duration-150 hover:bg-slate-100 dark:hover:bg-slate-600 dark:hover:bg-opacity-70`}
    >
      {showBlockPopup && (
        <ModalNew
          activeModal={showBlockPopup}
          title="Warning"
          labelClass="btn-outline-dark"
          onClose={() => setShowBlockPopup(false)}
          centered
          footerContent={
            <div className="flex items-center justify-center gap-4 w-full flex-col md:flex-row">
              <Button
                text="Block User"
                className="btn-dark text-red-400 w-48"
                onClick={blockUser}
              />
              <Button
                text="Cancel"
                className="btn-dark text-gray-200 w-48"
                onClick={() => setShowBlockPopup(false)}
              />
            </div>
          }
        >Are you sure, you want to block this user?</ModalNew>
      )}
      {showUnBlockPopup && (
        <ModalNew
          activeModal={showUnBlockPopup}
          title="Warning"
          labelClass="btn-outline-dark"
          onClose={() => setShowUnBlockPopup(false)}
          centered
          footerContent={
            <div className="flex items-center justify-center gap-4 w-full flex-col md:flex-row">
              <Button
                text="UnBlock User"
                className="btn-dark text-red-400 w-48"
                onClick={unblockUser}
              />
              <Button
                text="Cancel"
                className="btn-dark text-gray-200 w-48"
                onClick={() => setShowUnBlockPopup(false)}
              />
            </div>
          }
        >Are you sure, you want to unblock this user?</ModalNew>
      )}
      <div className="flex space-x-3 px-6 rtl:space-x-reverse">
        <div className="flex-none">
          <div className="h-10 w-10 rounded-full relative">
            <Avatar size="large" user={user} />
          </div>
        </div>
        <div className="flex-1 text-start flex items-center justify-center">
          <div className="flex-1 items-center justify-center">
            <span className="block text-slate-800 dark:text-slate-300 text-sm font-medium mb-[2px]">
              {user?.displayName}
            </span>
          </div>
          {((currentUser.uid == room?.creator) || (user?.role != 'admin')) && (
            <div className="flex-none ltr:text-right rtl:text-end">
              {(room.blocks?.includes(user.uid) || currentUser.blockedUsers?.includes(user.uid)) ?
                <span className="inline-flex flex-col items-center justify-center text-[10px] font-medium ml-5 w-6 h-6 bg-slate-700 text-white rounded-full" onClick={() => setShowUnBlockPopup(true)}>
                  <Icon
                    icon="heroicons-solid:eye-off"
                    className="w-3 h-3"
                  />
                </span>
                :
                <span className="inline-flex flex-col items-center justify-center text-[10px] font-medium ml-5 w-6 h-6 bg-slate-700 text-white rounded-full" onClick={() => setShowBlockPopup(true)}>
                  <Icon
                    icon="heroicons-solid:eye"
                    className="w-3 h-3"
                  />
                </span>
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contacts;
