class IndexedDBManager {
  constructor(request) {
    this.request = request;
    // Add event listeners
    this.request.addEventListener("success", this.handleSuccess.bind(this));
    this.request.addEventListener("error", this.handleError.bind(this));
    this.request.addEventListener(
      "upgradeneeded",
      this.handleUpgradeNeeded.bind(this)
    );
  }
  handleSuccess(event) {
    const db = event.target.result;
    // Perform database queries or operations
  }
  handleError(event) {
    console.log(`Error opening your local data storage: ${event}`);
  }
  handleUpgradeNeeded(event) {
    const db = event.target.result;
    // Perform database schema changes or initialization
  }
  // Example method for adding a new event
  addEvent(eventData) {
    const transaction = this.request.result.transaction("events", "readwrite");
    const objectStore = transaction.objectStore("events");
    const addRequest = objectStore.add(eventData);
    return new Promise((resolve, reject) => {
      addRequest.addEventListener("success", () => {
        resolve();
      });
      addRequest.addEventListener("error", () => {
        reject(new Error("Failed to add event"));
      });
    });
  }
  // Example method for retrieving events
  getEvents() {
    const transaction = this.request.result.transaction("events", "readonly");
    const objectStore = transaction.objectStore("events");
    const getAllRequest = objectStore.getAll();
    return new Promise((resolve, reject) => {
      getAllRequest.addEventListener("success", (event) => {
        const events = event.target.result;
        resolve(events);
      });
      getAllRequest.addEventListener("error", () => {
        reject(new Error("Failed to retrieve events"));
      });
    });
  }
}

export default IndexedDBManager;
