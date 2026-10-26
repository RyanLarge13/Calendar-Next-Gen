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
        for (const name of ["events", "lists", "tasks", "notes", "users"]) {
          if (!myDb.objectStoreNames.contains(name)) {
            myDb.createObjectStore(name, { keyPath: "id" });
          }
        }

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
  // Offline-first data primitives. Values must be structured-clone compatible.
  // No network requests or automatic synchronization are performed here.
  static get entityStores() {
    return ["events", "lists", "tasks", "notes", "users"];
  }

  assertStore(name) {
    if (!IndexedDBManager.entityStores.includes(name)) {
      throw new Error(`Unsupported offline entity store: ${name}`);
    }
  }

  async transact(name, mode, operation) {
    this.assertStore(name);
    await this.ready;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(name, mode);
      const store = tx.objectStore(name);
      let result;
      let settled = false;
      const fail = () => {
        if (!settled) { settled = true; reject(tx.error || new Error("IndexedDB transaction failed")); }
      };
      tx.onerror = fail;
      tx.onabort = fail;
      try {
        const request = operation(store);
        request.onsuccess = () => { result = request.result; };
        request.onerror = () => { /* Transaction error handler rejects. */ };
        tx.oncomplete = () => {
          if (!settled) { settled = true; resolve(result); }
        };
      } catch (error) {
        settled = true;
        try { tx.abort(); } catch (_) { /* Already inactive. */ }
        reject(error);
      }
    });
  }

  async create(name, record) {
    this.assertRecord(record);
    return this.transact(name, "readwrite", (store) => store.add(record));
  }

  async read(name, id) {
    if (id === undefined || id === null) throw new Error("Record ID is required");
    return (await this.transact(name, "readonly", (store) => store.get(id))) ?? null;
  }

  async readAll(name) {
    return this.transact(name, "readonly", (store) => store.getAll());
  }

  async update(name, record) {
    this.assertRecord(record);
    // Put performs an upsert, supporting offline creation and editing.
    return this.transact(name, "readwrite", (store) => store.put(record));
  }

  async remove(name, id) {
    if (id === undefined || id === null) throw new Error("Record ID is required");
    await this.transact(name, "readwrite", (store) => store.delete(id));
    return true;
  }

  async replaceAll(name, records) {
    this.assertStore(name);
    if (!Array.isArray(records)) throw new TypeError("Expected an array of records");
    records.forEach((record) => this.assertRecord(record));
    await this.ready;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(name, "readwrite");
      const store = tx.objectStore(name);
      store.clear();
      for (const record of records) store.put(record);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  assertRecord(record) {
    if (!record || typeof record !== "object" || record.id === undefined || record.id === null) {
      throw new Error("Offline records require a non-null id");
    }
  }

  // Explicit domain helpers; names match the existing application data.
  createEvent(record) { return this.create("events", record); }
  getEvent(id) { return this.read("events", id); }
  getEvents() { return this.readAll("events"); }
  updateEvent(record) { return this.update("events", record); }
  deleteEvent(id) { return this.remove("events", id); }
  replaceEvents(records) { return this.replaceAll("events", records); }

  createList(record) { return this.create("lists", record); }
  getList(id) { return this.read("lists", id); }
  getLists() { return this.readAll("lists"); }
  updateList(record) { return this.update("lists", record); }
  deleteList(id) { return this.remove("lists", id); }
  replaceLists(records) { return this.replaceAll("lists", records); }

  createTask(record) { return this.create("tasks", record); }
  getTask(id) { return this.read("tasks", id); }
  getTasks() { return this.readAll("tasks"); }
  updateTask(record) { return this.update("tasks", record); }
  deleteTask(id) { return this.remove("tasks", id); }
  replaceTasks(records) { return this.replaceAll("tasks", records); }

  createNote(record) { return this.create("notes", record); }
  getNote(id) { return this.read("notes", id); }
  getNotes() { return this.readAll("notes"); }
  updateNote(record) { return this.update("notes", record); }
  deleteNote(id) { return this.remove("notes", id); }
  replaceNotes(records) { return this.replaceAll("notes", records); }

  createUser(record) { return this.create("users", record); }
  getUser(id) { return this.read("users", id); }
  getUsers() { return this.readAll("users"); }
  updateUser(record) { return this.update("users", record); }
  deleteUser(id) { return this.remove("users", id); }
  replaceUsers(records) { return this.replaceAll("users", records); }

}

export default IndexedDBManager;
