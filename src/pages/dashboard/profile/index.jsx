"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import BasicArea from "@/components/partials/chart/appex-chart/BasicArea";
import { useAuth } from "@/context/authContext";
import Avatar from "@/components/Avatar";
import { toast } from "react-toastify";
import { auth, db, storage } from "@/configs/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { BiCheckIcon, BiEditIcon, BsFillCheckCircleFillIcon, MdAddAPhotoIcon, MdDeleteForeverIcon, MdPhotoCameraIcon } from "@/components/partials/app/chat/Icons";
import { profileColors } from "@/constant/constants";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const MyProfile = () => {
  const { currentUser, setCurrentUser } = useAuth();
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
          autoClose: 2000,
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


  return (
    <div>
      <div className="space-y-5 profile-page">
        <div className="profiel-wrap px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg bg-white dark:bg-slate-800 lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-[1]">
          <div className="bg-slate-900 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg"></div>
          <div className="profile-box flex-none md:text-start text-center">
            <div className="md:flex items-end md:space-x-6 rtl:space-x-reverse ">
              <div className="flex-none relative group cursor-pointer -mt-8">
                <Avatar size="xx-large" user={currentUser} />
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
              <div className="flex-1 mt-[50px]">
                <div className="flex items-center gap-2  justify-center">
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
                {/* <span className="text-c3 text-sm">{currentUser.email}</span> */}
              </div>
            </div>
          </div>
          {/* <div className="profile-info-500 md:flex md:text-start text-center flex-1 max-w-[516px] md:space-y-0 space-y-4">
            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                $32,400
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Total Balance
              </div>
            </div>

            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                200
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Board Card
              </div>
            </div>

            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                3200
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Calender Events
              </div>
            </div>
          </div> */}
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="lg:col-span-4 col-span-12">
            <Card title="Info">
              <ul className="list space-y-8">
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:envelope" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      EMAIL
                    </div>
                    <a
                      href="mailto:someone@example.com"
                      className="text-base text-slate-600 dark:text-slate-50"
                    >
                      {currentUser.email}
                    </a>
                  </div>
                </li>

                {/* <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:phone-arrow-up-right" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      PHONE
                    </div>
                    <a
                      href="tel:0189749676767"
                      className="text-base text-slate-600 dark:text-slate-50"
                    >
                      +1-202-555-0151
                    </a>
                  </div>
                </li> */}

                {/* <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:map" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      LOCATION
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      Home# 320/N, Road# 71/B, Mohakhali, Dhaka-1207, Bangladesh
                    </div>
                  </div>
                </li> */}
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="grid grid-cols-5 gap-4 mx-auto">
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
                </li>
              </ul>
            </Card>
          </div>
          <div className="lg:col-span-8 col-span-12">
            <Card title="User Overview">
              <BasicArea height={190} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
