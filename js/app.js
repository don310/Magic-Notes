let db;

window.onload = function () {
  let request = indexedDB.open("magicNotesDB", 1);

  // Run this when the database is being created or upgraded
  request.onupgradeneeded = function (event) {
    db = event.target.result;
    let objectStore = db.createObjectStore("notes", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("text", "text", { unique: false });
    console.log("Database setup complete");
  };

  // If the database opens successfully
  request.onsuccess = function (event) {
    db = event.target.result;
    console.log("Database opened successfully");
    displayNotes();
  };

  // If there's an error opening the database
  request.onerror = function (event) {
    console.log("Error opening the database: ", event);
  };
};

// Function to add a note
document.getElementById("addbtn").addEventListener("click", function () {
  let noteText = document.getElementById("addtxt").value;
  if (noteText) {
    let transaction = db.transaction(["notes"], "readwrite");
    let objectStore = transaction.objectStore("notes");
    let request = objectStore.add({ text: noteText });

    request.onsuccess = function () {
      document.getElementById("addtxt").value = '';  // Clear the input after adding
      console.log("Note added");
      displayNotes();
    };

    request.onerror = function () {
      console.log("Error adding note");
    };
  } else {
    alert("Please add some text to the note.");
  }
});

// Function to display notes
function displayNotes() {
  let notesDiv = document.getElementById("notes");
  notesDiv.innerHTML = '';  // Clear current display

  let transaction = db.transaction(["notes"], "readonly");
  let objectStore = transaction.objectStore("notes");

  objectStore.openCursor().onsuccess = function (event) {
    let cursor = event.target.result;
    if (cursor) {
      let noteCard = `
        <div class="col-md-4 my-2">
          <div class="noteCard" style="width: 18rem">
            <div class="card-body">
              <h5 class="card-title">Note ${cursor.key}</h5>
              <p class="card-text">${cursor.value.text}</p>
              <a href="#" class="btn btn-primary" onclick="deleteNote(${cursor.key})">Delete Note</a>
            </div>
          </div>
        </div>`;
      notesDiv.innerHTML += noteCard;
      cursor.continue();  // Move to the next note
    } else {
      if (!notesDiv.innerHTML) {
        notesDiv.innerHTML = "<p>No notes to display.</p>";
      }
    }
  };
}

// Function to delete a note
function deleteNote(id) {
  let transaction = db.transaction(["notes"], "readwrite");
  let objectStore = transaction.objectStore("notes");
  let request = objectStore.delete(id);

  request.onsuccess = function () {
    console.log("Note deleted");
    displayNotes();
  };

  request.onerror = function () {
    console.log("Error deleting note");
  };
}


const toggleSwitch = document.getElementById('toggleSwitch');
const body = document.body;

// Toggle dark mode on click
toggleSwitch.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
});