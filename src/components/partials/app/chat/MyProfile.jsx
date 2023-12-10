import React, { useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import { CSSTransition } from "react-transition-group";
import { useSelector, useDispatch } from "react-redux";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Radio from "@/components/ui/Radio";
import { toggleProfile } from "./store";

import SimpleBar from "simplebar-react";
import { useAuth } from "@/context/authContext";
import Avatar from "@/components/Avatar";
import { toast } from "react-toastify";
import { auth, db, storage } from "@/configs/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { BiCheckIcon, BiEditIcon, BsFillCheckCircleFillIcon, MdAddAPhotoIcon, MdDeleteForeverIcon, MdPhotoCameraIcon } from "./Icons";
import { profileColors } from "@/constant/constants";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const allStatus = [
  {
    value: "online",
    label: "Active",
    activeClass: "ring-success-500 border-success-500",
  },
  {
    value: "busy",
    label: "Do Not Disturb",
    activeClass: "ring-danger-500 border-danger-500",
  },
  {
    value: "away",
    label: "Away",
    activeClass: "ring-warning-500 border-warning-500",
  },
  {
    value: "offline",
    label: "Offline",
    activeClass: "ring-warning-500 border-warning-500",
  },
];

const MyProfile = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const { openProfile } = useSelector((state) => state.chat);
  const [status, setStatus] = useState(!(currentUser?.isOnline) ? "offline" : "online");
  const nodeRef = useRef(null);
  const dispatchRedux = useDispatch();
  const [editProfile, setEditProfile] = useState(false);
  const [nameEdited, setNameEdited] = useState(false);
  const authUser = auth.currentUser;

  const handleUpdateProfile = async (type, value) => {
    let obj = { ...currentUser };
    switch (type) {
      case "color":
        obj.color = value;
        break;
      case "name":
        obj.displayName = value;
        break;
      case "photo":
        obj.photoURL = value;
        break;
      case "photo-remove":
        obj.photoURL = null;
        break;
      default:
        break;
    }

    try {
      toast.promise(
        async () => {
          // try {
          const userDocRef = doc(db, "users", currentUser.uid);
          await updateDoc(userDocRef, obj);
          setCurrentUser(obj);

          if (type == "photo-remove") {
            await updateProfile(authUser, { photoURL: null, });
          } else if (type === "name") {
            await updateProfile(authUser, { displayName: value, });
            setNameEdited(false);
          }
          // } catch (_err) {
          //   console.log({ _err });
          // }
        },
        {
          pending: "Updating profile.",
          success: "Profile updated successfully.",
          error: "Profile udpate failed.",
        },
        {
          autoClose: 3000,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const uploadImageToFirebase = async (file) => {
    try {
      if (file) {
        const storageRef = ref(storage, currentUser.displayName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on("state_changed", (snapshot) => { }, (error) => {
          console.error(error);
        }, () => {
          getDownloadURL(uploadTask.snapshot.ref).then(
            async (downloadURL) => {
              handleUpdateProfile("photo", downloadURL);
              await updateProfile(authUser, {
                photoURL: downloadURL,
              });
            }
          );
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onkeyup = (event) => {
    if (event.target.innerText.trim() !== currentUser.displayName) {
      setNameEdited(true);
    } else {
      setNameEdited(false);
    }
  };

  const onkeyDown = (event) => {
    if (event.key === "Enter" && event.keyCode === 13)
      event.preventDefault();
  };

  const editProfileContainer = () => {
    return (
      <div className="flex flex-col items-center relative">
        {/* <ToastMessage /> */}
        <div className="relative group cursor-pointer">
          <Avatar
            size="xx-large"
            user={currentUser}
            onClick={() => setEditProfile(true)}
          />
          <div className="w-full h-full rounded-full dark:bg-slate-900/[0.5] absolute top-0 left-0 justify-center items-center hidden group-hover:flex">
            <label htmlFor="fileUpload">
              {currentUser.photoURL ? (
                <MdPhotoCameraIcon size={34} />
              ) : (
                <MdAddAPhotoIcon size={34} />
              )}
            </label>
            <input
              id="fileUpload"
              type="file"
              onChange={(e) =>
                uploadImageToFirebase(e.target.files[0])
              }
              style={{ display: "none" }}
            />
          </div>

          {currentUser.photoURL && (
            <div
              className="w-6 h-6 rounded-full bg-red-500 flex justify-center items-center absolute right-0 bottom-0"
              onClick={() => handleUpdateProfile("photo-remove")}
            >
              <MdDeleteForeverIcon size={14} />
            </div>
          )}
        </div>
        <div className="mt-5 flex flex-col items-center">
          <div className="flex items-center gap-2">
            {!nameEdited && <BiEditIcon className="text-c3" />}
            {nameEdited && (
              <div onClick={() => {
                handleUpdateProfile("name", document.getElementById("displayNameEdit").innerText)
              }}><BsFillCheckCircleFillIcon className="cursor-pointer text-c4" /></div>
            )}
            <div
              contentEditable
              suppressContentEditableWarning={true}
              className="bg-transparent outline-none border-none text-center text-yellow-600"
              type="text"
              id="displayNameEdit"
              onKeyUp={onkeyup}
              onKeyDown={onkeyDown}
            >
              {currentUser.displayName}
            </div>
          </div>
          <span className="text-c3 text-sm">{currentUser.email}</span>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-5">
          {profileColors.map((color, index) => (
            <span
              key={index}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-125"
              style={{ backgroundColor: color }}
              onClick={() => handleUpdateProfile("color", color)}
            >
              {color === currentUser.color && (
                <BiCheckIcon size={24} />
              )}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <header>
        <div className="flex px-5 pt-6">
          <div className="flex-1">
            <div className="flex space-x-3 rtl:space-x-reverse">
              <div className="flex-none">
                <Avatar size="large" user={currentUser} />
              </div>
              <div className="flex-1 text-start">
                <span className="block text-slate-800 dark:text-slate-300 text-sm font-medium mb-[2px]">
                  {currentUser?.displayName}
                  <span className="status bg-success-500 inline-block h-[10px] w-[10px] rounded-full ml-3"></span>
                </span>
                <span className="block text-slate-500 dark:text-slate-300 text-xs font-normal">
                  {!(currentUser?.isOnline) ? "Offline" : "Available"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <div onClick={() => dispatchRedux(toggleProfile(true))}
              className="h-8 w-8 bg-slate-100 dark:bg-slate-900 dark:text-slate-400 flex flex-col justify-center items-center text-xl rounded-full cursor-pointer">
              <Icon icon="heroicons-outline:pencil" />
              {/* <Icon icon="heroicons-outline:dots-horizontal" /> */}
            </div>
          </div>
        </div>
        <CSSTransition
          in={openProfile}
          timeout={300}
          nodeRef={nodeRef}
          classNames="profileAnimation"
          unmountOnExit
        >
          <div
            ref={nodeRef}
            className="absolute bg-white dark:bg-slate-800 rounded-md h-full left-0 top-0 bottom-0  w-full z-[9]"
          >
            <SimpleBar className="h-full p-6">
              <div className="text-right">
                <div
                  className="h-8 w-8 bg-slate-100 dark:bg-slate-900 dark:text-slate-400 inline-flex ml-auto flex-col justify-center items-center text-xl rounded-full cursor-pointer"
                  onClick={() => dispatchRedux(toggleProfile(false))}
                >
                  <Icon icon="heroicons-outline:x" />
                </div>
              </div>
              <header className="mx-auto max-w-[200px] mt-3 text-center">
                {(editProfileContainer())}
                {/* <div className="h-16 w-16 rounded-full border border-slate-400 p-[2px] shadow-md mx-auto mb-3 relative">
                  <img
                    src={currentUser?.photoURL}
                    alt={currentUser.displayName?.charAt(0)}
                    className="block w-full h-full rounded-full object-contain"
                  />
                  <span
                    className={`status inline-block h-3 w-3 rounded-full absolute -right-1 top-3 border border-white
                ${status === "online" ? "bg-success-500" : ""}
                ${status === "away" ? "bg-warning-500" : ""}
                ${status === "busy" ? "bg-danger-500" : ""}
                ${status === "offline" ? "bg-secondary-500" : ""}
                `}
                  ></span>
                </div> */}
                {/* <span className="block text-slate-600 dark:text-slate-300 text-sm mt-2 font-bold">
                  {currentUser?.displayName}
                </span>
                <span className="block text-slate-500 dark:text-slate-300 text-xs">
                  {currentUser?.email}
                </span> */}
              </header>
              {/* <div className="my-8">
                <Textarea label="About" placeholder="About ypur self" />
              </div> */}
              {/* <div className="mb-8">
                <span className="form-label">Status</span>
                {allStatus?.map((item) => (
                  <Radio
                    key={item.value}
                    label={item.label}
                    name="status"
                    value={item.value}
                    checked={status === item.value}
                    onChange={(e) => setStatus(e.target.value)}
                    activeClass={item.activeClass}
                  />
                ))}
              </div> */}
              {/* <div className="flex justify-end">
                <Button text="Save" className="btn-dark " />
              </div> */}
            </SimpleBar>
          </div>
        </CSSTransition>
      </header>
    </div>
  );
};

export default MyProfile;
