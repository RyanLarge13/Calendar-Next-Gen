import { useState, useEffect } from "react";
import { CalngDesktop, CalngMobile, Hero1 } from "../../assets/index.js";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import Menu from "./components/Menu";

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const translateY = -scrollY * 0.2;

  return (
    <main className="">
      <Menu />
      <div className="grade-landing-page fixed top-40 left-10 blur-3xl rounded-full w-40 h-40 opacity-25 bg-gradient-to-r from-fuchsia-500 to-orange-500"></div>
      <div className="grade-landing-page fixed top-40 right-10 blur-2xl rounded-full w-40 h-40 opacity-25 bg-gradient-to-r from-purple-500 to-cyan-500"></div>
      <div className="grade-landing-page fixed bottom-60 left-20 blur-2xl rounded-full w-60 h-60 opacity-10 bg-gradient-to-r from-red-500 to-yellow-500"></div>
      <div className="absolute top-0 right-0 left-0 max-w-[100vw] overflow-x-hidden z-[-1]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 800"
          height="800"
        >
          <path
            fill="#5000ca"
            fill-opacity="1"
            d="M0,640L60,618.7C120,597,240,555,360,549.3C480,544,600,576,720,602.7C840,629,960,651,1080,645.3C1200,640,1320,608,1380,592L1440,576L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          ></path>
        </svg>
      </div>
      <div className="p-5 text-white">
        <h1 className="text-7xl mb-3">Calendar Next Gen</h1>
        <p className="ml-3">- For The Organized</p>
        <div className="mt-20 relative">
          <img
            src={CalngDesktop}
            alt="desktop"
            className="rounded-lg shadow-lg"
            height={150}
            width={300}
          />
          <motion.img
            initial={{ opacity: 0, y: 50 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.5, duration: 1 },
            }}
            src={CalngMobile}
            alt="mobile"
            className="rounded-lg shadow-lg absolute top-10 right-0"
            width={150}
            height={300}
          />
        </div>
        <div className="mt-10">
          <NavLink
            to="/"
            end
            className="px-5 py-2 rounded-full shadow-lg bg-white text-black font-semibold"
          >
            Go To App
          </NavLink>
        </div>
      </div>
      <div
        style={{ transform: `translateY(${translateY}px)` }}
        className="h-screen absolute z-[-10] mt-[-1em]"
      >
        <img src={Hero1} alt="hero-img" className="h-full" />
      </div>
      <h2 className="text-5xl font-semibold mt-40 p-5 bg-white rounded-md shadow-lg mx-5 bg-opacity-30 backdrop-blur-sm">
        Oh, The <span className="text-violet-500">Things</span> You Can Do...
      </h2>
      <div className="flex flex-wrap justify-center items-center gap-3 my-10 p-3">
        <button className="px-3 py-1 bg-black font-semibold shadow-lg rounded-full text-white">
          Create Events
        </button>
        <button className="px-3 py-1 bg-black font-semibold shadow-lg rounded-full text-white">
          Kanban Board Orginization
        </button>
        <button className="px-3 py-1 bg-black font-semibold shadow-lg rounded-full text-white">
          Sticky Notes
        </button>
        <button className="px-3 py-1 bg-black font-semibold shadow-lg rounded-full text-white">
          Appointments & Group Events
        </button>
        <button className="px-3 py-1 bg-black font-semibold shadow-lg rounded-full text-white">
          Lists & Tasks
        </button>
        <button className="px-3 py-1 bg-black font-semibold shadow-lg rounded-full text-white">
          Set Reminders
        </button>
      </div>
      <section id="events" className="bg-[#222] h-screen text-white p-5">
        <h3 className="text-4xl mb-3">Events</h3>
        <p>
          Creating an event is not only a way of tracking a task or keeping a
          reminder of what is to come. It is a part of your life. An event can
          be anything it wants to be, as big and as important as you want it to
          be. It's a memory, a location in time, a moment of significance. And
          now you can choose.
        </p>
      </section>
    </main>
  );
};

export default LandingPage;
