const request = indexedDB.open("budget, 1");
let db;

request.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
}

request.onsuccess = (event) => {
    db = event.target.result;
}

function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    store.add(record);
}

function dbCheck() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();

    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            fetch("/api/transation/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: { Accept: "application/json, text/plain, */*", "Content-Type": "application/json", },
            })
                .then((response) => response.json())
                .then(() => {
                    const transaction = db.transaction(["pending"], "readewrite");
                    const store = transaction.objectStore("pending");
                    store.clear();
                })
        }
    }
}

window.addEventListener("online", dbCheck);