"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import Header from "@/components/partials/header";

import useWidth from "@/hooks/useWidth";
import useSidebar from "@/hooks/useSidebar";
import useContentWidth from "@/hooks/useContentWidth";
import useMenulayout from "@/hooks/useMenulayout";
import useMenuHidden from "@/hooks/useMenuHidden";
import Footer from "@/components/partials/footer";
// import Breadcrumbs from "@/components/ui/Breadcrumbs";
import MobileMenu from "@/components/partials/sidebar/MobileMenu";
import useMobileMenu from "@/hooks/useMobileMenu";
import useMonoChrome from "@/hooks/useMonoChrome";
import MobileFooter from "@/components/partials/footer/MobileFooter";
import { useSelector } from "react-redux";
import useRtl from "@/hooks/useRtl";
import useDarkMode from "@/hooks/useDarkMode";
import useSkin from "@/hooks/useSkin";
import Loading from "@/components/Loading";
import useNavbarType from "@/hooks/useNavbarType";
import { motion, AnimatePresence } from "framer-motion";
import useMember from "@/hooks/useMember";

export default function RootLayout({ children }) {
  const { width, breakpoints } = useWidth();
  const [collapsed] = useSidebar();
  const [isRtl] = useRtl();
  const [isDark] = useDarkMode();
  const [skin] = useSkin();
  const [navbarType] = useNavbarType();
  const [isMonoChrome] = useMonoChrome();
  const router = useRouter();

  const location = usePathname();
  // header switch class


  // content width
  const [contentWidth] = useContentWidth();


  // mobile menu
  const [mobileMenu, setMobileMenu] = useMobileMenu();
  const [isMember] = useMember();

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`app-warp    ${isDark ? "dark" : "light"} ${skin === "bordered" ? "skin--bordered" : "skin--default"
        }
      ${navbarType === "floating" ? "has-floating" : ""}
      `}
    >
      <ToastContainer />
      <Header className={width > breakpoints ? switchHeaderClass() : ""} />
      
      {isMember &&
        <MobileMenu
          className={`${width < breakpoints.xl && mobileMenu
            ? "left-0 visible opacity-100  z-[9999]"
            : "left-[-300px] invisible opacity-0  z-[-999] "
            }`}
        />
      }
      {/* mobile menu overlay*/}
      {width < breakpoints.xl && mobileMenu && isMember && (
        <div
          className="overlay bg-slate-900/50 backdrop-filter backdrop-blur-sm opacity-100 fixed inset-0 z-[999]"
          onClick={() => setMobileMenu(false)}
        ></div>
      )}
      {/* <Settings /> */}
      <div className={`content-wrapper transition-all duration-150 `}
      >
        {/* md:min-h-screen will h-full*/}
        <div className="page-content   page-min-height  ">
          <div
            className={
              contentWidth === "boxed" ? "container mx-auto" : "container-fluid"
            }
          >
            <motion.div
              key={location}
              initial="pageInitial"
              animate="pageAnimate"
              exit="pageExit"
              variants={{
                pageInitial: { opacity: 0, y: 50, },
                pageAnimate: { opacity: 1, y: 0, },
                pageExit: { opacity: 0, y: -50, },
              }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.5, }}
            >
              <Suspense fallback={<Loading />}>
                {/* <Breadcrumbs /> */}
                {children}
              </Suspense>
            </motion.div>
          </div>
        </div>
      </div>
      {width < breakpoints.md && isMember && <MobileFooter />}
      {width > breakpoints.md && (
        <Footer className={ breakpoints } />
      )}
    </div>
  );
}
