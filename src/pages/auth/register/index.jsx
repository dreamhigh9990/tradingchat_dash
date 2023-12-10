"use client";

import React from "react";
import Link from "next/link";
import useDarkMode from "@/hooks/useDarkMode";
import RegForm from "@/components/partials/auth/reg-from";
import Social from "@/components/partials/auth/social";
import { COPYRIGHT } from "@/constant/constants";
import { LINKS } from "@/constant/links";

const Register = () => {
  const [isDark] = useDarkMode();
  return (
    <>
      <div className="loginwrapper">
        <div className="lg-inner-column">
          <div className="left-column relative z-[1]">
            <div className="max-w-[520px] pt-20 ltr:pl-20 rtl:pr-20">
              <Link href="/">
                <img
                  src={
                    isDark
                      ? "/assets/images/logo/logo-white.svg"
                      : "/assets/images/logo/logo.svg"
                  }
                  alt=""
                  className="mb-10"
                />
              </Link>

              {/* <h4>
                Unlock your Project
                <span className="text-slate-800 dark:text-slate-400 font-bold">
                  performance
                </span>
              </h4> */}
            </div>
            <div className="absolute left-0 bottom-[-130px] h-full w-full z-[-1]">
              <img
                src="/assets/images/auth/ilst2.png"
                alt=""
                className="h-full w-full object-contain"
              />
            </div>
          </div>
          <div className="right-column relative bg-white dark:bg-slate-800">
            <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
              <div className="auth-box h-full flex flex-col justify-center">
                <div className="mobile-logo text-center mb-6 lg:hidden block">
                  <Link href="/">
                    <img
                      src={
                        isDark
                          ? "/assets/images/logo/logo-white.svg"
                          : "/assets/images/logo/logo.svg"
                      }
                      alt=""
                      className="mx-auto"
                    />
                  </Link>
                </div>
                <div className="text-center 2xl:mb-10 mb-5">
                  <h4 className="font-medium">Sign up</h4>
                  <div className="text-slate-500 dark:text-slate-400 text-base">
                    Create an account to start using Mytrading.chat
                  </div>
                </div>
                <RegForm />
                {/* <div className=" relative border-b-[#9AA2AF] border-opacity-[16%] border-b pt-6">
                  <div className=" absolute inline-block  bg-white dark:bg-slate-800 left-1/2 top-1/2 transform -translate-x-1/2 px-4 min-w-max text-sm  text-slate-500  dark:text-slate-400font-normal ">
                    Or continue with
                  </div>
                </div>
                <div className="max-w-[242px] mx-auto mt-8 w-full">
                  <Social />
                </div> */}
                 <p className="text-sm text-center text-blue-300">
                Terms of Service - Mytrading.chat <br></br>
                </p>
                <p className="text-sm text-left text-slate-500">
By using Mytrading.chat, you are agreeing to be legally bound by the Terms.
We may change the Terms from time to time without notice. If you do not agree to any Terms, 
you should not use the Website. If you are entering into this agreement on behalf of a legal 
entity, you represent that you have the authority to bind such entity, in which case the 
terms “you” or “your” shall refer to such entity. <br></br>

Mytrading.chat provides fundamental data, market data, estimates and alternative data for 
global stock markets. Mytrading.chat is not engaged in rendering legal, accounting, 
investment advising, or other professional service. Your use of the Website and of any 
content, information or data accessed on or through the Website is at your own risk. We 
do not guarantee or make any warranties about the accuracy or completeness of any content, 
information or data accessed on or through the Website. Some content, information or data 
accessed on or through the Website may be inaccurate, incomplete or unfit for a particular purpose.<br></br>


<p className="text-sm text-center text-blue-300">
Intellectual Property<br></br>
                </p>
Using the Website does not give you ownership or license of any intellectual property rights 
in the website or in any content, information or data accessed on or through the Website, 
including content, information and data obtained from a third-party website.
It is your responsibility to comply with any copyright laws that govern the content, information 
or data accessed on or through the Website. Neither these Terms nor your use of the Website grant 
you any right to use any trademark or service-mark accessed on or through the Website. By making 
a query on the Website, you agree that we can store the query in log files, and use it to generate 
the results given back to you. You also agree that we may use your queries to evaluate and enhance 
performance of the Website and to study usage patterns.<br></br>


<p className="text-sm text-center text-blue-300">
Redistribution Rights and Personal Use<br></br>
                </p>
You hereby agree to not redistribute or share access to data or derived results from the data obtained 
from Mytrading.chat with anyone or any 3rd party without written approval from Mytrading.chat. 
All plan listed on Mytrading.chat website is strictly for personal use unless explicitly stated 
otherwise. Personal plan can’t be used by any business even internally without a written approval.<br></br>


<p className="text-sm text-center text-blue-300">
Refund Policy<br></br>
                </p>
We do not offer refund for any plans on our website. It’s your duty to cancel the subscription on 
time. You hereby agree to not use chargeback against our company in case of a dispute without reaching
out to our support first.<br></br>

<p className="text-sm text-center text-blue-300">
Account Limits and Access<br></br>
                </p>
You will have 1 account for Fundamental data and chat. Subscribing to multiple accounts is not allowed 
and all accounts may be deleted if discovered.<br></br>

Your access to Mytrading.chat will be revoked immediately should you choose to cancel your subscription.<br></br>

<p className="text-sm text-center text-blue-300">
Privacy<br></br>
                </p>
The Website collects some personal information from its users, which we may use to operate the Website, 
to evaluate and enhance performance of the Website and to study usage patterns. We will not share any of 
your personal information with any third party, except we may share personal information with another 
company in the event that we merge with or are acquired by that company. We may send you announcements, 
messages or other information, but you may choose to opt-out of these communications.<br></br>

Mytrading.chat will automatically delete inactive users from time to time. If you wish to resume the 
service, please create a new account.<br></br>

<p className="text-sm text-center text-blue-300">
Limitation of Liability<br></br>
                </p>
You agree to defend, indemnify and hold Mytrading.chat and its affiliates harmless from any and all claims, 
liabilities, costs and expenses, including reasonable attorney fees, arising in any way from your use of 
the Service or the placement or transmission of any message, information, Software and/or Service or other 
materials through the Software and/or Service by you or users of your account or related to any violation 
of these Terms and Conditions by you or users of your account.<br></br>

<p className="text-sm text-center text-blue-300">
Failure to Comply with Terms and Conditions and Termination<br></br>
                </p>
Subscription to this Software and/or Service may be terminated at any time, and without cause, by either 
Mytrading.chat or the Owner and/or Subscriber, upon notification by telephone or e-mail. You acknowledge 
and agree that we may terminate your password or account or deny you access to all or part of the Service 
without prior notice if you engage in any conduct or activities that we, in our sole discretion, believe 
violate any of these Terms and Conditions, violate the rights of Mytrading.chat or is otherwise 
inappropriate for continued access.<br></br>
</p>
                <div className="max-w-[225px] mx-auto font-normal text-slate-500 dark:text-slate-400 2xl:mt-12 mt-6 uppercase text-sm">
                  Already registered?
                  <Link
                    href={LINKS.LOGIN.HREF}
                    className="text-slate-900 dark:text-white font-medium hover:underline"
                  > <span className="text-sm  dark:text-blue-300 font-medium">
                 <a href="/login">Sign in</a><br></br> 
                  
                  </span>
                   
                  </Link>
                </div>
              </div>
              <div className="auth-footer text-center">
                {COPYRIGHT}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
