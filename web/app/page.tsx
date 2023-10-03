const Home = () => {
  return (
    <main>
      <section className="hero relative">
        <div
          aria-hidden
          className="h-screen flex flex-col justify-end items-start pl-6 pb-20 pr-2 bg-white bg-opacity-10 backdrop-blur-sm"
        >
          <h1 className="text-6xl font-semibold">Calendar Next Generation</h1>
          <h2 className="text-3xl mt-3">
            Organize, Create, Manage Deliver - climb your way to the future of
            success
          </h2>
          <p className="mt-3 mb-10">
            Become connected and organized. Transform into a more productive
            self and create a life of insync-ness
          </p>
          <button className="rounded-md shadow-md py-5 px-10 bg-gradient-to-tr from-amber-300 to-orange-400 font-bold text-lg">
            <a href="https://www.calng.app/">Try out Calendar Next Gen</a>
          </button>
        </div>
      </section>
      <section className="bg-[#222] py-3 pl-5 pr-2 text-white">
        <h2 className="text-2xl mt-40">
          Managing a few reminders and tasks is one thing, but to manage a life
          is another
        </h2>
      </section>
    </main>
  );
};

export default Home;
