"use client";

import { AiFillChrome, AiFillAndroid, AiFillApple } from "react-icons/ai";
import {
  BsMicrosoft,
  BsBrowserEdge,
  BsBrowserFirefox,
  BsMeta,
} from "react-icons/bs";

const InstallLinks = () => {
  const browserLinks = [
    { title: "Chrome", icon: <AiFillChrome />, link: "https://www.calng.app/" },
    { title: "Edge", icon: <BsBrowserEdge />, link: "https://www.calng.app/" },
    {
      title: "Firefox",
      icon: <BsBrowserFirefox />,
      link: "https://www.calng.app/",
    },
  ];

  const appStoreLinks = [
    { title: "Play Store", icon: <AiFillAndroid />, link: "" },
    { title: "Apple Store", icon: <AiFillApple />, link: "" },
    { title: "Meta", icon: <BsMeta />, link: "" },
    { title: "Microsoft", icon: <BsMicrosoft />, link: "" },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-10 lg:gap-y-0 my-20 mr-2 lg:mr-0">
      <div
        id="browser-links"
        className="bg-gray-700 p-5 rounded-sm shadow-lg flex flex-col justify-between items-start min-h-[350px]"
      >
        <div>
          <h3 className="text-3xl font-semibold text-cyan-300">Browsers</h3>
          <p className="max-w-[700px] my-5">
            Calendar Next Gen will work in the browser just fine subtract a
            handle full of functionalities such as native notifications. But in
            the list of browsers below, each of these browsers allow you to
            natively install Calendar Next Gen to whatever device you are using.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center items-center">
          {browserLinks.map((link) => (
            <a
              href={link.link}
              className="rounded-full inline-block py-3 px-10 shadow-md bg-emerald-100 text-black font-bold"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
      <div
        id="app-links"
        className="bg-gray-700 p-5 rounded-sm shadow-lg flex flex-col justify-between items-start"
      >
        <div>
          <h3 className="text-3xl font-semibold text-cyan-300">App Stores</h3>
          <p className="max-w-[700px] my-5">
            Just click on any of the links below to install CNG with your
            favorite app store!
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center items-center">
          {appStoreLinks.map((link) => (
            <a
              href={link.link}
              className="rounded-full inline-block py-3 px-10 shadow-md bg-emerald-100 text-black font-bold"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstallLinks;
