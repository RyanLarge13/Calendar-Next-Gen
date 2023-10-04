"use client";

import { AiFillChrome, AiFillAndroid, AiFillApple } from "react-icons/ai";
import {
  BsMicrosoft,
  BsBrowserEdge,
  BsBrowserFirefox,
  BsMeta,
} from "react-icons/bs";

const InstallLinks = () => {
  const links = [
    { title: "Chrome", icon: <AiFillChrome />, link: "https://www.calng.app/" },
    { title: "Play Store", icon: <AiFillAndroid />, link: "" },
    { title: "Apple Store", icon: <AiFillApple />, link: "" },
    { title: "Meta", icon: <BsMeta />, link: "" },
    { title: "Microsoft", icon: <BsMicrosoft />, link: "" },
    { title: "Edge", icon: <BsBrowserEdge />, link: "https://www.calng.app/" },
    {
      title: "Firefox",
      icon: <BsBrowserFirefox />,
      link: "https://www.calng.app/",
    },
  ];
  return (
    <div className="flex flex-wrap gap-3 justify-start items-center mt-5 mb-5">
      {links.map((link: { title: string; icon: string; link: string }) => (
        <a
          href={link.link}
          className="rounded-full inline-block py-3 px-10 shadow-md bg-emerald-100 text-black font-bold"
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
};

export default InstallLinks;
