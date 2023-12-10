import { db } from "@/configs/firebase";
import { collection, addDoc, setDoc, doc, getDoc, updateDoc } from "firebase/firestore";


export const User = {
  create: async function (id, data) {
    return await setDoc(doc(db, "users", id), data);
  },
  update: async function (id, data) {
    let result = null;
    let error = null;

    try {
      // result = await updateDoc(doc(db, "users", id), data);
      result = await setDoc(doc(db, "users", id), data, {
        merge: true
      });
    } catch (e) {
      console.log(e);
      error = e;
    }

    return { result, error };
  },
  get: async function (id) {
    let result = null;
    let error = null;
    try {
      const docSnap = await getDoc(doc(db, "users", id));
      result = docSnap.data();
    } catch (e) {
      console.log(e);
      error = e;
    }
    return { result, error };
  }
};
