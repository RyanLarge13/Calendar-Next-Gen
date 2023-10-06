import Image from "next/image";
import InstallLinks from "@/components/InstallLinks";

const Home = () => {
  return (
    <main>
      <section className="relative text-white bg-black pt-20 h-screen min-h-[600px] flex flex-col justify-end items-start">
        <div className="pl-6 pb-20 pr-2">
          <h1 className="text-6xl font-semibold">
            Calendar
            <span className="bg-gradient-to-tr from-emerald-400 to-emerald-100 text-transparent bg-clip-text">
              {" "}
              Next
            </span>{" "}
            Gen
          </h1>
          <h2 className="text-3xl mt-3">
            Organize, Create, Manage Deliver - climb your way to the future of
            <span className="text-cyan-300"> success</span>
          </h2>
          <p className="mt-3 mb-10">
            Become connected and organized. Transform into a more productive
            self and create a life of insync-ness
          </p>
          <button className="rounded-md shadow-md py-5 px-10 bg-gradient-to-tr from-emerald-400 to-emerald-100 text-black font-bold text-lg">
            <a href="https://www.calng.app/">Try out Calendar Next Gen</a>
          </button>
        </div>
      </section>
      <section
        id="web-or-app"
        className="bg-[#222] py-20 pl-5 pr-2 text-white min-h-screen"
      >
        <h2 className="text-5xl font-semibold mt-2 mb-3">
          Website or{" "}
          <span className="bg-gradient-to-tr from-emerald-400 to-emerald-100 text-transparent bg-clip-text">
            App
          </span>
          ??
        </h2>
        <p>
          Calendar Next Gen is a PWA! A cross platform web app that can be
          installed to <span className="text-cyan-300">ANY</span> device.
        </p>
        <p className="mt-3">
          This means that no matter where you are or what device you are using
          this application is available to you on the web, or if you choose,
          right on your phone as an app, or a desktop app, even a tablet app!
        </p>
        <a
          href="https://www.cng-web.vercel.app/docs"
          className="rounded-md shadow-md py-5 px-10 bg-gradient-to-tr from-emerald-400 to-emerald-100 text-black font-bold text-lg inline-block my-3 mt-5"
        >
          How do I install it?
        </a>
        <InstallLinks />
      </section>
      <section
        id="what-can-you-do"
        className="bg-black text-white min-h-screen py-20 pl-5 pr-2"
      >
        <h2 className="text-5xl font-semibold pt-2 mb-3">
          What Is So{" "}
          <span className="bg-gradient-to-tr from-emerald-400 to-emerald-100 text-transparent bg-clip-text">
            Great
          </span>
          ??
        </h2>
        <p>
          There is a next generation full of functionality and purpose in this
          application.. Learn all about how to use this app and the things you
          can do to take advantage of every bit! Let's dive in..
        </p>
        <p>
          Let's start with a list before we dive in deeper. Here is the major
          and most popular content you can create with CNG
        </p>
        <h3 id="major-functionality" className="text-3xl text-cyan-300 mt-10 mb-3">
          Major Functionality
        </h3>
        <ul className="list-disc text-xl ml-4">
          <li>Create & manage Events</li>
          <li>Set Reminders & important notifications</li>
          <li>
            Colaborate with groups and set important events with documents and
            photos
          </li>
          <li>Manage, reschedule & link appointments</li>
          <li>
            Build a list, generalize it or connect it with your events, or any
            other content
          </li>
          <li>
            Build tasks as well... But isn't a task the same as a list? Not with
            CNG
          </li>
          <li>
            Pin sticky notes to your UI and keep important and urgent
            information up front and in view
          </li>
        </ul>
        <h3
          id="advanced-features"
          className="text-3xl text-cyan-300 mt-10 mb-3"
        >
          Advanced Features
        </h3>
        <ul className="list-disc text-xl ml-4">
          <li>AI Scheduling</li>
          <li>Project Mamagment</li>
          <li>Regimine Creator</li>
        </ul>
      </section>
      <section
        id="events"
        className="bg-black text-white min-h-screen py-20 pl-5 pr-2"
      ></section>
    </main>
  );
};

export default Home;
