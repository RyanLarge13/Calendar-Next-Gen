const Home = () => {
  return (
    <main className="mt-40 p-3">
      <div aria-hidden className="overflow-hidden">
        <div className="absolute top-0 left-0 right-0 bottom-60 rotate-[45deg] bg-gradient-to-tr from-fuchsia-300 to-red-400 z-[-1]"></div>
      </div>
      <h1 className="text-7xl font-semibold">
        Calendar{" "}
        <span className="bg-gradient-to-tr from-cyan-300 to-cyan-100 text-transparent bg-clip-text">
          Next{" "}
        </span>
        Generation
      </h1>
      <h2 className="text-5xl mt-3">Organize, Create, Manage, Deliver</h2>
    </main>
  );
};

export default Home;
