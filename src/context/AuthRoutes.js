import { useRouter } from "next/router";
import React, { useEffect } from 'react';
import { useAuth } from './authContext';
import { LINKS } from '@/constant/links';
import AppLoader from "@/components/ui/AppLoader";
import AuthLayout from "@/components/layout/AuthLayout";
import RootLayout from "@/components/layout/RootLayout";
import { usePathname } from "next/navigation";
import { ChatContextProvider } from "./chatContext";


const AuthRoutes = ({ children }) => {
  const [mounted, setMounted] = React.useState(false);
  const { isLoading, currentUser } = useAuth();
  const router = useRouter();
  const path = usePathname();//.substring(1);
  const curSecondsTime = (new Date()).getTime() / 1000;

  useEffect(() => {
    if (!isLoading) {
      // console.log({ currentUser }, { path })
      if (currentUser && currentUser.uid) {
        if (path === LINKS.INDEX.HREF || path === LINKS.INDEX.ROUTE || !path) {
          if (currentUser.period_end && curSecondsTime < currentUser.period_end) {
            router.push(LINKS.CHAT.ROUTE);
          } else {
            router.push(LINKS.PRICING.ROUTE);
          }
        } else {
          if (currentUser.period_end && curSecondsTime < currentUser.period_end) {

          } else if (path.includes("dashboard/") && (path !== LINKS.PRICING.ROUTE)) {
            router.push(LINKS.PRICING.ROUTE);
          }
        }
      } else {  // Non auth path.
        if (path === LINKS.LOGIN.ROUTE
          || path === LINKS.SIGNUP.ROUTE
          || path === LINKS.COMING_SOON.ROUTE
          || path === LINKS.FORGOT_PASSWORD.ROUTE
          || path === LINKS.LOCK_SCREEN.ROUTE
          || path === LINKS.AUTH_PRICING.ROUTE
          || path === LINKS.UNDER_CONSTRUCTION.ROUTE) {
        } else {
          router.push(LINKS.LOGIN.ROUTE);
        }
      }
    }
  }, [isLoading])
  useEffect(() => setMounted(true), []);

  if (currentUser && currentUser.uid) {
    if (currentUser.period_end && curSecondsTime < currentUser.period_end) {
    } else if (path.includes("dashboard/") && (path !== LINKS.PRICING.ROUTE)) {
      router.push(LINKS.PRICING.ROUTE);
    }
  }

  return (isLoading || !mounted) ?
    <AppLoader />
    : (path.includes("auth/")) ?
      <AuthLayout>
        {children}
      </AuthLayout>
      : (currentUser && currentUser.uid) ?
        <ChatContextProvider>
          {(path.includes("dashboard/")) && <RootLayout> {children} </RootLayout>}
          {(path.includes("auth/")) && <AuthLayout> {children} </AuthLayout>}
        </ChatContextProvider>
        : <AppLoader />;
};

export default AuthRoutes;

