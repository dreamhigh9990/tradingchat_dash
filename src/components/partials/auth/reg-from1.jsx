import React, { useState } from "react";
import { toast } from "react-toastify";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import Checkbox from "@/components/ui/Checkbox";
import { useDispatch, useSelector } from "react-redux";
import { handleRegister } from "./store";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { profileColors } from "@/constant/constants";
import { LINKS } from "@/constant/links";
import { useAuth } from "@/context/authContext";
import { Loader } from "@/components/ui/AppLoader";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/configs/firebase";

const RegForm1 = () => {
  // const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [errName, setErrName] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPass, setErrPass] = useState("");
  const [errConfirm, setErrConfirm] = useState("");

  const colorIndex = Math.floor(Math.random() * profileColors.length);
  const router = useRouter();

  const onSignUp = async () => {
    if (!displayName) {
      setErrName("please input the name.")
    }

    if (!email) {
      setErrEmail("please input the email.")
    }

    if (!password) {
      setErrPass("please input the password.")
    }

    if (!confirm) {
      setErrPass("please input the confirm password.")
    } else if (password != confirm) {
      setErrConfirm("The password is not matched.")
    }

    try {
      setLoading(true);
      console.log({ displayName, email })
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: displayName });
      let _currentUser = {
        uid: user.uid,
        displayName,
        email,
        color: profileColors[colorIndex],
        // isOnline: true,
      }
      console.log({ _currentUser })
      await setDoc(doc(db, "users", user.uid), _currentUser);
      await setDoc(doc(db, "userChats", user.uid), {});
      console.log(_currentUser);
      setLoading(false);
      // // router.push(LINKS.HOME.HREF);
    } catch (_ex) {
      console.log({ _ex })
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-5 ">
      <Textinput
        label="name"
        type="text"
        placeholder=" Enter your name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        error={errName}
      />
      <Textinput
        label="email"
        type="email"
        placeholder=" Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errEmail}
      />
      <Textinput
        label="passwrod"
        type="password"
        placeholder=" Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errPass}
      />
      <Textinput
        label="comfirm password"
        type="password"
        placeholder=" Enter your password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={errConfirm}
      />
      {/* <Checkbox
        label="You accept our Terms and Conditions and Privacy Policy"
        value={checked}
        onChange={() => setChecked(!checked)}
      /> */}
      <div className="btn btn-dark block w-full text-center" onClick={onSignUp}>
        Create an account
      </div>
      {loading && <Loader />}
    </div>
  );
};

export default RegForm1;
