import { LINKS } from "./links";

export const menuItems = [
  {
    isHeadr: true,
    title: "menu",
  },
  //{
  //  title: "Dashboard",
  //  icon: "heroicons-outline:home",
  //  link: LINKS.HOME.HREF,
  //  isHide: true,
  //},
  {
    title: "Profile",
    isHide: true,
    icon: "heroicons-outline:user",
    link: LINKS.PROFILE.ROUTE,
  },
   {
     title: "Stocks",
     isHide: true,
     icon: "heroicons:arrow-trending-up",
     link: LINKS.STOCKS.HREF,
   },
  {
    title: "Chat",
    isHide: true,
    icon: "heroicons-outline:chat",
    link: LINKS.CHAT.ROUTE,
  },
  // {
  //   title: "Blogs",
  //   isHide: true,
  //   icon: "heroicons-outline:newspaper",
  //   link: LINKS.BLOG.HREF,
  // },
  // {
  //   title: "FAQ",
  //   isHide: true,
  //   icon: "heroicons-outline:academic-cap",
  //   link: LINKS.FAQ.HREF,
  // },
  //{
  //  title: "Pricing",
 //   isHide: true,
 //   icon: "heroicons-outline:circle-stack",
 //   link: LINKS.PRICING.ROUTE,
 // },
 
  // {
  //   title: "Settings",
  //   isHide: true,
  //   icon: "heroicons-outline:wrench-screwdriver",
  //   link: "settings",
  // },
  {
    title: "Logout",
    isHide: true,
    icon: "heroicons-outline:logout",
    link: LINKS.LOGOUT.ROUTE,
  },
];

export const topMenu = [
  //{
  //  title: "Dashboard",
  //  icon: "heroicons-outline:home",
  //  link: LINKS.HOME.HREF,
  //  isHide: true,
  //},
  {
    title: "Profile",
    isHide: true,
    icon: "heroicons-outline:user",
    link: LINKS.PROFILE.HREF,
  },
  {
    title: "Chat",
    isHide: true,
    icon: "heroicons-outline:chat",
    link: LINKS.CHAT.HREF,
  },
   {
     title: "Stocks",
     isHide: true,
     icon: "heroicons:arrow-trending-up",
     link: LINKS.STOCKS.HREF,
   },
 
  // {
  //   title: "Blogs",
  //   isHide: true,
  //   icon: "heroicons-outline:newspaper",
  //   link: LINKS.BLOG.HREF,
  // },
  // {
  //   title: "FAQ",
  //   isHide: true,
  //   icon: "heroicons-outline:academic-cap",
  //   link: LINKS.FAQ.HREF,
  // },
  //{
  //  title: "Pricing",
  //  isHide: true,
  //  icon: "heroicons-outline:circle-stack",
  //  link: LINKS.PRICING.HREF,
  //},
  
  // {
  //   title: "Settings",
  //   isHide: true,
  //   icon: "heroicons-outline:wrench-screwdriver",
  //   link: "settings",
  // },
];

export const notifications = [
  
  {
    title: "TRADE AND CHAT WITH CONFIDENCE! 🎉",
    desc:
    <span className="text-slate-500 text-x-sm dark:text-slate-400 text-x-sm ">
    ** Welcome to Mytrading.chat v1.0 **<br></br><br></br>
    <h7 className="text-blue-500 text-sm dark:text-blue-400 text-sm ">
      Changelog: October 2023 </h7><br></br>
    * Added colors to names in main chat window<br></br>
    * Fixed menu links<br></br>
    * Stopped forced room bump<br></br>
   </span>,
  
    unread: false,
    hasnotifaction: false,
    image: "/assets/images/all-img/c1.png",
    link: "/login",
  },
];

export const message = [
  
  {
    title: "Kyle Bomm",
    desc: "Fast paced markets need fast information.",
    active: false,
    hasnotifaction: false,
    image: "/assets/images/all-img/user4.png",
    link: "#",
  },
];

export const colors = {
  primary: "#4669FA",
  secondary: "#A0AEC0",
  danger: "#F1595C",
  black: "#111112",
  warning: "#FA916B",
  info: "#0CE7FA",
  light: "#425466",
  success: "#50C793",
  "gray-f7": "#F7F8FC",
  dark: "#1E293B",
  "dark-gray": "#0F172A",
  gray: "#68768A",
  gray2: "#EEF1F9",
  "dark-light": "#CBD5E1",
};

export const hexToRGB = (hex, alpha) => {
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
};

export const topFilterLists = [
  {
    name: "Inbox",
    value: "all",
    icon: "uil:image-v",
  },
  {
    name: "Starred",
    value: "fav",
    icon: "heroicons:star",
  },
  {
    name: "Sent",
    value: "sent",
    icon: "heroicons-outline:paper-airplane",
  },

  {
    name: "Drafts",
    value: "drafts",
    icon: "heroicons-outline:pencil-alt",
  },
  {
    name: "Spam",
    value: "spam",
    icon: "heroicons:information-circle",
  },
  {
    name: "Trash",
    value: "trash",
    icon: "heroicons:trash",
  },
];

export const bottomFilterLists = [
  {
    name: "personal",
    value: "personal",
    icon: "heroicons:chevron-double-right",
  },
  {
    name: "Social",
    value: "social",
    icon: "heroicons:chevron-double-right",
  },
  {
    name: "Promotions",
    value: "promotions",
    icon: "heroicons:chevron-double-right",
  },
  {
    name: "Business",
    value: "business",
    icon: "heroicons:chevron-double-right",
  },
];

export const meets = [
  {
    img: "/assets/images/svg/sk.svg",
    title: "Meeting with client",
    date: "01 Nov 2021",
    meet: "Zoom meeting",
  },
  {
    img: "/assets/images/svg/path.svg",
    title: "Design meeting (team)",
    date: "01 Nov 2021",
    meet: "Skyp meeting",
  },
  {
    img: "/assets/images/svg/dc.svg",
    title: "Background research",
    date: "01 Nov 2021",
    meet: "Google meeting",
  },
  {
    img: "/assets/images/svg/sk.svg",
    title: "Meeting with client",
    date: "01 Nov 2021",
    meet: "Zoom meeting",
  },
];

export const files = [
  {
    img: "/assets/images/icon/file-1.svg",
    title: "Dashboard.fig",
    date: "06 June 2021 / 155MB",
  },
  {
    img: "/assets/images/icon/pdf-1.svg",
    title: "Ecommerce.pdf",
    date: "06 June 2021 / 155MB",
  },
  {
    img: "/assets/images/icon/zip-1.svg",
    title: "Job portal_app.zip",
    date: "06 June 2021 / 155MB",
  },
  {
    img: "/assets/images/icon/pdf-2.svg",
    title: "Ecommerce.pdf",
    date: "06 June 2021 / 155MB",
  },
  {
    img: "/assets/images/icon/scr-1.svg",
    title: "Screenshot.jpg",
    date: "06 June 2021 / 155MB",
  },
];
