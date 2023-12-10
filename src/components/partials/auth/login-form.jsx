import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Checkbox from "@/components/ui/Checkbox";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { handleLoading, handleLogin } from "./store";
import { toast } from "react-toastify";
import { auth } from "@/configs/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { LINKS } from "@/constant/links";
import { Loader } from "@/components/ui/AppLoader";
import { useRouter } from "next/navigation";

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup.string().required("Password is Required"),
  })
  .required();
const LoginForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    //
    mode: "all",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onSubmit = async (data, e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password).then(async (userCredential) => {
        router.push(LINKS.CHAT.ROUTE);
      }).catch((err) => {
        dispatch(handleLoading(false));
        console.log({ err })
        const { code, message } = err;
        if (code === 'auth/invalid-email' || code === 'auth/user-disabled' || code === 'auth/user-not-found') {
          toast.error(message, {
            position: "top-right", autoClose: 1500, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light",
          });
        }
        if (code === 'auth/wrong-password') {
          toast.error(message, {
            position: "top-right", autoClose: 1500, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light",
          });
        }
      });
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  };
  // const [checked, setChecked] = useState(false);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <Textinput
        name="email"
        label="email"
        // defaultValue="dashcode@gmail.com"
        type="email"
        register={register}
        placeholder=" Enter your email"
        error={errors?.email}
      />
      <Textinput
        name="password"
        label="passwrod"
        type="password"
        // defaultValue="dashcode"
        register={register}
        placeholder=" Enter your password"
        error={errors.password}
      />
      <div className="flex justify-between">
        {/* <Checkbox
          value={checked}
          onChange={() => setChecked(!checked)}
          label="Keep me signed in"
        /> */}
        <Link
          href={LINKS.FORGOT_PASSWORD.HREF}
          className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
        >
          Forgot Password?{" "}
        </Link>
      </div>

      <button className="btn btn-dark block w-full text-center">Sign in</button>
      {loading && <Loader />}
    </form>
  );
};

export default LoginForm;
