import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

const initialUsers = () => {
  if (typeof window !== "undefined") {
    const item = window?.localStorage.getItem("users");
    return item
      ? JSON.parse(item)
      : [
        {
          id: uuidv4(),
          name: "dashcode",
          email: "dashcode@gmail.com",
          password: "dashcode",
        },
      ];
  }
  return [
    {
      id: uuidv4(),
      name: "dashcode",
      email: "dashcode@gmail.com",
      password: "dashcode",
    },
  ];
};
// save users in local storage

const initialIsAuth = () => {
  if (typeof window !== "undefined") {
    const item = window?.localStorage.getItem("isAuth");
    return item ? JSON.parse(item) : false;
  }
  return false;
};

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    // users: initialUsers(),
    // isAuth: initialIsAuth(),
    currentUser: null,
    isLoading: false,
  },
  reducers: {
    handleLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    handleRegister: (state, action) => {
      // const { name, email, password } = action.payload;
      // const user = state.users.find((user) => user.email === email);
      // if (user) {
      //   toast.error("User already exists", {
      //     position: "top-right",
      //     autoClose: 1500,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     progress: undefined,
      //     theme: "light",
      //   });
      // } else {
      //   state.users.push({
      //     id: uuidv4(),
      //     name,
      //     email,
      //     password,
      //   });
      state.currentUser = action.payload;
      state.isLoading = false;
      if (typeof window !== "undefined") {
        window?.localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
      }
      toast.success("User registered successfully", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
    handleLogin: (state, action) => {
      state.currentUser = action.payload;
      state.isLoading = false;
      // save currentUser in local storage
      if (typeof window !== "undefined") {
        window?.localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
      }
      toast.success("User logged in successfully", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
    handleLogout: (state, action) => {
      state.currentUser = "";// action.payload;
      state.isLoading = false;
      // remove isAuth from local storage
      if (typeof window !== "undefined") {
        window?.localStorage.removeItem("currentUser");
      }
      toast.success("User logged out successfully", {
        position: "top-right",
      });
    },
  },
});

export const { handleRegister, handleLogin, handleLogout, handleLoading } = authSlice.actions;
export default authSlice.reducer;
