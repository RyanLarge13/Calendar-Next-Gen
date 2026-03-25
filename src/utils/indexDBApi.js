class IndexedDBManager {
  constructor(request) {
    this.db = null;

    this.ready = new Promise((resolve, reject) => {
      request.addEventListener("success", (event) => {
        this.db = event.target.result;
        resolve(this.db);
      });

      request.addEventListener("error", (event) => {
        console.log(
          "Error opening your local data storage:",
          event.target.error,
        );
        reject(event.target.error);
      });

      request.addEventListener("upgradeneeded", (event) => {
        const myDb = event.target.result;

        if (!myDb.objectStoreNames.contains("auth")) {
          const objStore = myDb.createObjectStore("auth", { keyPath: "id" });
          objStore.createIndex("token", "token", { unique: false });
        }

        if (!myDb.objectStoreNames.contains("locations")) {
          const objStore = myDb.createObjectStore("locations", {
            keyPath: "id",
          });
          objStore.createIndex("locations", "locations", { unique: false });
        }
      });
    });
  }

  async getUserLocations() {
    await this.ready;

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(["locations"], "readonly");
      const store = tx.objectStore("locations");
      const req = store.get(0);

      req.onsuccess = () => {
        const record = req.result;
        resolve(record?.locations ?? []);
      };

      req.onerror = () => {
        reject(req.error);
      };
    });
  }

  async setUserLocations(newLocations) {
    await this.ready;

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(["locations"], "readwrite");
      const store = tx.objectStore("locations");

      const req = store.put({ id: 0, locations: newLocations });

      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  async getAuthToken() {
    await this.ready;

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(["auth"], "readonly");
      const store = tx.objectStore("auth");
      const req = store.get(0);

      req.onsuccess = () => {
        resolve(req.result ? req.result.token : null);
      };

      req.onerror = () => reject(req.error);
    });
  }

  async setIndexedDBAuthToken(token) {
    await this.ready;

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(["auth"], "readwrite");
      const store = tx.objectStore("auth");

      const req = store.put({ id: 0, token });

      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  async removeAuth() {
    await this.ready;

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(["auth"], "readwrite");
      const store = tx.objectStore("auth");
      const req = store.delete(0);

      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
      tx.onabort = () => reject(tx.error);
    });
  }
}
