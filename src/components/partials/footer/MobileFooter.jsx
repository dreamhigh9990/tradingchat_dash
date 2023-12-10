import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Avatar from "@/components/Avatar";
import { useAuth } from "@/context/authContext";
import { LINKS } from "@/constant/links";
import { useChatContext } from "@/context/chatContext";

const MobileFooter = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { unreadMsgs } = useChatContext();
  const unReadPersonalMsgCount = Object.keys(unreadMsgs).length || 0;

  return (
    <div className="bg-white bg-no-repeat custom-dropshadow footer-bg dark:bg-slate-700 flex justify-around items-center backdrop-filter backdrop-blur-[40px] fixed left-0 w-full z-[9999] bottom-0 py-[12px] px-4">
      <Link href={LINKS.CHAT.ROUTE}>
        <div>
          <span
            className={` relative cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center mb-1
         ${router.pathname?.includes("chat")
                ? "text-primary-500"
                : "dark:text-white text-slate-900"
              }
          `}
          >
            <Icon icon="heroicons-outline:mail" />
            {(unReadPersonalMsgCount > 0) &&
              <span className="absolute right-[5px] lg:top-0 -top-2 h-4 w-4 bg-red-500 text-[8px] font-semibold flex flex-col items-center justify-center rounded-full text-white z-[99]">
                {unReadPersonalMsgCount}
              </span>
            }
          </span>
          <span
            className={` block text-[11px]
          ${router.pathname?.includes("chat")
                ? "text-primary-500"
                : "text-slate-600 dark:text-slate-300"
              }
          `}
          >
            Messages
          </span>
        </div>
      </Link>
      <Link
        href={LINKS.PROFILE.ROUTE}
        className="relative bg-white bg-no-repeat backdrop-filter backdrop-blur-[40px] rounded-full footer-bg dark:bg-slate-700 h-[65px] w-[65px] z-[-1] -mt-[40px] flex justify-center items-center"
      >
        <Avatar size="x-large" user={currentUser} />
      </Link>
      <Link href={LINKS.NOTIFICATIONS.ROUTE}>
        <div>
          <span
            className={` relative cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center mb-1
      ${router.pathname === "notifications"
                ? "text-primary-500"
                : "dark:text-white text-slate-900"
              }
          `}>
            <Icon icon="heroicons-outline:bell" />
            <span className="absolute right-[17px] lg:top-0 -top-2 h-4 w-4 bg-red-500 text-[8px] font-semibold flex flex-col items-center justify-center rounded-full text-white z-[99]">
              1
            </span>
          </span>
          <span
            className={` block text-[11px]
         ${router.pathname === "notifications"
                ? "text-primary-500"
                : "text-slate-600 dark:text-slate-300"
              }
        `}>
            Notifications
          </span>
        </div>
      </Link>
    </div>
  );
};

export default MobileFooter;
