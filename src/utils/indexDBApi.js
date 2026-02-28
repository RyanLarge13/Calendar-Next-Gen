class IndexedDBManager {
  constructor(request) {
    this.request = request;
    this.request.addEventListener("success", this.handleSuccess.bind(this));
    this.request.addEventListener("error", this.handleError.bind(this));
    this.request.addEventListener(
      "upgradeneeded",
      this.handleUpgradeNeeded.bind(this),
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

  handleUpgradeNeeded(event) {
    const myDb = event.target.result;
    if (myDb.objectStoreNames.contains("events")) {
      myDb.deleteObjectStore("events");
    }
    if (!myDb.objectStoreNames.contains("auth")) {
      const objStore = myDb.createObjectStore("auth", { keyPath: "id" });
      objStore.createIndex("token", "token", { unique: false });
    }
    if (!myDb.objectStoreNames.contains("locations")) {
      const objStore = myDb.createObjectStore("locations", { keyPath: "id" });
      objStore.createIndex("locations", "locations", { unique: false });
    }
  }

  setIndexedDBAuthToken(token) {
    if (this.db) {
      const tx = this.db.transaction(["auth"], "readwrite");
      const objStore = tx.objectStore("auth");

      objStore.clear().onsuccess = () => {
        console.log("Existing auth tokens cleared from IndexedDB");
        const addTx = this.db.transaction(["auth"], "readwrite");
        const addObjStore = addTx.objectStore("auth");
        addObjStore.add({ id: 0, token: token }).onsuccess = () => {
          console.log("Auth token set successfully in IndexedDB");
        };
      };

      objStore.clear().onerror = (event) => {
        console.error(
          "Error clearing auth tokens from IndexedDB:",
          event.target.error,
        );
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

  getUserLocations() {
    return new Promise((resolve, reject) => {
      if (!this.db) return resolve([]);

      const tx = this.db.transaction(["locations"], "readonly");
      const store = tx.objectStore("locations");

      const req = store.get(0);

      req.onsuccess = () => {
        const record = req.result;
        resolve(record?.locations ?? []);
        console.log("Successfully got locations from inside indexedDB.");
        console.log(record);
        console.log(record?.locations);
      };

      req.onerror = (err) => {
        console.log("Error grabbing locations from indexedDB");
        console.log(err);
        return reject(req.error);
      };
    });
  }

  setUserLocations(newLocations) {
    return new Promise((resolve, reject) => {
      if (!this.db) return resolve(false);

      const tx = this.db.transaction(["locations"], "readwrite");
      const store = tx.objectStore("locations");

      const clearReq = store.clear();

      clearReq.onsuccess = () => {
        const addReq = store.put({ id: 0, locations: newLocations });
        addReq.onsuccess = () => resolve(true);
        addReq.onerror = () => reject(addReq.error);
      };

      clearReq.onerror = () => reject(clearReq.error);

      tx.onabort = () => reject(tx.error);
    });
  }
}

export default IndexedDBManager;
