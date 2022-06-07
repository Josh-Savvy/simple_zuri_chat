var currentDate = new Date().toLocaleString([], {
  hour: "2-digit",
  minute: "2-digit",
});
var room = document.getElementById("room");

function myMessageOutput(db, message) {
  const myMsgDiv = document.createElement("div");
  myMsgDiv.classList.add(
    "myMessage",
    "bg-blue-300",
    "break-words",
    "mx-4",
    "my-2",
    "py-4",
    "px-2",
    "rounded-lg",
    "relative"
  );
  myMsgDiv.innerHTML = ` 
  <span class="text-zinc-600 text-sm absolute left-2 top-1 mb-1">Me</span>
  ${message}
  <span class="text-zinc-600 text-sm absolute right-2 bottom-1 mt-1">${currentDate}</span> 
  ` ;
  document.querySelector("#chat-wrapper").appendChild(myMsgDiv);
  /*******
   * ***
   * Save message to db
   * ****/
  var tx = db.transaction("myMessages", "readwrite");
  var store = tx.objectStore("myMessages");
  store.put({
    message: message,
    user: "Me",
    time: currentDate,
    room: room.value,
    color: "bg-blue-300",
  });
  tx.done;
}

function otherMessageOutput(db, username, otherMessage) {
  const otherMsgDiv = document.createElement("div");
  otherMsgDiv.classList.add(
    "otherMessage",
    "bg-zinc-300",
    "break-words",
    "mx-4",
    "my-2",
    "py-4",
    "px-2",
    "rounded-lg",
    "relative"
  );
  otherMsgDiv.innerHTML = `
  <span class="text-zinc-600 text-sm absolute left-2 top-1 mb-1">${username}</span>
  
  ${otherMessage} 
  <span class="text-zinc-600 text-sm absolute right-2 bottom-1 mt-1">${currentDate}</span> 

  `;
  document.querySelector("#chat-wrapper").appendChild(otherMsgDiv);

  /*******
   * ***
   * Save message to db
   * ****/
  var tx = db.transaction("otherMessages", "readwrite");
  var store = tx.objectStore("otherMessages");

  store.put({
    message: otherMessage,
    user: username,
    time: currentDate,
    room: room.value,
    color: "bg-zinc-300",
  });
  tx.done;
}
