"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BiMenuAltRight } from "react-icons/bi";

const Nav = () => {
  const [showNav, setShowNav] = useState(false);
  const pathname = usePathname();

  const fullLinks = [
    { href: "/", text: "Home" },
    { href: "/docs", text: "Docs" },
    { href: "/about", text: "About" },
    { href: "/contact", text: "Contact" },
    { href: "/termsofservice", text: "Terms" },
    { href: "/privacypolicy", text: "Privacy Policy" },
  ];

  const links = [
    { href: "/", text: "Home" },
    { href: "/docs", text: "Docs" },
    { href: "/about", text: "About" },
    { href: "/contact", text: "Contact" },
  ];

  return (
    <>
      <header className="fixed top-0 right-0 left-0 flex justify-between items-center bg-[#222] text-white z-10 p-2 px-4 rounded-b-md shadow-lg">
        <div className="flex justify-center items-center">
          <Link href="/" className="text-3xl">
            <Image
              src="/assets/favicon.svg"
              alt="logo"
              width={35}
              height={35}
              className="object-contain my-2 shadow-md rounded-md"
            />
          </Link>
          <p className="text-2xl ml-2">CNG</p>
        </div>
        <div className="flex gap-x-10">
          <ul className="hidden justify-center items-center gap-x-10 md:flex">
            {links.map((link: { href: string; text: string }) => {
              const isActive = pathname === link.href;

              return (
                <li key={link.text}>
                  <Link
                    href={link.href}
                    className={`border-b hover:text-white hover:border-b-emerald-300 duration-300 ${
                      isActive
                        ? "text-white border-b-emerald-300"
                        : "text-slate-200 border-b-slate-200"
                    }`}
                  >
                    {link.text}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div
            className="text-xl cursor-pointer"
            onClick={() => setShowNav((prev) => !prev)}
          >
            <BiMenuAltRight />
          </div>
        </div>
      </header>
      <AnimatePresence>
        {showNav && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              aria-hidden="true"
              onClick={() => setShowNav(false)}
              className="fixed inset-[-20px] bg-black bg-opacity-30 backdrop-blur-sm z-[998]"
            ></motion.div>
            <motion.nav
              initial={{ opacity: 0, x: -50 }}
              exit={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="fixed left-0 top-2 bottom-2 bg-[#222] z-[999] rounded-r-md shadow-lg p-5 flex flex-col justify-between items-start"
            >
              <ul>
                {fullLinks.map((link: { href: string; text: string }) => {
                  const isActive = pathname === link.href;

                  return (
                    <li key={link.text} className="">
                      <Link
                        href={link.href}
                        className={`rounded-sm text-white font-semibold my-3 w-full p-2 inline-block text-xl border-b-2 ${
                          isActive
                            ? "border-emerald-300 text-white"
                            : "border-slate-200 text-slate-200 hover:text-white hover:border-b-emerald-300 duration-300"
                        }`}
                      >
                        {link.text}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <button className="rounded-md shadow-md py-3 px-10 bg-gradient-to-tr from-emerald-400 to-emerald-100 text-black font-bold text-lg">
                <a href="https://www.calng.app/">CNG App</a>
              </button>
            </motion.nav>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              exit={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="fixed right-0 top-2 bg-[#222] z-[999] rounded-l-md shadow-lg p-5 flex flex-col justify-between items-start text-white"
            >
              <p>On This Page</p>
              <ul className="mt-5 flex flex-col justify-center items-start gap-y-2">
                <li>
                  <a
                    href="#web-or-app"
                    className="hover:text-emerald-200 duration-200 font-semibold"
                  >
                    Web or app
                  </a>
                </li>
                <li className="ml-3">
                  <a
                    href="#browser-links"
                    className="hover:text-emerald-200 duration-200"
                  >
                    browser
                  </a>
                </li>
                <li className="ml-3">
                  <a
                    href="#app-links"
                    className="hover:text-emerald-200 duration-200"
                  >
                    apps
                  </a>
                </li>
                <li>
                  <a
                    href="#what-can-you-do"
                    className="hover:text-emerald-200 duration-200 font-semibold"
                  >
                    Functionality
                  </a>
                </li>
                <li className="ml-3">
                  <a
                    href="#major-functionality"
                    className="hover:text-emerald-200 duration-200"
                  >
                    major functionality
                  </a>
                </li>
                <li className="ml-3">
                  <a
                    href="#advanced-features"
                    className="hover:text-emerald-200 duration-200"
                  >
                    advanced features
                  </a>
                </li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
