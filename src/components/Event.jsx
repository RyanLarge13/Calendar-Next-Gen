const Event = ({ event }) => {
  return (
    <div className="fixed inset-0 bg-white z-50">
      <h1>{event.summary}</h1>
    </div>
  );
};

export default Event;
