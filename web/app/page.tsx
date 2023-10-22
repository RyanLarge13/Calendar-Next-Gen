import Image from "next/image";
import HeaderImg from "../public/assets/headerImg.svg";
import InstallLinks from "@/components/InstallLinks";

const Home = () => {
  return (
    <main>
      <section className="relative text-white bg-black pt-20 h-screen min-h-[600px] flex flex-col justify-end items-start">
        <Image
          src={HeaderImg}
          alt="header background"
          className="absolute inset-0 mt-[-5em] opacity-50 object-cover"
        />
        <div className="pl-6 pb-20 pr-2 max-w-[600px]">
          <h1 className="text-6xl font-semibold">
            Calendar
            <span className="bg-gradient-to-tr from-emerald-400 to-emerald-100 text-transparent bg-clip-text">
              {" "}
              Next
            </span>{" "}
            Generation
          </h1>
          <h2 className="text-3xl mt-3">
            Organize, Create, Manage Deliver - climb your way to the future of
            <span className="text-cyan-300"> success</span>
          </h2>
          <p className="mt-3 mb-10 max-w-[700px]">
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
        className="bg-[#222] py-20 pl-5 pr-2 lg:px-60 text-white min-h-screen flex flex-col justify-between items-start"
      >
        <div>
          <h2 className="text-5xl font-semibold mt-2 mb-3">
            Website or{" "}
            <span className="bg-gradient-to-tr from-emerald-400 to-emerald-100 text-transparent bg-clip-text">
              App
            </span>
            ??
          </h2>
          <p className="max-w-[700px]">
            Calendar Next Gen is a PWA! A cross platform web app that can be
            installed to <span className="text-cyan-300">ANY</span> device.
          </p>
          <p className="mt-3 max-w-[700px]">
            This means that no matter where you are or what device you are using
            this application is available to you on the web, or if you choose,
            right on your phone as an app, or a desktop app, even a tablet app!
          </p>
        </div>
        <InstallLinks />
        <a
          href="https://www.cng-web.vercel.app/docs"
          className="rounded-md shadow-md py-5 px-10 bg-gradient-to-tr from-emerald-400 to-emerald-100 text-black font-bold text-lg inline-block my-3 mt-5"
        >
          More Ways To Install
        </a>
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
        <p className="max-w-[700px]">
          There is a next generation full of functionality and purpose in this
          application.. Learn all about how to use this app and the things you
          can do to take advantage of every bit! Let's dive in..
        </p>
        <p className="max-w-[700px]">
          Let's start with a list before we dive in deeper. Here is the major
          and most popular content you can create with CNG
        </p>
        <h3
          id="major-functionality"
          className="text-3xl text-cyan-300 mt-10 mb-3"
        >
          Major Functionality
        </h3>
        <ul className="list-disc text-xl ml-4 max-w-[700px]">
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
          <li>
            Kanban Boards!? What do I need a kanban board for? Try it out and
            you will understand
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
        className="bg-[#222] text-white min-h-screen py-20 pl-5 pr-2"
      >
        <h2 className="bg-gradient-to-tr from-emerald-400 to-emerald-100 text-transparent bg-clip-text text-5xl font-semibold pt-2 mb-3">
          Events
        </h2>
      </section>
      <section
        id="lists-tasks"
        className="bg-black text-white min-h-screen py-20 pl-5 pr-2"
      >
        <h2 className="bg-gradient-to-tr from-emerald-400 to-emerald-100 text-transparent bg-clip-text text-5xl font-semibold pt-2 mb-3">
          List & Tasks
        </h2>
      </section>
      <section
        id="reminders"
        className="bg-[#222] text-white min-h-screen py-20 pl-5 pr-2"
      >
        <h2 className="bg-gradient-to-tr from-emerald-400 to-emerald-100 text-transparent bg-clip-text text-5xl font-semibold pt-2 mb-3">
          Reminders
        </h2>
      </section>
      <section
        id="advanced-features-section"
        className="bg-black text-white min-h-screen py-20 pl-5 pr-2"
      >
        <h2 className="bg-gradient-to-tr from-emerald-400 to-emerald-100 text-transparent bg-clip-text text-5xl font-semibold pt-2 mb-3">
          Advanced Features
        </h2>
      </section>
      <section
        id="conclusion"
        className="bg-[#222] text-white min-h-screen py-20 pl-5 pr-2"
      >
        <h2 className="text-5xl font-semibold pt-2 mb-3">
          Try Out{" "}
          <span className="bg-gradient-to-tr from-emerald-400 to-emerald-100 text-transparent bg-clip-text">
            C
          </span>
          anlendar{" "}
          <span className="bg-gradient-to-tr from-emerald-400 to-emerald-100 text-transparent bg-clip-text">
            N
          </span>
          ext{" "}
          <span className="bg-gradient-to-tr from-emerald-400 to-emerald-100 text-transparent bg-clip-text">
            G
          </span>
          en
        </h2>
        <p className="max-w-[700px] mb-2">
          This application is completely free to use to your desire. Dont forget
          to read more about what can be done in the{" "}
          <a href="https://cng-web.vercel.app/docs" className="text-cyan-300">
            docs
          </a>
          . I built this application to give people a great application that
          actually helps and inspires.
        </p>
        <p className="max-w-[700px]">
          Please note that the charge for advanced features is just to help me
          continue to build upon this application as support for PWA's grow. It
          is a one time charge and more of a contribution to me and my work.
          Every purchase is greatly appriciated.
        </p>
      </section>
    </main>
  );
};

export default Home;
