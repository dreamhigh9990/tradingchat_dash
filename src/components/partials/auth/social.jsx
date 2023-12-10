import { auth } from "@/configs/firebase";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { LINKS } from "@/constant/links";

const Social = () => {
  const router = useRouter();
  const googleProvider = new GoogleAuthProvider();

  /**
    * login with google
    */
  const handleLoginWithGoogle = () => {
    try {
      signInWithPopup(auth, googleProvider)
        .then(async (userCredential) => {
          router.push(LINKS.CHAT.ROUTE);
        })
        .catch((err) => {
          const { code, message } = err;
          console.log({ err });
        });
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <>
      <ul className="flex">
        {/* <li className="flex-1">
          <a
            href="#"
            className="inline-flex h-10 w-10 bg-[#1C9CEB] text-white text-2xl flex-col items-center justify-center rounded-full"
          >
            <img src="/assets/images/icon/tw.svg" alt="" />
          </a>
        </li>
        <li className="flex-1">
          <a
            href="#"
            className="inline-flex h-10 w-10 bg-[#395599] text-white text-2xl flex-col items-center justify-center rounded-full"
          >
            <img src="/assets/images/icon/fb.svg" alt="" />
          </a>
        </li>
        <li className="flex-1">
          <a
            href="#"
            className="inline-flex h-10 w-10 bg-[#0A63BC] text-white text-2xl flex-col items-center justify-center rounded-full"
          >
            <img src="/assets/images/icon/in.svg" alt="" />
          </a>
        </li> */}
        <li className="flex-1 items-center justify-center flex">
          <div
            onClick={handleLoginWithGoogle}
            className="inline-flex h-10 w-10 bg-[#EA4335] text-white text-2xl flex-col items-center justify-center rounded-full cursor-pointer"
          >
            <img src="/assets/images/icon/gp.svg" alt="" />
          </div>
        </li>
      </ul>
    </>
  );
};

export default Social;
