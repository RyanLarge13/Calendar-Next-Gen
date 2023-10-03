"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
      <header className="fixed top-0 right-0 left-0 flex justify-between items-center bg-white bg-opacity-75 backdrop-blur-sm z-10 p-4 rounded-b-md shadow-md">
        <Link href="/" className="text-3xl">
          {/*<Image
          src="/assets/favicon.svg"
          alt="logo"
          width={30}
          height={30}
          className="object-contain my-2 shadow-lg rounded-md"
        />*/}
          CNG
        </Link>
        <div className="flex gap-x-10">
          <ul className="hidden justify-center items-center gap-x-10 md:flex">
            {links.map((link: { href: string; text: string }) => {
              const isActive = pathname === link.href;

              return (
                <li key={link.text}>
                  <Link
                    href={link.href}
                    className={`${isActive ? "underline" : "text-black"}`}
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
      {showNav && (
        <motion.nav
          initial={{ opacity: 0, x: "50%" }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed left-0 top-0 bottom-0 bg-white z-[999] rounded-sm shadow-lg p-5"
        >
          <ul>
            {fullLinks.map((link: { href: string; text: string }) => {
              const isActive = pathname === link.href;

              return (
                <li key={link.text} className="">
                  <Link
                    href={link.href}
                    className={`rounded-md shadow-md my-5 w-full p-3 inline-block text-xl ${
                      isActive
                        ? "bg-gradient-to-tr from-cyan-300 to-cyan-100"
                        : " bg-gradient-to-tr from-amber-300 to-red-400"
                    }`}
                  >
                    {link.text}
                  </Link>
                </li>
              );
            })}
          </ul>
        </motion.nav>
      )}
    </>
  );
};

export default Nav;
