class IndexedDBManager {
  constructor(request) {
    this.request = request;
    this.request.addEventListener("success", this.handleSuccess.bind(this));
    this.request.addEventListener("error", this.handleError.bind(this));
    this.request.addEventListener(
      "upgradeneeded",
      this.handleUpgradeNeeded.bind(this)
    );
    this.db = null;
  }

  handleSuccess(event) {
    const myDb = event.target.result;
    this.db = myDb;
  }

  handleError(event) {
    console.log(`Error opening your local data storage: ${event}`);
  }
  // Run update on every new version
  handleUpgradeNeeded(event) {
    const myDb = event.target.result;
    if (myDb.objectStoreNames.contains("events")) {
      myDb.deleteObjectStore("events");
    }
    if (!myDb.objectStoreNames.contains("auth")) {
      const objStore = myDb.createObjectStore("auth", { keyPath: "id" });
      objStore.createIndex("token", "token", { unique: false });
    }
  }
  setAuthToken(token) {
    if (this.db) {
      const tx = this.db.transaction(["auth"], "readwrite");
      const objStore = tx.objectStore("auth");
      objStore.clear().onsuccess = () => {
        objStore.add({ id: 0, token: token });
        console.log("Auth token set successfully in indexedDB");
      };
    }
  }
  getAuthToken() {
    if (this.db) {
      const tx = this.db.transaction(["auth"], "readonly");
      const objStore = tx.objectStore("auth");
      const req = objStore.get(0);
      req.onsuccess = () => (req.result ? req.result.token : null);
    }
  }
  removeAuth() {
    if (this.db) {
      const tx = this.db.transaction(["auth"], "readwrite");
      const objStore = tx.objectStore("auth");
      objStore.delete(0).onsuccess = () => {
        console.log("auth token removed");
      };
    }
  }
}

export default IndexedDBManager;
