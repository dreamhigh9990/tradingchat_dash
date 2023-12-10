import React, { useState } from "react";
import Link from "next/link";
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

const schema = yup
  .object({
    name: yup.string().required("Name is Required"),
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup
      .string()
      .min(6, "Password must be at least 8 characters")
      .max(20, "Password shouldn't be more than 20 characters")
      .required("Please enter password"),
    // confirm password
    confirmpassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  })
  .required();

const RegForm = () => {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });
  const [loading, setLoading] = useState(false);

  const colorIndex = Math.floor(Math.random() * profileColors.length);
  const router = useRouter();

  const onSubmit = async (data, e) => {
    try {
      setLoading(true);
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      let _currentUser = {
        uid: user.uid,
        displayName: data.name,
        email: data.email,
        color: profileColors[colorIndex],
        isOnline: true,
      }
      await setDoc(doc(db, "users", user.uid), _currentUser);
      //await setDoc(doc(db, "userChats", user.uid), {});
      await updateProfile(user, {
        displayName: data.name,
      });
      //changed both from false, trying to get redirect after reg
      setLoading(true);
      router.push(LINKS.LOGIN.HREF);
    } catch (_ex) {
      console.log({ _ex })
    } finally {
      setLoading(true);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 ">
      <Textinput
        name="name"
        label="name"
        type="text"
        placeholder=" Enter your name"
        register={register}
        error={errors.name}
      />{" "}
      <Textinput
        name="email"
        label="email"
        type="email"
        placeholder=" Enter your email"
        register={register}
        error={errors.email}
      />
      <Textinput
        name="password"
        label="password"
        type="password"
        placeholder=" Enter your password"
        register={register}
        error={errors.password}
      />
      <p className="text-sm text-center text-slate-500">
       
      <span>
      <span className="text-sm  dark:text-blue-300 font-medium">
      Make sure to read the Terms and Conditions</span><br></br> 
       
       </span>
    
   </p>
       
      <button className="btn btn-dark block w-full text-center">
        By creating an account you agree
      </button>
      {loading && <Loader />}
      <p className="text-sm text-center text-slate-500">
       
          <span>
          No redirect after Creating an Account then try <Link
                    href={LINKS.LOGIN.HREF}
                    className="text-slate-900 dark:text-white font-medium hover:underline"
                  > <span className="text-sm  dark:text-blue-300 font-medium">
                 <a href="/login"> logging in</a><br></br> 
                  
                  </span>
                   
                  </Link><br></br> 
          
          </span>
       
      </p>
      
    </form>
  );
};

export default RegForm;
