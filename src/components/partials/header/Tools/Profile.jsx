import React from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { Menu, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { handleLogout } from "@/components/partials/auth/store";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import Avatar from "@/components/Avatar";
import { LINKS } from "@/constant/links";
import useMember from "@/hooks/useMember";



const Profile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser, signOut } = useAuth();
  const [isMember] = useMember();

  const ProfileLabel = () => {
    return (
      <div className="flex items-center">
        <div className="flex-1 ltr:mr-[10px] rtl:ml-[10px]">
          <Avatar size="large" user={currentUser} />
        </div>
        <div className="flex-none text-slate-600 dark:text-white text-sm font-normal items-center lg:flex hidden overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="overflow-hidden text-ellipsis whitespace-nowrap block pr-2">
            {currentUser?.displayName}
          </span>
          <span className="text-base inline-block ltr:ml-[10px] rtl:mr-[10px]">
            <Icon icon="heroicons-outline:chevron-down"></Icon>
          </span>
        </div>
      </div>
    );
  };

  const ProfileMenu = isMember ? [
    {
      label: "Profile",
      icon: "heroicons-outline:user",

      action: () => {
        router.push(LINKS.PROFILE.ROUTE);
      },
    },
    {
      label: "Chat",
      icon: "heroicons-outline:chat",
      action: () => {
        router.push(LINKS.CHAT.ROUTE);
      },
    },
     {
       label: "Stocks",
       icon: "heroicons:arrow-trending-up",
       action: () => {
         router.push(LINKS.STOCKS.ROUTE);
       },
     },
    // {
    //   label: "Todo",
    //   icon: "heroicons-outline:clipboard-check",
    //   action: () => {
    //     router.push("/todo");
    //   },
    // },
    // {
    //   label: "Settings",
    //   icon: "heroicons-outline:cog",
    //   action: () => {
    //     router.push("/settings");
    //   },
    // },
    //{
    //  label: "Price",
    //  icon: "heroicons-outline:credit-card",
    //  action: () => {
    //    router.push(LINKS.PRICING.ROUTE);
    //  },
    //},
    // {
    //   label: "Faq",
    //   icon: "heroicons-outline:information-circle",
    //   action: () => {
    //     router.push("/faq");
    //   },
    // },
    {
      label: "Logout",
      icon: "heroicons-outline:login",
      action: () => { signOut(); },
    },
  ] : [{
    label: "Logout",
    icon: "heroicons-outline:login",
    action: () => { signOut(); },
  }];

  return (
    <Dropdown label={ProfileLabel()} classMenuItems="w-[180px] top-[58px]">
      {ProfileMenu.map((item, index) => (
        <Menu.Item key={index}>
          {({ active }) => (
            <div
              onClick={() => item.action()}
              className={`${active
                ? "bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-300 dark:bg-opacity-50"
                : "text-slate-600 dark:text-slate-300"
                } block     ${item.hasDivider
                  ? "border-t border-slate-100 dark:border-slate-700"
                  : ""
                }`}
            >
              <div className={`block cursor-pointer px-4 py-2`}>
                <div className="flex items-center">
                  <span className="block text-xl ltr:mr-3 rtl:ml-3">
                    <Icon icon={item.icon} />
                  </span>
                  <span className="block text-sm">{item.label}</span>
                </div>
              </div>
            </div>
          )}
        </Menu.Item>
      ))}
    </Dropdown>
  );
};

export default Profile;
