"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BiMenuAltRight } from "react-icons/bi";
import { useState } from "react";

const Nav = () => {
  const [showNav, setShowNav] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 flex justify-between items-center bg-white z-10 py-2 px-5 rounded-b-sm shadow-sm">
      <Link href="/">
        <Image
          src="/assets/favicon.svg"
          alt="logo"
          width={50}
          height={50}
          className="object-contain my-2 shadow-lg rounded-md"
        />
      </Link>
      <div className="flex gap-x-10">
        <ul className="flex justify-center items-center gap-x-10">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="docs">Docs</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="contact">Contact</Link>
          </li>
        </ul>
        <div
          className="text-3xl cursor-pointer"
          onClick={() => setShowNav(true)}
        >
          <BiMenuAltRight />
        </div>
      </div>
      {showNav && (
        <motion.nav
          initial={{ opacity: 0, x: "50%" }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed inset-5 bg-white z-20 rounded-sm shadow-lg"
        ></motion.nav>
      )}
    </header>
  );
};

export default Nav;
