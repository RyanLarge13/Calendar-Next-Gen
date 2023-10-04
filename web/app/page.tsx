import Image from "next/image";

const Home = () => {
  return (
    <main>
      <section className="relative text-white bg-black pt-20 h-screen flex flex-col justify-end items-start">
        <div className="pl-6 pb-20 pr-2">
          <h1 className="text-6xl font-semibold">
            Calendar{" "}
            <span className="bg-gradient-to-tr from-cyan-300 to-cyan-100 text-transparent bg-clip-text">
              Next
            </span>{" "}
            Generation
          </h1>
          <h2 className="text-3xl mt-3">
            Organize, Create, Manage Deliver - climb your way to the future of
            <span className="text-purple-400"> success</span>
          </h2>
          <p className="mt-3 mb-10">
            Become connected and organized. Transform into a more productive
            self and create a life of insync-ness
          </p>
          <button className="rounded-md shadow-md py-5 px-10 bg-gradient-to-tr from-cyan-300 to-cyan-100 text-black font-bold text-lg">
            <a href="https://www.calng.app/">Try out Calendar Next Gen</a>
          </button>
        </div>
      </section>
      <section className="bg-[#222] py-3 pl-5 pr-2 text-white">
        <h2 className="text-2xl mt-20">
          Managing a few reminders and tasks is one thing, but to manage a life
          is another
        </h2>
        <p>Pocket</p>
      </section>
    </main>
  );
};

export default Home;
