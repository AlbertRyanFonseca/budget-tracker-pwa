const request = indexedDB.open("budget, 1");
let db;

request.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
}

request.onsuccess = (event) => {
    db = event.target.result;
}