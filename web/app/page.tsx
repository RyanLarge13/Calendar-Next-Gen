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
            Generation
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
      <section className="bg-[#222] py-3 pl-5 pr-2 text-white">
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
      <section className="bg-black text-white">
        <h3 className="text-2xl">
          Managing a few reminders and tasks is one thing, but to manage your
          life is another
        </h3>
        <p>Pocket</p>
      </section>
    </main>
  );
};

export default Home;
