
const PatrolOfflineStorage = (() => {
  const DB_NAME = "CitiFieldPatrolOffline";
  const DB_VERSION = 1;
  const STORE = "pending_actions";

  function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, {
            keyPath: "id"
          });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function addAction(type, payload) {
    const db = await openDB();

    const action = {
      id: crypto.randomUUID(),
      type,
      payload,
      createdAt: new Date().toISOString(),
      status: "pending"
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).add(action);

      tx.oncomplete = () => resolve(action);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  async function getPendingActions() {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const request = tx.objectStore(STORE).getAll();

      request.onsuccess = () => {
        resolve(
          request.result
            .filter(a => a.status === "pending")
            .sort((a, b) =>
              a.createdAt.localeCompare(b.createdAt)
            )
        );
      };

      request.onerror = () => reject(request.error);
    });
  }

  async function removeAction(id) {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete(id);

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  async function countPending() {
    const actions = await getPendingActions();
    return actions.length;
  }

  return {
    addAction,
    getPendingActions,
    removeAction,
    countPending
  };
})();
