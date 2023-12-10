"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import Header from "@/components/partials/header";
import useWidth from "@/hooks/useWidth";
import useSidebar from "@/hooks/useSidebar";
import useContentWidth from "@/hooks/useContentWidth";
import Footer from "@/components/partials/footer";
// import Breadcrumbs from "@/components/ui/Breadcrumbs";
import MobileFooter from "@/components/partials/footer/MobileFooter";
import useRtl from "@/hooks/useRtl";
import useDarkMode from "@/hooks/useDarkMode";
import useSkin from "@/hooks/useSkin";
import Loading from "@/components/Loading";
import useNavbarType from "@/hooks/useNavbarType";
import { motion, AnimatePresence } from "framer-motion";
import useMember from "@/hooks/useMember";

export default function SingleLayout({ children }) {
  const { width, breakpoints } = useWidth();
  const [collapsed] = useSidebar();
  const [isRtl] = useRtl();
  const [isDark] = useDarkMode();
  const [skin] = useSkin();
  const [navbarType] = useNavbarType();
  const [isMember] = useMember();

  const location = usePathname();
  // header switch class
  const switchHeaderClass = () => {
    return "ltr:ml-0 rtl:mr-0";
  };

  // content width
  const [contentWidth] = useContentWidth();

  return (
    <div dir={isRtl ? "rtl" : "ltr"}
      className={`app-warp ${isDark ? "dark" : "light"} ${skin === "bordered" ? "skin--bordered" : "skin--default"}
      ${navbarType === "floating" ? "has-floating" : ""} `}    >
      <ToastContainer />
      <Header className={width > breakpoints.xl ? switchHeaderClass() : ""} />
      {/* <Settings /> */}
      <div className={`content-wrapper transition-all duration-150 ${width > 1280 ? switchHeaderClass() : ""}`}>
        {/* md:min-h-screen will h-full*/}
        <div className="page-content page-min-height">
          <div className={contentWidth === "boxed" ? "container mx-auto" : "container-fluid"}          >
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
        <Footer className={width > breakpoints.xl ? switchHeaderClass() : ""} />
      )}
    </div>
  );
}
